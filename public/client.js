var App = (function () { "use strict";
  var pub = {};

  pub.start = function () {
    socket.on('update scores', function (scores) {
      alert(scores);
    });

    React.render(
        <ScoreBoard />,
        document.getElementById('scoreboard')
    );
  };

  return pub;
})();


var ScoreBoard = React.createClass({
  render: function() {
    return (
        <div>
          Hello world!
        </div>
      );
  }
});

$(App.start);
