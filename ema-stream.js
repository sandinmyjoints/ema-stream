#!/usr/bin/env node

var split2 = require('split2')
var logUpdate = require('log-update')
var emaStream = require('./index')
var opts = require('minimist')(process.argv.slice(2))

if (opts.pluck) {
  opts.pluck = opts.pluck.split(',').map(function (k) { return k.trim() })
}

var ema = emaStream(opts)

process.stdin.pipe(split2()).pipe(ema)

ema.on('readable', function () {
  logUpdate(ema.read())
})
