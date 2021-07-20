from struct import unpack, pack
from random import randint
from collections import namedtuple

tmsg_cstruct_fmt = 'BBHIbBBBBBBB'
therapymsg_t = namedtuple('therapymsg_t', 'start_byte priority uniq_id msg_id ack msg_type p0 p1 p2 p3 crc stop_byte')

def pack_therapy_msg(msg_id, priority=0, msgtype=0, payload=0, uniq_id=None):
	if uniq_id is None: uniq_id = randint(0, 65535)
	pbytes = int.to_bytes(payload, 4, 'little')
	msgobj = therapymsg_t._make([0x55, priority, uniq_id, int(msg_id), msgtype, 0, *pbytes, 0, 0xAA])
	return pack(tmsg_cstruct_fmt, *msgobj)

def unpack_therapy_msg(msg_bytes):
	return therapymsg_t._make(unpack(tmsg_cstruct_fmt), read_bytes)
