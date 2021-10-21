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
    if sheetname not in ['config']:
        df = book.parse(sheetname)
        log_structs_info[int(df['common_id'][0])] = {
            'size_in_bytes': list(df['bytes']),
            'msg_list': [i if type(i) is str else None for i in df['msg']]
        }

with open(artifacts_abspath / r'msg_val_strings.json') as fp:
    payload_strings_map = json.load(fp)

with open(artifacts_abspath / r'msg_ids_name_to_val.json', 'r') as fp:
    msg_db_name_to_val = json.load(fp)
with open(artifacts_abspath / r'msg_ids_val_to_name.json', 'r') as fp:
    msg_db_val_to_name = json.load(fp)


def get_msg_for_ui_id(id):
    return df_eventlog_type.loc[df_eventlog_type['dom_trigger_id'] == id, 'msg_id']


class Message(Observable):

    def __init__(self, data, priority=0, msgtype=0, payload=0, uniq_id=0, keep_as_bytes=False, notify_now=False):
        self.therapymsg_t = namedtuple('therapymsg_t',
                                       'start_byte priority uniq_id msg_id ack msg_type p0 p1 p2 p3 crc stop_byte')
        self.tmsg_cstruct_fmt = 'BBHIbBBBBBBB'
        if type(data) is bytes:
            self.f16 = self.unpack_therapy_msg(data)
            if not self.validate():
                self.f16 = None
                raise ValueError('Invalid start/stop bytes')
                # return
        elif type(data) is int:
            self.f16 = self.pack_therapy_msg(data, priority, msgtype, payload, uniq_id)
        elif type(data) is str:
            msg_id = msg_db_name_to_val[data]
            if type(payload) is not bytes: payload = int.to_bytes(payload, 4, 'little')
            self.f16 = self.pack_therapy_msg(msg_id, priority, msgtype, payload.ljust(4, b'\x00'), uniq_id)
        else:
            raise AttributeError('Invalid data')
        # keep_as_bytes is set for tx_msgs
        if not keep_as_bytes and type(data) is not bytes: self.f16 = self.unpack_therapy_msg(self.f16)
        self.fmt_payload = None
        self.fmt_payload_set = False
        if notify_now: self.trigger_notification()
        return

    def pack_therapy_msg(self, msg_id, priority, msgtype, payload_in_bytes, uniq_id):
        if uniq_id is None: uniq_id = randint(0, 65535)
        msgobj = self.therapymsg_t._make([0x55, priority, uniq_id, int(msg_id), 0, msgtype, *payload_in_bytes, 0, 0xAA])
        return pack(self.tmsg_cstruct_fmt, *msgobj)

    def unpack_therapy_msg(self, msg_bytes):
        try:
            return self.therapymsg_t._make(unpack(self.tmsg_cstruct_fmt, msg_bytes))
        except:
            pass

    def validate(self):
        # print(f'validating msg: start_byte={self.f16.start_byte}, stop_byte={self.f16.stop_byte}')
        return self.f16.start_byte == 0x55 and self.f16.stop_byte == 0xAA

    def trigger_notification(self):
        self.notify_observers(self)

    def get_msg_name(self):
        try:
            msg_name = msg_db_val_to_name[str(self.f16.msg_id)]
        except:
            msg_name = f'{self.f16.msg_id:08X}'
        return msg_name

    def is_eventlog(self):
        return ((1 << 2) & self.f16.msg_type) > 0

    def is_datalog(self):
        return ((1 << 1) & self.f16.msg_type) > 0

    def get_payload_str(self):
        payload_val = self.get_payload()
        msg_name = self.get_msg_name()
        try:
            payload_str = payload_strings_map[msg_name][str(payload_val)]
        except KeyError:
            payload_str = payload_val
        return payload_str

    def get_payload(self, datatype=None):
        if self.fmt_payload_set: return self.fmt_payload
        self.fmt_payload_set = True
        if datatype in ['int8', 'int16', 'int32', 'int16', 'uint16', 'uint32', 'bool', 'float32']:
            payload_datatype = datatype
        else:
            try:
                msg_name = self.get_msg_name()
                payload_datatype = df_datalog_type.loc[df_datalog_type['msg_id'] == msg_name, 'ctype'].iloc[0]
            except IndexError:
                payload_datatype = 'uint32'

        if payload_datatype == 'float32':
            float_val = struct.unpack('f', bytes([self.f16.p0, self.f16.p1, self.f16.p2, self.f16.p3]))
            try:
                return float(f'{float_val[0]:.03f}')
            except:
                return 0
        is_signed = True if payload_datatype in ['int8', 'int16', 'int32'] else False
        p1 = self.f16.p1 if payload_datatype in ['int16', 'uint16', 'int32', 'uint32'] else 0
        p2, p3 = (self.f16.p2, self.f16.p3) if payload_datatype in ['int32', 'uint32'] else (None, None)
        pbytes = bytes([self.f16.p0, p1]) if None in [p2, p3] else bytes([self.f16.p0, p1, p2, p3])
        return int.from_bytes(pbytes, 'little', signed=is_signed)
