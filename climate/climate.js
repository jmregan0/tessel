// Import the interface to Tessel hardware
var tessel = require('tessel');
var climatelib = require('climate-si7020');


var climate = climatelib.use(tessel.port['A']);

climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
      console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
      setTimeout(loop, 300);
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});




// Turn one of the LEDs on to start.
//tessel.led[2].on();

// Blink!
/*
setInterval(function () {
  tessel.led[2].toggle();
  tessel.led[3].toggle();
}, 300);

console.log("I'm blinking! (Press CTRL + C to stop)");
*/
