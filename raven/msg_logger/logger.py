from datetime import datetime as dt
from time import sleep
import threading

from raven.utils import Observer
from raven.utils import Singleton
from raven.utils import get_tstamp
from raven.msg_db import df_datalog_type
from raven.msg_db import df_eventlog_type

def start_logging(datalog_interval_ms = 1):
	EventLogger().open_log_file()
	DataLogger().open_log_file()
	MsgLogger().open_log_file()

def get_log_data():
	pass

def stop_logging():
	EventLogger().close_log_file()
	DataLogger().close_log_file()
	MsgLogger().close_log_file()

class MsgLogger(Observer, metaclass=Singleton):

	def __init__(self):
		Observer.__init__(self)
		self.observe(self.msg_rxd)
		self.fp = None

	def msg_rxd(self, msg):
		print(f'{get_tstamp()},{msg.get_msg_name()},{msg.get_payload()},{msg.f16.ack},{msg.f16.msg_type},{msg.f16.uniq_id:04X}', file=self.fp)

	def open_log_file(self):
		print(f'msg_log_{dt.isoformat(dt.now())}.csv')
		self.fp = open(f'msg_log.csv', 'w')
		print(f'timestamp,msg_name,payload,ack,msg_type,uniq_id', file=self.fp)

	def close_log_file(self):
		if self.fp: self.fp.close()
		self.fp = None

	def __del__(self):
		self.close_log_file()


class EventLogger(Observer, metaclass=Singleton):

	def __init__(self):
		Observer.__init__(self)
		self.observe(self.msg_rxd)
		self.eventlog_uidata = []
		self.fp = None

	def msg_rxd(self, msg):
		ts_now = get_tstamp()
		if not msg.is_eventlog(): return
		try: msg_name = msg.get_msg_name()
		except KeyError: return
		payload = msg.get_payload(datatype='uint32')
		resp = 'positive' if msg.f16.ack >= 0 else 'negative'
		try: disp_text = df_eventlog_type.loc[df_eventlog_type['msg_id'] == msg_name, resp].iloc[0]
		except: disp_text = msg_name
		self.eventlog_uidata.append((ts_now, payload, disp_text, msg.f16.ack))
		print(f'{ts_now},{payload},{msg_name},{disp_text}', file=self.fp)

	def open_log_file(self):
		self.fp = open(f'event_log.txt', 'w')

	def close_log_file(self):
		if self.fp: self.fp.close()
		self.fp = None

	def get_ui_data(self):
		while len(self.eventlog_uidata) != 0:
			yield self.eventlog_uidata.pop(0)

	def __del__(self):
		self.close_log_file()


class DataLogger(Observer, metaclass=Singleton):

	def __init__(self, datalog_interval_ms=1000):
		Observer.__init__(self)
		self.observe(self.msg_rxd)
		self.datakeep = []
		self.indexkeep, index = {}, 0
		for name, unit, disp_id, en in zip(df_datalog_type.datalog_column_name.values, df_datalog_type.datalog_column_unit.values, df_datalog_type.dom_display_id.values, df_datalog_type.enable.values):
			if en:
				self.datakeep.append([name, 'NULL', unit, disp_id])
				self.indexkeep[name] = index
				index += 1
		self.log_in_progress = False
		self.log_trigger_thread = threading.Thread(target=self.log_trigger_fn, args=(datalog_interval_ms,))

	def msg_rxd(self, msg):
		if not msg.is_datalog(): return
		try:
			msg_name = msg.get_msg_name()
			name = df_datalog_type.loc[df_datalog_type['msg_id'] == msg_name, 'datalog_column_name'].iloc[0]
			index = self.indexkeep[name]
			self.datakeep[index][1] = msg.get_payload()
		except (IndexError, KeyError): return

	def log(self):
		try:
			print(get_tstamp(), end=',', file=self.fp)
			for data in self.datakeep:
				print(data[1], end=',', file=self.fp)
			print('', file=self.fp)
		except ValueError: pass

	def open_log_file(self):
		self.fp = open(f'data_log.csv', 'w')
		print('system timestamp', end=',', file=self.fp)
		for data in self.datakeep:
			print(data[0], end=',', file=self.fp)
		print('', file=self.fp)
		print('time', end=',', file=self.fp)
		for unit, en in zip(df_datalog_type.datalog_column_unit.values, df_datalog_type.enable.values):
			if en: print(unit, end=',', file=self.fp)
		print('', file=self.fp)
		self.log_in_progress = True
		self.log_trigger_thread.start()

	def close_log_file(self):
		if self.fp: self.fp.close()
		self.fp = None
		self.log_in_progress = False
		self.log_trigger_thread.join()

	def log_trigger_fn(self, wait_time_ms):
		while self.log_in_progress:
			sleep(wait_time_ms/1000)
			self.log()

	def __del__(self):
		self.close_log_file()


