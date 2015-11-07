#!/usr/bin/env node

var emaStream = require('./index');
var logUpdate = require('log-update');
var opts = require('minimist')(process.argv.slice(2));

if (opts.pluck) {
  opts.pluck = opts.pluck.split(',').map(function (k) { return k.trim(); });
}

var ema = emaStream(opts);

process.stdin.pipe(ema);

ema.on('readable', function () {
  logUpdate(ema.read());
});
