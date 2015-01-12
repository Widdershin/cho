var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

require('node-jsx').install();

app.use(express.static('public'));
app.use(bodyParser.json());

var scores;
function resetScores() {
  scores = {
    game: {
      1: 0,
      2: 0,
    },
    match: {
      1: 0,
      2: 0,
    }
  };
}

resetScores();

var singletonSocket = null;

io.on('connection', function (socket) {
  singletonSocket = socket;

  socket.on('reset', function() {
    resetScores();
    singletonSocket.emit('update scores', scores);
  });
});

app.get('/', function (request, response) {
  response.sendFile('index.html', { root: __dirname });
});

app.post('/scores/', function (request, response) {
  var player = request.body.player;

  scores.match[player] += 1;

  if (player == 1) {
    otherPlayer = 2;
  } else {
    otherPlayer = 1;
  }

  if (scores.match[player] >= 11 && (scores.match[player] - scores.match[otherPlayer] >= 2)) {
    scores.game[player] += 1;
    scores.match = {
      1: 0,
      2: 0,
    };
  }

  singletonSocket.emit('update scores', scores);
  response.sendStatus(200);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
