var R_KEY = 114;
var App = (function () { "use strict";
  var pub = {};
  var scores = {
    game: {
      1: 0,
      2: 0,
    },
    match: {
      1: 0,
      2: 0,
    }
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
      if (e.which == R_KEY) {
        socket.emit('reset');
      }
    });

    socket.on('update scores', function (newScores) {
      scores = newScores;
      render();
    });

    render();
  };

  return pub;
})();


var ScoreBoard = React.createClass({
  render: function() {
    return (
        <div>
          <div className="player">
            <h2>Player 1</h2>
            <div className="game">
              { this.props.scores.match[1] }
            </div>
            <div className="match">
              { this.props.scores.game[1] } games out of 2
            </div>
          </div>
          <div className="player">
            <h2>Player 2</h2>
            <div className="game">
              { this.props.scores.match[2] }
            </div>
            <div className="match">
              { this.props.scores.game[2] } games out of 2
            </div>
          </div>
        </div>
      );
  }
});

$(App.start);
