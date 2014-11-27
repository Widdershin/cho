var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

io.on('connection', function (socket) {
  console.log('someone connected');

  socket.on('hello world', function () {
    console.log('hello world');
  });
});

app.get('/', function (request, response) {
  response.sendFile('index.html', { root: __dirname });
});

app.post('/scores/', function (request, response) {
  var player = request.body.player;
  response.send(200);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
