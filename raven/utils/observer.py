import threading


class Observer:
    _observers = []

    def __init__(self):
        self._observers.append(self)
        self._observables = []

    def observe(self, callback):
        self._observables.append(callback)

    def get_oservables(self):
        return self._observables

    @classmethod
    def get_observers(cls):
        return cls._observers


class Observable:

    def __init__(self):
        pass

    def notify_observers(self, data):
        for observer in Observer.get_observers():
            for callback in observer.get_oservables():
                threading.Thread(target=callback, args=(data,)).start()


class Message(Observable):

    def __init__(self, data, notify_on_create=True):
        Observable.__init__(self)
        self.data = data
        self.notify_on_create = notify_on_create
        if self.notify_on_create: self.notify_observers(self.data)

    def trigger_notification(self):
        self.notify_observers(self.data)


class Receiver(Observer):

    def __init__(self):
        Observer.__init__(self)
        self.observe(self.msg_rxd)

    def msg_rxd(self, msg):
        print(f'Received msg with data {msg}')


if __name__ == '__main__':
    rxr = Receiver()
    Message('sEcReT')
