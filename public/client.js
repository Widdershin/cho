var KEYS = {
  R: 114,
  S: 115,
  1: 49,
  2: 50,
};

var App = (function () { "use strict";
  var pub = {};
  var scores = {
    1: {
      name: 'Player 1',
      game: 0,
      match: 0,
      isServing: false,
    },

    2: {
      name: 'Player 2',
      game: 0,
      match: 0,
      isServing: false,
    },
  };

  function changePlayerName(id) {
    var newName = prompt('Change ' + scores[id].name + "'s name to:");
    socket.emit('changeName', id, newName);
  }

  function render() {
    React.unmountComponentAtNode(document.getElementById('scoreboard'));
    React.render(
        <ScoreBoard scores={scores} />,
        document.getElementById('scoreboard')
    );
  }

  pub.start = function () {
    $(document).on('keypress', function(e) {
      console.log(e.which);
      if (e.which == KEYS.R) {
        socket.emit('reset');
      }

      if (e.which == KEYS.S) {
        socket.emit('swapSides');
      }

      if (e.which == KEYS[1]) {
        changePlayerName(1);
      }

      if (e.which == KEYS[2]) {
        changePlayerName(2);
      }
    });

    socket.on('update scores', function (newScores) {
      console.log(newScores);
      scores = newScores;
      render();
    });

    render();
  };

  return pub;
})();

var PlayerScore = React.createClass({
  render: function () {
    var serving;

    if (this.props.score.isServing) {
      serving = '(Serving)';
    }

    return (
      <div className="player">
        <h2>{ this.props.score.name } { serving }</h2>
        <div className="game">
          { this.props.score.match }
        </div>
        <div className="match">
          { this.props.score.game } games
        </div>
      </div>
    )
  }
});

var ScoreBoard = React.createClass({
  render: function() {
    var message;

    if (!this.props.scores.server) {
      message = 'The winner of the rally should press their button first.';
    }

    return (
      <div>
        <PlayerScore score={this.props.scores[1]} />
        <PlayerScore score={this.props.scores[2]} />
        <div className="message">
          {message}
        </div>
      </div>
    );
  }
});

$(App.start);
