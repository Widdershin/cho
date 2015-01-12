var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

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
    },
    server: undefined,
  };
}

function opposite(player) {
  if (player == 1) {
    return 2;
  } else {
    return 1;
  }
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

  if (scores.server) {
    scores.match[player] += 1;

    otherPlayer = opposite(player);

    if ((scores.match[player] + scores.match[otherPlayer]) % 2 == 0) {
      scores.server = opposite(scores.server);
    }

    if (scores.match[player] >= 11 && (scores.match[player] - scores.match[otherPlayer] >= 2)) {
      scores.game[player] += 1;
      scores.match = {
        1: 0,
        2: 0,
      };
    }
  } else {
    scores.server = player;
  }

  singletonSocket.emit('update scores', scores);
  response.sendStatus(200);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
