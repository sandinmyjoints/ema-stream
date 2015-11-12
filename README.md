ema-stream
==========

Exponential moving average from a stream. Module and command line.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
![Travis](https://travis-ci.org/sandinmyjoints/ema-stream.svg?branch=master)

example - module
================

## numbers source

```js
var emaStream = require('ema-stream');

var ema = emaStream();

var count = 0;
function source () {
  var r = count++;
  ema.write(r.toString() + '\n');
}

setInterval(source, 100);

ema.on('readable', function () {
  ema.pipe(process.stdout);
})
```

### output

```
3
10
18
etc
```

## json source

```javascript
var emaStream = require('ema-stream');

var ema = emaStream({
  pluck: ['key1', 'key2']
});

var count = 0;
function source () {
  var obj = {
    key1: count++,
    key2: Math.random() * 500
  };

  ema.write(JSON.stringify(obj) + '\n');
}

setInterval(source, 100);

ema.on('readable', function () {
  ema.pipe(process.stdout);
});
```

### output

```
{"key1":3,"key2":232}
{"key1":10,"key2":245}
{"key1":18,"key2":210}
etc.
```

# methods

``` js
var emaStream = require('ema-stream');
```

## var ema = emaStream(opts)

Create a new stream instance `ema` with options `opts`:

* `opts.window: 60000` - Length of window in ms.
* `opts.pluck: null` - Keys to pluck from incoming JSON. If unspecified,
  incoming chunks is assumed to be numbers.
* `opts.integers: true` - Whether to round output.
* `opts.refreshEvery: 1000` - How often to emit current average in ms.
* `opts.emitFirstValue: false` - Whether to emit on the first value or wait
  until the first window has passed to emit the first time.

example - command line
======================

## numbers source

```
$ counter
0
1
2
3
^C

$ counter | ema-stream
3 # Output is refreshed every second. 3, 10, 19, 28, etc.

```
## json source

```
$ tail -f logfile.log
{"type":"request","statusCode":200,"wallTime":27,"dbConnections":40}
{"type":"request","statusCode":200,"wallTime":45,"dbConnections":42}
{"type":"request","statusCode":200,"wallTime":207,"dbConnections":48}
{"type":"request","statusCode":200,"wallTime":205,"dbConnections":50}
^C

# Pluck only the keys we're interested in.
$ tail -f logfile.log | ema-stream --pluck wallTime,dbConnections
{"wallTime":62,"dbConnections":42} # Ouput is refreshed every second.
```

# arguments

```
$ ema-stream \
  --window 60000 # Window to calculcate moving average from in ms.
  --integers true # Whether to round output.
  --refreshEvery 1000 # How often to refresh current average in ms.
  --pluck # Comma-separated list of keys to pluck from incoming JSON. If
  unspecified, input is assumed to be numbers.
  --emitFirstValue false # Whether to emit on the first value or wait
  until the first window has passed to emit the first time.
```
