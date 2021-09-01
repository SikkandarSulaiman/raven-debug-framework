import os
import json
from raven.utils.common_utils import get_tstamp
from time import sleep
from bottle import route, Bottle, run, abort, static_file, request

from raven import Message
from raven import SerialConnection
from raven import get_available_comports
from raven import EventLogger
from raven import DataLogger
from raven import MsgLogger
from raven import get_msg_for_ui_id

from raven import get_tstamp

app = Bottle()

@route('/')
def index():
    return static_file('static/index.html', root='raven')

@route('/raven/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='raven/static')

@route('/get_comports', method=['GET'])
def get_comports():
    # sleep(2)
    return get_available_comports()

@route('/connect_to_com', method=['POST'])
def connect_to_com():
    msgport = None
    comport, status = request.forms.get("connect_to"), 'success'
    try:
        msgport = SerialConnection(comport, 115200, 'msg')
    except Exception as e:
        status = 'unknown'
        print(e)
    if msgport is None: status = 'failure'
    else:
        msgport.start_rx()
        txmsg = Message('MSG_UI_COMM_EXEC_TS_HANDSHAKE_1')
        msgport.tx(txmsg.f16)
        sleep(1)
        status = 'success' if msgport.handshake_done else 'timeout'
        try: del msgport
        except: pass
    if 'success' == status:
        EventLogger().open_log_file()
        DataLogger().open_log_file()
        MsgLogger().open_log_file()
        msgport = None
    return {'connection_status': status}

@route('/disconnect_from_com', method=['GET'])
def disconnect_from_com():
    status = 'success'
    msgport = SerialConnection.getcon('msg')
    comport = msgport.con.port
    msgport.stop_rx()
    msgport.close_connection()
    if 'success' == status:
        EventLogger().close_log_file()
        DataLogger().close_log_file()
        MsgLogger().close_log_file()
    return {'disconnection_status': status, 'disconnect_from': comport}

@route('/send_ser', method=['POST'])
def send():
    msgport = SerialConnection.getcon('msg')
    for msg_name in get_msg_for_ui_id(request.forms.get('id_name')):
        print(msg_name)
        try: payload = int(request.forms.get('val'))
        except: payload = 0
        msgport.tx(Message(msg_name, payload=payload).f16)
    return f'warlock\'s response to {request.forms.get("id_name")}'

@route('/eventCheck', method=['GET'])
def check_acks_from_serial_client():
    try: kvpair = EventLogger().eventlog_uidata.pop(0)
    except: return {'event': None}
    print(kvpair)
    return {'event': kvpair}

@route('/datalogHead', method=['GET'])
def pass_datalogs_format():
    loghead = {}
    loghead['name'] = [d[0] for d in DataLogger().datakeep]
    loghead['unit'] = [d[2] for d in DataLogger().datakeep]
    return loghead

@route('/datalogDisp', method=['GET'])
def get_datalog_disp_id():
    logdisp = {}
    logdisp['disp_id'] = [d[3] for d in DataLogger().datakeep]
    print(logdisp)
    return logdisp

@route('/datalogCheck')
def check_logs_from_serial_client():
    logbody = {}
    logbody['value'] = [d[1] for d in DataLogger().datakeep]
    logbody['disp_id'] = [d[3] for d in DataLogger().datakeep]
    return logbody

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    run()
    # print(get_tstamp())
    # el = EventLogger()
    # el.open_log_file()
    # dl = DataLogger()
    # dl.open_log_file()
    # ml = MsgLogger()
    # ml.open_log_file()
    # msgport = SerialConnection('COM18', 115200)
    # msgport.start_rx()
    # msgport.tx(Message('MSG_HEATER_INIT').f16)
    # msgport.tx(Message('MSG_LOGGER_INIT').f16)
    # msgport.tx(Message('MSG_SENSORS_INIT').f16)
    # msgport.tx(Message('MSG_HEATER_START').f16)
    # msgport.tx(Message('MSG_LOGGER_START').f16)
    # msgport.tx(Message('MSG_SENSORS_START').f16)
    # for _ in range(5):
    #     sleep(1)
    #     dl.log()
    # msgport.tx(Message('MSG_HEATER_STOP').f16)
    # msgport.tx(Message('MSG_LOGGER_STOP').f16)
    # msgport.tx(Message('MSG_SENSORS_STOP').f16)
    # ml.close_log_file()
    # dl.close_log_file()
    # el.close_log_file()
    # msgport.stop_rx()
    # print(EventLogger().eventlog_uidata)


