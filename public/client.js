var KEYS = {
  R: 114,
  S: 115,
};

var App = (function () { "use strict";
  var pub = {};
  var scores = {
    1: {
      game: 0,
      match: 0,
    },

    2: {
      game: 0,
      match: 0,
    },
  };

  function render() {
    React.unmountComponentAtNode(document.getElementById('scoreboard'));
    React.render(
        <ScoreBoard scores={scores} />,
        document.getElementById('scoreboard')
    );
  }

  pub.start = function () {
    $(document).on('keypress', function(e) {
      if (e.which == KEYS.R) {
        socket.emit('reset');
      }

      if (e.which == KEYS.S) {
        socket.emit('swapSides');
      }
    });

    socket.on('update scores', function (newScores) {
      console.log(newScores);
      document.getElementById('dingSound').play();
      scores = newScores;
      render();
    });

    render();
  };

  return pub;
})();


var ScoreBoard = React.createClass({
  render: function() {
    var message;
    if (!this.props.scores.server) {
      message = 'The winner of the rally should press their button first';
    }

    var player1Serving, player2Serving;

    if (this.props.scores.server == 1) {
      player1Serving = ' (Serving)';
    }

    if (this.props.scores.server == 2) {
      player2Serving = ' (Serving)';
    }

    return (
        <div>
          <div className="player">
            <h2>Player 1 {player1Serving}</h2>
            <div className="game">
              { this.props.scores[1].match }
            </div>
            <div className="match">
              { this.props.scores[1].game } games out of 2
            </div>
          </div>
          <div className="player">
            <h2>Player 2 {player2Serving}</h2>
            <div className="game">
              { this.props.scores[2].match }
            </div>
            <div className="match">
              { this.props.scores[2].game } games out of 2
            </div>
          </div>
          <div className="message">
            {message}
          </div>
        </div>
      );
  }
});

$(App.start);
