# socket-mem-leak
> Test case for a socket.io memory leak

## Problem

> When there's no enforcement to use "Web Sockets" *only* as the transport
protocol, the server logs a memory spike (> 500%) when emitting a big sample
JSON.

When "Web Sockets" *only* are enforced, the server logs
nominal memory consumption values whilst emitting the sample JSON.

The problem seems to lie with the initial XHR handshake.


## Usage

- Clone repo and then:

```bash
$ npm install
```

- Running with default Transport protocol

```bash
$ node --inspect --expose-gc index.js
```

- Enforcing WebSockets-only Transport protocol

```bash
$ WS_ONLY=true node --inspect --expose-gc index.js
```

Then visit http://localhost:3000 and pop-open the console.


## Metrics:

> Without enforcing WebSockets-only

```bash
Listening on 3000, using default Transport
Used heap size 34.91 MB
new connection
emitting 10 MB payload
Used heap size 659.31 MB
Used heap size 659.50 MB
Used heap size 659.56 MB
Used heap size 659.56 MB
new connection
emitting 10 MB payload
Used heap size 593.52 MB
Used heap size 593.65 MB
Used heap size 593.68 MB
Used heap size 593.68 MB

```

> Enforcing WebSockets-only
```
Listening on 3000, using WebSocket only
Used heap size 34.92 MB
new connection
emitting 10 MB payload
Used heap size 54.68 MB
Used heap size 54.68 MB
Used heap size 54.68 MB
new connection
emitting 10 MB payload
Used heap size 43.93 MB
Used heap size 43.97 MB
Used heap size 43.98 MB
Used heap size 43.98 MB
```
