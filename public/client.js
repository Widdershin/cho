var App = (function () { "use strict";
  var pub = {};

  pub.start = function () {
    socket.on('update scores', function (scores) {
      alert(scores);
    });
  };

  return pub;
})();

$(App.start);
