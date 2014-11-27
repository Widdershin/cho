var App = (function () { "use strict";
  var pub = {};
  var scores = {
    1: 0,
    2: 0,
  };

  function render() {
    React.unmountComponentAtNode(document.getElementById('scoreboard'));
    React.render(
        <ScoreBoard scores={scores} />,
        document.getElementById('scoreboard')
    );
  }

  pub.start = function () {
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
          <div>
            P1 Score: { this.props.scores[1] }
          </div>
          <div>
            P2 Score: { this.props.scores[2] }
          </div>
        </div>
      );
  }
});

$(App.start);
