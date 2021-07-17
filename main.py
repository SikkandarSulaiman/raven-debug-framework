import os
from bottle import route, run, template, static_file, request, response

from serial_connection import active_port as comport
from serial_connection import SerialConnection

@route('/')
def index():
    return static_file('index.html', root='static')

@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')

@route('/get_comports', method=['GET'])
def get_comports():
    return serial_connection.get_available_comports()

@route('/send_ser', method=['POST'])
def send():
    try: set_val = request.forms.get("set_val")
    except: set_val = 0
    scon.tx(request.forms.get("id_name"), set_val)
    return f'warlock\'s response to {request.forms.get("id_name")}'

@route('/check', method=['GET'])
def check_acks_from_serial_client():
    try: kvpair = scon.ack_bucket.pop(0)
    except: return {}
    return dict([kvpair])

@route('/read_val', method=['GET'])
def check_acks_from_serial_client():
    return scon.val_bucket

@route('/exit')
def exit_serial_comm():
    return f'warlock\'s response to exit'

if __name__ == '__main__':
    scon = SerialConnection(comport, 115200)
    scon.start_rx()
    try:
        run()
    except KeyboardInterrupt:
        print('kb int')
        scon.stop_rx()
