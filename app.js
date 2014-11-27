var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

require('node-jsx').install();

app.use(express.static('public'));
app.use(bodyParser.json());

scores = {
  1: 0,
  2: 0,
};

var singletonSocket = null;

io.on('connection', function (socket) {
  singletonSocket = socket;
  console.log('someone connected');
});

app.get('/', function (request, response) {
  response.sendFile('index.html', { root: __dirname });
});

app.post('/scores/', function (request, response) {
  var player = request.body.player;
  scores[player] += 1;
  singletonSocket.emit('update scores', scores);
  response.sendStatus(200);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
