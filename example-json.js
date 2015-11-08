var emaStream = require('./index')

var ema = emaStream({
  pluck: ['key1', 'key2']
})

var count = 0
function source () {
  var obj = {
    key1: count++,
    key2: Math.random() * 500
  }

  ema.write(JSON.stringify(obj) + '\n')
}

setInterval(source, 100)

ema.on('readable', function () {
  ema.pipe(process.stdout)
})
