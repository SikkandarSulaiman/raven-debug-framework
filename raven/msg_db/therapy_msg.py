import json
import struct
from pathlib import Path, os
from collections import namedtuple
from random import randint
from struct import unpack, pack

import pandas as pd

from raven.utils import Observable

artifacts_abspath = Path(os.getcwd()) / r'artifacts'
workbook_name = r'msg_enum.xlsx'
df_eventlog_type = pd.read_excel(artifacts_abspath / workbook_name, 'event_log_type')
df_datalog_type = pd.read_excel(artifacts_abspath / workbook_name, 'data_log_type')
df_datalog_type = df_datalog_type.where(pd.notnull(df_datalog_type), None)

log_structs_info = {}
book = pd.ExcelFile(artifacts_abspath / r'log_c_structures.xlsx')
for sheetname in book.sheet_names:
    if sheetname != 'config':
        df = book.parse(sheetname)
        log_structs_info[int(df['common_id'][0])] = {
            'size_in_bytes': list(df['bytes']),
            'msg_list': [i if type(i) is str else None for i in df['msg']]
        }

with open(artifacts_abspath / r'message_type.json') as fp:
    message_type_cfg = json.load(fp)
with open(artifacts_abspath / r'msg_val_strings.json') as fp:
    payload_strings_map = json.load(fp)
with open(artifacts_abspath / r'msg_ids_name_to_val.json', 'r') as fp:
    msg_db_name_to_val = json.load(fp)
with open(artifacts_abspath / r'msg_ids_val_to_name.json', 'r') as fp:
    msg_db_val_to_name = json.load(fp)


def get_msg_for_ui_id(id):
    return df_eventlog_type.loc[df_eventlog_type['dom_trigger_id'] == id, 'msg_id']


class Message(Observable):

    def __init__(self, data, priority=64, msgtype=0, payload=0, uniq_id=0, keep_as_bytes=False, notify_now=False):
        super().__init__()
        self.therapymsg_t = namedtuple('therapymsg_t', message_type_cfg['msg_fields'])
        self.tmsg_cstruct_fmt = message_type_cfg['msg_alignment']
        if type(data) is bytes:  # msg as byte array
            self.f16 = self.unpack_therapy_msg(data)
        elif type(data) is int:  # msg_id as integer
            self.f16 = self.pack_therapy_msg(data, priority, msgtype, payload, uniq_id)
        elif type(data) is str:  # msg_id as string
            msg_id = msg_db_name_to_val[data]
            if type(payload) is not bytes: payload = int.to_bytes(payload, 4, 'little')
            self.f16 = self.pack_therapy_msg(msg_id, priority, msgtype, payload.ljust(4, b'\x00'), uniq_id)
        else:
            raise AttributeError('Invalid data')

        # keep_as_bytes is set for tx_msgs, flag not applicable if msg is given as bytearray
        self.dir = 'rx'
        if not keep_as_bytes and type(data) is not bytes:
            self.f16 = self.unpack_therapy_msg(self.f16)
            self.dir = 'tx'
        self.fmt_payloads = None
        self.fmt_payloads_set = False
        if notify_now:
            self.trigger_notification()

    def pack_therapy_msg(self, msg_id, priority, msgtype, payload_in_bytes, uniq_id):
        if uniq_id is None:
            uniq_id = randint(0, 65535)
        msgobj = self.therapymsg_t._make([0x55, priority, uniq_id, int(msg_id), 0, msgtype, *payload_in_bytes, 0, 0xAA])
        return pack(self.tmsg_cstruct_fmt, *msgobj)

    def unpack_therapy_msg(self, msg_bytes):
        try:
            return self.therapymsg_t._make(unpack(self.tmsg_cstruct_fmt, msg_bytes))
        except:
            pass

    # Fire all observer callbacks
    def trigger_notification(self):
        self.notify_observers(self)

    @staticmethod
    def is_valid_msg(rx_bytes):
        return len(rx_bytes) == 16 and rx_bytes[0] == 0x55 and rx_bytes[-1] == 0xAA

    @staticmethod
    def is_valid_content(rx_bytes):
        return rx_bytes[0] == 0xA5 or rx_bytes[-1] == 0x5A

    @staticmethod
    def get_content_id(rx_bytes):
        return rx_bytes[10]

    @staticmethod
    def is_control_msg(rx_bytes):
        return ((1 << 3) & rx_bytes[9]) > 0

    @staticmethod
    def is_assert_msg(rx_bytes):
        return ((1 << 4) & rx_bytes[9]) > 0

    def is_assertlog(self):
        return ((1 << 4) & self.f16.msg_type) > 0

    def is_eventlog(self):
        return ((1 << 2) & self.f16.msg_type) > 0

    def is_datalog(self):
        return ((1 << 1) & self.f16.msg_type) > 0

    def is_payload_timestamp(self):
        return ((1 << 5) & self.f16.msg_type) > 0

    def get_msg_name(self):
        try:
            msg_name = msg_db_val_to_name[str(self.f16.msg_id)]
        except:
            msg_name = f'{self.f16.msg_id:08X}'
        return msg_name

    def get_payload_str(self):
        # Find readable string for numerical payload, if available
        payload_vals = self.get_payload()
        payload_str = []
        msg_name = self.get_msg_name()
        for i, payload_val in enumerate(payload_vals):
            try:
                payload_str.append(payload_strings_map[msg_name][i][str(payload_val)])
            except KeyError:
                payload_str.append(payload_val)
        return tuple(payload_str)

    def get_payload(self):
        # return payload if already calculated
        if self.fmt_payloads_set:
            return self.fmt_payloads

        # set calculated flag for upcoming usage
        self.fmt_payloads_set = True
        self.fmt_payloads = (0,)

        # Find payload type
        msg_name = self.get_msg_name()
        try:
            payload_datatype = df_datalog_type.loc[df_datalog_type['msg_id'] == msg_name, 'datatype'].iloc[0]
            payload_size = struct.calcsize(payload_datatype)
            if payload_size not in range(1, 4 + 1):
                print(f'Invalid payload format for {msg_name}')
                return self.fmt_payloads
        except Exception as e:
            # treat unspecified type as uint32
            payload_datatype, payload_size = 'I', 4

        # discard unused bytes based on calculated payload size
        required_payload_bytes = bytes([self.f16.p0, self.f16.p1, self.f16.p2, self.f16.p3])[:payload_size]
        try:
            self.fmt_payloads = struct.unpack(payload_datatype, required_payload_bytes)
        except struct.error:
            print(f'datatype {payload_datatype}')
            print(f'payload size {payload_size}')
            print(f'required payload bytes {required_payload_bytes}')
        return self.fmt_payloads
