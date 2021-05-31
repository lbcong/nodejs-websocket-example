var express = require('express')
var ws = require('./ws')

var port = normalizePort(process.env.PORT || 3000, () => { console.log("Express server listening on port %d", this.address().port); });

var app = express()

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/ws.html');
})

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
