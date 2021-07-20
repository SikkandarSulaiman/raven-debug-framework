import os
from bottle import route, run, template, static_file, request, response

from raven import SerialConnection
from raven import get_available_comports

scon = None

@route('/')
def index():
    return static_file('static/index.html', root='raven')

@route('/raven/static/<filepath:path>')
def server_static(filepath):
    print(f'inside server_static {filepath}')
    print(static_file(filepath, root='raven/static'))
    return static_file(filepath, root='raven/static')

@route('/get_comports', method=['GET'])
def get_comports():
    return get_available_comports()

@route('/connect_to_com', method=['POST'])
def connect_to_com():
    comport, status = request.forms.get("connect_to"), 'success'
    global scon
    try: scon = SerialConnection(comport, 115200)
    except: status = 'unknown'
    if scon is None: status = 'failure'
    else: scon.start_rx()
    return {'connection_status': status}

@route('/send_ser', method=['POST'])
def send():
    try: set_val = request.forms.get("set_val")
    except: set_val = 0
    scon.tx(request.forms.get("id_name"), set_val)
    return f'warlock\'s response to {request.forms.get("id_name")}'

@route('/check', method=['GET'])
def check_acks_from_serial_client():
    try: kvpair = scon.ack_bucket.pop(0)
    except: return {'event': None}
    return {'event': kvpair}


if __name__ == '__main__':
    run()
