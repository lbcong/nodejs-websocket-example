const WebSocket = require('ws');

const PORT = 5000;

const wsServer = new WebSocket.Server({
    port: PORT
});

function noop() {}

wsServer.on('connection', function (socket,req) {
    // Some feedback on the console
    console.log("A client just connected");
    const ip = req.socket.remoteAddress;
    const ip1 = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
  
    console.log(ip);
    console.log(ip1);
  
    // Attach some behavior to the incoming socket
    socket.on('message', function (msg) {
        console.log("Received message from client: "  + msg);
        // socket.send("Take this back: " + msg);

        // Broadcast that message to all connected clients
        wsServer.clients.forEach(function (client) {
            client.send("server "+msg);
        });

    });
  
    socket.isAlive = true;
    socket.on('pong', heartbeat);
  
    socket.on("error", function(error) {
    // Manage error here
    console.log(error);
    });
  


});

const interval = setInterval(function ping() {
  wsServer.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

wsServer.on('close', function close() {
  clearInterval(interval);
});


function heartbeat() {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);
}


console.log( (new Date()) + " Server is listening on port " + PORT);
