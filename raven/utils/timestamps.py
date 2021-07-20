from datetime import datetime as dt

def get_tstamp():
	dt.now().isoformat().split('T')[1]
