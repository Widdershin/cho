var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function (socket) {
  console.log('someone connected');

  socket.on('hello world', function () {
    console.log('hello world');
  });
});

app.get('/', function (request, response) {
  response.sendFile('index.html', { root: __dirname });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
