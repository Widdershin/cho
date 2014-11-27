var App = (function () { "use strict";
  var pub = {};

  pub.start = function () {
    socket.emit('hello world');
  };

  return pub;
})();

$(App.start);
