var movingAverage = require('moving-average');
var through = require('through2');
var defaults = require('lodash.defaults');
var debug = require('debug')('ema');

module.exports = function (opts) {
  opts = defaults(opts || {}, {
    window: 60 * 1000, // 1 minute.
    pluck: null,
    integers: true,
    refreshEvery: 1000 // 1 second.
  });

  opts.integers = opts.integers === 'false' ? false : true;

  var keys = opts.pluck;
  if (!keys) {
    keys = [ 'default' ];
  }
  debug('opts', opts);

  var maMap = keys.reduce(function (memo, k) {
    memo[k] = movingAverage(opts.window);
    return memo;
  }, {});
  debug('ma', maMap);

  function emit () {
    var obj = {};
    keys.forEach(function (key) {
      var current = maMap[key].movingAverage();
      if (opts.integers) {
        current = Math.round(current);
      }
      obj[key] = current;
    });

    var payload;
    if (opts.pluck) {
      payload = JSON.stringify(obj);
    } else {
      payload = obj.default.toString();
    }
    this.push(payload + '\n');
  }

  var stream = through(function (chunk, enc, cb) {
    var val;

    keys.forEach(function (key) {
      if (opts.pluck) {
        val = JSON.parse(chunk)[key];
      } else {
        val = chunk;
      }
      maMap[key].push(Date.now(), val);
    });

    cb();
  });

  setInterval(emit.bind(stream), opts.refreshEvery);

  return stream;
};
