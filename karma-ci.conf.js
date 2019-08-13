const conf = require("./karma.conf");

module.exports = function(config) {
  conf(config);
  config.set({
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  });
};
