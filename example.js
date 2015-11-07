var emaStream = require('./index');

var ema = emaStream();

var count = 0;
function source () {
  var r = count++;
  ema.write(r.toString() + '\n');
}

setInterval(source, 100);

ema.on('readable', function () {
  ema.pipe(process.stdout);
});
