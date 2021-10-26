import os
import base64
from time import sleep

from Adafruit_IO import Client

from raven import Message
from raven import SerialConnection


def _check_feed_and_send_msg(feed_name):
    msg_port = SerialConnection.getcon('msg')
    feed = aio.feeds(feed_name)
    data = aio.receive(feed.key)
    triggered.append(data.updated_at)
    while True:
        feed = aio.feeds(feed_name)
        data = aio.receive(feed.key)
        print(data)
        if data.updated_at not in triggered:
            for msg_pack in data.value.split(','):
                msg_name, msg_payload = msg_pack.split(':')
                try:
                    msg_port.tx(Message(msg_name, payload=int(msg_payload), keep_as_bytes=True).f16)
                    triggered.append(data.updated_at)
                except Exception as e:
                    print(e)
        sleep(1)


def dummy_check(feed_name):
    sleep(5)


check_feed_and_send_msg = _check_feed_and_send_msg
try:
    # aio_uname = base64.b64decode(os.environ['RAVEN_AIO_UNAME']).decode()
    # aio_key = base64.b64decode(os.environ['RAVEN_AIO_KEY']).decode()
    aio_uname = base64.b64decode('c2lrdGh1bmRlcg==').decode()
    aio_key = base64.b64decode('YWlvX1NxRU00Mkh0QTRYT1ZYVk0zb2RWMjRraGp0Uk0=').decode()
    aio = Client(aio_uname, aio_key)
    triggered = []
except KeyError:
    check_feed_and_send_msg = dummy_check
