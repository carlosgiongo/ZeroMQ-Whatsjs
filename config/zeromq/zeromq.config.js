require("dotenv").config();
const zmq = require("zeromq");
const EventEmitter = require('events');

const runZeroMqSubscriber = async (emitter) => {
  try {
    const sock = new zmq.Pull();

    sock.connect(`tcp://localhost:${process.env.ZMQ_PORT}`);
    console.log(
      `ZeroMQ server (Publisher-Subscriber) listening on port ${process.env.ZMQ_PORT}...`
    );

    for await (const [msg] of sock) {
      const message = JSON.parse(msg.toString());
      emitter.emit('message', message);
    }
  } catch (error) {
    console.error("Error on ZeroMQ Server:", error);
  }
};

class ZeroMq extends EventEmitter {
  constructor() {
    super();
    runZeroMqSubscriber(this);
    this.pushSocket = null; 
    this.bindPushSocket();
  }

  async bindPushSocket() {
    try {
      this.pushSocket = new zmq.Push();
      await this.pushSocket.bind(`tcp://localhost:${process.env.ZMQ_PORT}`);
      console.log(`ZeroMQ Publisher bound to port ${process.env.ZMQ_PORT}`);
    } catch (error) {
      console.error("Error binding ZeroMQ Publisher:", error);
    }
  }

  async sendMessage(message) {
    if (!this.pushSocket) {
      console.error("ZeroMQ Publisher not bound yet. Waiting...");
      await this.bindPushSocket();
    }

    try {
      await this.pushSocket.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error on ZeroMQ Publisher send:", error);
    }
  }

  on(event, listener) {
    this.addListener(event, listener);
  }
}


module.exports = ZeroMq;