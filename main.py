import json
import threading
from time import sleep
from pathlib import Path, os
from bottle import route, Bottle, run, static_file, request

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    os.chdir('dist')

from raven import Message
from raven import SerialConnection
from raven import get_available_comports

from raven import MsgLogger, DataLogger, EventLogger
from raven import start_logging, stop_logging
from raven import get_msg_for_ui_id

if __name__ == '__main__':
    from aio import check_feed_and_send_msg

app = Bottle()
static_files_abspath = Path(os.getcwd()) / 'static'
config_files_abspath = Path(os.getcwd()) / 'config'


@route('/')
def index():
    print(static_files_abspath)
    return static_file('index.html', root=static_files_abspath)


@route('/raven/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=static_files_abspath)


@route('/getConfig', method=['POST'])
def parse_json_config():
    with open(config_files_abspath / request.forms.get('filename')) as fp:
        return json.load(fp)


@route('/get_comports', method=['GET'])
def get_comports():
    sleep(1)
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
    if msgport is None:
        status = 'failure'
    else:
        msgport.start_rx()
        txmsg = Message('MSG_UI_COMM_EXEC_TS_HANDSHAKE_1', keep_as_bytes=True)
        msgport.tx(txmsg.f16)
        sleep(1)
        status = 'success' if msgport.handshake_done else 'timeout'
    if 'success' == status:
        start_logging()
        if __name__ == '__main__':
            threading.Thread(target=check_feed_and_send_msg, args=('switch',)).start()
    else:
        try:
            msgport.close_connection()
        except:
            pass
    return {'connection_status': status}


@route('/disconnect_from_com', method=['GET'])
def disconnect_from_com():
    status = 'success'
    msgport = SerialConnection.getcon('msg')
    comport = msgport.con.port
    msgport.stop_rx()
    msgport.close_connection()
    if 'success' == status:
        stop_logging()
    return {'disconnection_status': status, 'disconnect_from': comport}


@route('/send_ser', method=['POST'])
def send():
    msgport = SerialConnection.getcon('msg')
    for msg_name in get_msg_for_ui_id(request.forms.get('id_name')):
        print(msg_name)
        try:
            payload = int(request.forms.get('val'))
        except:
            payload = 0

        msgport.tx(Message(msg_name, payload=payload, msgtype=4, keep_as_bytes=True).f16)
    return f'warlock\'s response to {request.forms.get("id_name")}'


@route('/eventCheck', method=['GET'])
def check_acks_from_serial_client():
    try:
        kvpair = EventLogger().eventlog_uidata.pop(0)
    except IndexError:
        return {'event': None}
    print(kvpair)
    return {'event': kvpair}


@route('/datalogHead', method=['GET'])
def pass_datalogs_format():
    loghead = {
        'name': [d[0] for d in DataLogger().datakeep],
        'unit': [d[2] for d in DataLogger().datakeep],
        'disp_id': [d[3] for d in DataLogger().datakeep]
    }
    return loghead


@route('/datalogCheck')
def check_logs_from_serial_client():
    logbody = {'value': [d[1] for d in DataLogger().datakeep]}
    return logbody


def main():
    run()


if __name__ == '__main__':
    main()
