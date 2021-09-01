import serial.tools.list_ports
import threading
from serial import Serial
from time import sleep

from raven.msg_db import Message
from raven.msg_db import msg_db_name_to_val
from raven.utils import Observer

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

	try: active_port = SerialConnection.getcon('msg').con.port
	except: active_port = None
	return {"ports": comports_id, "desc": comports_desc, "hwid": comports_hwids, 'connected': active_port}

class SerialConnection(Observer):

	connections = {}

	def __init__(self, port, baud, alias=None):
		Observer.__init__(self)
		# print(f'Opening {port} with baud {baud}')
		self.con = Serial(port, baud, timeout=0.01)
		# print(self.con)
		if self.con is None: return None
		try:
			self.con.close()
			self.con.open()
		except Exception as e: raise e
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

	def rx(self):
		while not self.rx_exit:
			first_byte = self.con.read(1)
			if (first_byte == b'\x55'):
				rem_bytes = self.con.read(15)
				rx_bytes = first_byte + rem_bytes
				# print(f'recvd {rx_bytes}')
				if len(rx_bytes) != 16:
					print('Insufficient msg length')
					continue
				try: Message(rx_bytes, notify_now=True)
				except ValueError: print('Corrupted msg')
				# print(f'recvd {Message(rx_bytes, notify_now=True).f16}')
				# except Exception as e: print(e)
				# except ValueError: print('Recvd msg with invalid format')

	def start_rx(self):
		self.rx_thread = threading.Thread(target=self.rx)
		self.rx_thread.start()

	def stop_rx(self):
		self.rx_exit = True
		self.rx_thread.join()

	def open_connection(self):
		if self.con and not self.con.isOpen():
			self.con.open()

	def close_connection(self):
		if self.con:
			self.con.close()

	def get_connected_port(self):
		if self.con and self.con.isOpen(): return self.con.port
		return None

	def msg_rxd(self, msg):
		if msg.f16.msg_id == msg_db_name_to_val['MSG_UI_COMM_EXEC_TS_HANDSHAKE_1']:
			self.handshake_done = True

	def __del__(self):
		if self.con.isOpen():
			self.con.close()


