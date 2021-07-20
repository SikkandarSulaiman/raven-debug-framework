import serial.tools.list_ports
import threading
import json
from serial import Serial
from time import sleep

from raven.msg_db import therapymsg_t
from raven.msg_db import pack_therapy_msg
from raven.msg_db import unpack_therapy_msg

from raven.utils import get_tstamp

with open(r'msg_ids_name_to_val.json', 'r') as fp:
	msg_db_name_to_val = json.load(fp)
with open(r'msg_ids_val_to_name.json', 'r') as fp:
	msg_db_val_to_name = json.load(fp)

btnid_to_txmsgid = {
	'heater_start': ['MSG_HEATER_INIT', 'MSG_HEATER_START'],
	'heater_stop': ['MSG_HEATER_STOP', 'MSG_HEATER_DEINIT']
}

rxmsgid_to_setid = {
	'MSG_HEATER_GET_INLET_TEMP': 'inlet_temp',
	'MSG_HEATER_GET_OUTLET_TEMP': 'outlet_temp',
	'MSG_HEATER_GET_HPAD1_TEMP': 'hpad_1_temp',
	'MSG_HEATER_GET_HPAD2_TEMP': 'hpad_2_temp',
	'MSG_HEATER_GET_PWMOUT': 'heater_pwm_dc'
}

setid_to_val = {
	'inlet_temp': 0,
	'outlet_temp': 0,
	'hpad_1_temp': 0,
	'hpad_2_temp': 0,
	'heater_pwm_dc': 0
}

rxmsgid_to_disp = {
	'MSG_HEATER_INIT': 'Heater: init',
	'MSG_HEATER_START': 'Heater: start',
	'MSG_HEATER_STOP': 'Heater: stop',
	'MSG_HEATER_DEINIT': 'Heater: deinit'
}

def get_available_comports():
	ports = serial.tools.list_ports.comports()
	
	comports_id = []
	comports_desc = []
	comports_hwids = []

	for port, desc, hwid in sorted(ports):
		comports_id.append(port)
		comports_desc.append(desc)
		comports_hwids.append(hwid)

	return {"ports": comports_id, "desc": comports_desc, "hwid": comports_hwids}

class SerialConnection(object):

	def __init__(self, port, baud):
		super(SerialConnection, self).__init__()
		self.con = Serial(port, baud)
		if self.con is None: return None
		try:
			self.con.close()
			self.con.open()
		except Exception as e: raise e
		self.rx_msg_bkt = []
		self.rx_exit = False
		self.rx_thread = None
		self.ack_bucket = []
		self.val_bucket = setid_to_val

	def tx(self, btn_id, val=None):
		msg_id_names = btnid_to_txmsgid[btn_id]
		for msg_id_name in msg_id_names:
			msg_id_val = msg_db_name_to_val[msg_id_name]
			self.con.write(pack_therapy_msg(msg_id_val))
			print(f'sent {msgobj}')
			sleep(0.1)

	def rx(self):
		while not self.rx_exit:
			read_bytes = self.con.read(16)
			rx_msg = unpack_therapy_msg(read_bytes)
			if rx_msg.start_byte != 0x55 or rx_msg.stop_byte != 0xAA:
				print('Received corrupted msg')
				continue
			print(f'rx msg id: {str(rx_msg.msg_id)}')
			try:
				rx_msg_name = msg_db_val_to_name[str(rx_msg.msg_id)]
				text = rxmsgid_to_disp[rx_msg_name]
				self.ack_bucket.append((rx_msg.msg_id, f'{text} {"success" if rx_msg.ack >= 0 else "failed"}', get_tstamp()))
				print(rx_msg_name, 'received', read_bytes, read_bytes[10:14], rx_msg)
			except Exception as e: print(f'----> Exception: {e}')

	def start_rx(self):
		self.rx_thread = threading.Thread(target=self.rx)
		self.rx_thread.start()

	def stop_rx(self):
		self.rx_exit = True
		self.rx_thread.join()

	def __del__(self):
		if self.con.isOpen():
			self.con.close()

def wait():
	input("press to continue")

if __name__ == '__main__':
	file_rtr = frame_msg(msg_db_name_to_val['MSG_UI_COMM_EXEC_RX_FILE_CHECK'], msgtype=3, payload=524304)
	chunk_notify = frame_msg(msg_db_name_to_val['MSG_UI_COMM_EXEC_RX_FILE_CHUNK'], msgtype=3)
	file_abort = frame_msg(msg_db_name_to_val['MSG_UI_COMM_EXEC_RX_FILE_ABORT'], msgtype=3)
	scon = SerialConnection('COM8', 115200)
	scon.start_rx()

	scon.con.write(pack('BBHIbBBBBBBB', *file_rtr))
	print(f'sent file rtr {file_rtr}')
	wait()

	scon.con.write(pack('BBHIbBBBBBBB', *chunk_notify))
	print(f'sent chunk_notify {chunk_notify}')
	wait()

	scon.con.write('abcdefgh'.encode())
	print('sent first 8 bytes')
	wait()

	scon.con.write(pack('BBHIbBBBBBBB', *chunk_notify))
	print(f'sent chunk_notify {chunk_notify}')
	wait()

	scon.con.write('ijklmnop'.encode())
	print('sent next 8 bytes')
	wait()

	scon.con.write(pack('BBHIbBBBBBBB', *file_abort))
	print(f'sent file_abort {file_abort}')
	wait()

	print('Transaction completed')