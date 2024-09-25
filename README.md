
# ZeroMQ + Whatsjs

Microservice that allows communication between different modules via webhook with the WhatsApp platform



## Features

- [x]  ZeroMQ queue
- [x]  Endpoint for whatsapp messaging
- [ ]  Endpoint to set custom actions based on custom messages


## Deploy


```bash
  git clone https://github.com/carlosgiongo/ZeroMQ-Whatsjs.git
  npm i
  nano .env #Read section about environment vars
  npm start
```


## Environment variables

Environment vars can be seted as the .env.example model:

`ZMQ_PORT` = 2555

`EXP_PORT` = 2556

