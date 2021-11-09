import threading
from time import sleep

import serial.tools.list_ports
from serial import Serial

from raven.msg_db import Message
from raven.msg_db import msg_db_name_to_val
from raven.msg_db import log_structs_info
from raven.utils import Observer


def get_available_comports():
    ports = serial.tools.list_ports.comports()

    comports_id = []
    comports_desc = []
    comports_hwids = []

    for port, desc, hwid in sorted(ports):
        comports_id.append(port)
        comports_desc.append(desc)
        comports_hwids.append(hwid)

    try:
        active_port = SerialConnection.getcon('msg').con.port
    except KeyError:
        active_port = None
    return {"ports": comports_id, "desc": comports_desc, "hwid": comports_hwids, 'connected': active_port}


class SerialConnection(Observer):
    connections = {}

    def __init__(self, port, baud, alias=None):
        Observer.__init__(self)
        self.con = Serial(port, baud, timeout=0.1)
        if self.con is None: return
        try:
            self.con.close()
            self.con.open()
        except Exception as e:
            raise e
        self.rx_exit = False
        self.rx_thread = None
        self.handshake_done = False
        self.observe(self.msg_rxd)
        alias_name = port if not alias else str(alias)
        self.connections[alias_name] = self

    @classmethod
    def getcon(cls, name):
        return cls.connections[name]

    def tx(self, msg):
        try:
            self.con.write(msg)
            print(f'sent {msg}')
            sleep(0.0001)
        except Exception as e:
            raise e

    def rx_content(self, content_id):
        sizes_in_bytes = log_structs_info[content_id]['size_in_bytes']
        msg_list = log_structs_info[content_id]['msg_list']

        # Read rx bytes from serial wrapped with start and stop bytes (+2)
        rx_bytes = self.con.read(sum(sizes_in_bytes) + 2)
        # print(content_id, len(rx_bytes), [f'0x{i:02X}' for i in rx_bytes])
        if len(rx_bytes) != sum(sizes_in_bytes) + 2 or not Message.is_valid_content(rx_bytes):
            self.refresh_connection()
            return
        rx_bytes = rx_bytes[1:]  # strip start byte 0xAA
        for msg_name, payload_size in zip(msg_list, sizes_in_bytes):
            payload_bytes = rx_bytes[:payload_size]  # Take first n bytes using 'payload_size'
            rx_bytes = rx_bytes[payload_size:]  # pop payload byte so first n bytes can be used in next iteration
            if msg_name is not None:  # process payload as if it is received as a log msg
                threading.Thread(target=Message, args=(msg_name,),
                                 kwargs={'payload': payload_bytes, 'msgtype': 2, 'notify_now': True}).start()

    def rx(self):
        while not self.rx_exit:
            try: first_byte = self.con.read(1)
            except: continue
            if first_byte != b'\x55': continue
            try: rem_bytes = self.con.read(15)
            except: continue
            rx_bytes = first_byte + rem_bytes
            # print(f'recvd {rx_bytes} length {len(rx_bytes)}')
            if not Message.is_valid_msg(rx_bytes):
                print('invalid msg')
                continue
            if Message.is_control_msg(rx_bytes):
                # if control msg, receive following content
                self.rx_content(Message.get_content_id(rx_bytes))
            else:
                threading.Thread(target=Message, args=(rx_bytes,), kwargs={'notify_now': True}).start()


    def start_rx(self):
        self.rx_thread = threading.Thread(target=self.rx)
        self.rx_thread.start()

    def stop_rx(self):
        self.rx_exit = True
        try:
            self.rx_thread.join()
        except RuntimeError:  # thread not created yet
            pass

    def open_connection(self):
        if self.con and not self.con.isOpen():
            self.con.open()

    def close_connection(self):
        if self.con:
            self.con.close()

    def refresh_connection(self):
        if self.con and self.con.isOpen():
            self.con.close()
        if self.con:
            self.con.open()
            self.con.flush()

    def get_connected_port(self):
        if self.con and self.con.isOpen():
            return self.con.port
        return None

    def msg_rxd(self, msg):
        if msg.f16.msg_id == msg_db_name_to_val['MSG_UI_COMM_EXEC_TS_HANDSHAKE_1']:
            self.handshake_done = True

    def __del__(self):
        try:
            if self.con.isOpen():
                self.con.close()
        except AttributeError:  # connection not created already
            pass
