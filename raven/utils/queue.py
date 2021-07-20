class SimpleQueue(object):

	def __init__(self, arg=[]):
		super(SimpleQueue, self).__init__()
		if type(arg) is list: self.q = arg
		else: raise AttributeError('Argument should be an iterator')

	def push(self, val):
		self.q.append(val)

	def pop(self):
		try: self.q.pop(0)
		except IndexError: raise IndexError('Queue underflow')

	def __len__(self):
		return len(self.q)

	def empty(self):
		self.q = []

	def find(self, thing, key=lambda x:x):
		for item in self.q:
			if key(item) == thing:
				return item
		return None

		