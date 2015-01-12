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
    1: {
      game: 0,
      match: 0,
    },

    2: {
      game: 0,
      match: 0,
    },

    server: undefined,
    originalServer: undefined,
  };
}

function swapSides() {
  var oldPlayer1Score = scores[1];
  scores[1] = scores[2];
  scores[2] = oldPlayer1Score;
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

  socket.on('swapSides', function() {
    swapSides();
    singletonSocket.emit('update scores', scores);
  });
});

app.get('/', function (request, response) {
  response.sendFile('index.html', { root: __dirname });
});

app.post('/scores/', function (request, response) {
  var player = request.body.player;

  if (scores.server) {
    scores[player].match += 1;

    otherPlayer = opposite(player);

    if ((scores[player].match + scores[otherPlayer].match) % 2 === 0) {
      scores.server = opposite(scores.server);
      scores.originalServer = scores.server;
    }

    if (scores[player].match >= 11 && (scores[player].match - scores[otherPlayer].match >= 2)) {
      scores[player].game += 1;
      scores.match = {
        1: 0,
        2: 0,
      };

      if ((scores[player].game + scores[otherPlayer].game) % 2 === 0) {
        scores.server = scores.originalServer;
      } else {
        scores.server = opposite(scores.originalServer);
      }
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
