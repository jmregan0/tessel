// Import the interface to Tessel hardware
var tessel = require('tessel');
var climatelib = require('./climate/node_modules/climate-si7020');
var servo = require('./servo/servo.js');
//var jQuery = require('jquery');
var servo1 = 1; // We have a servo plugged in at position 1
var readTemp = true;
var player = require('play-sound')(opts = {})


  servo.on('motorOn', function () {
    var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

    //  Set the minimum and maximum duty cycle for servo 1.
    //  If the servo doesn't move to its full extent or stalls out
    //  and gets hot, try tuning these values (0.05 and 0.12).
    //  Moving them towards each other = less movement range
    //  Moving them apart = more range, more likely to stall and burn out
    servo.configure(servo1, 0.05, 0.12, function () {
      player.play('bryan.mp3', function(err){
        if (err) throw err
      })
      setInterval(function () {
        console.log('Position (in range 0-1):', position);
        //  Set servo #1 to position pos.
        servo.move(servo1, position);
        // Increment by 10% (~18 deg for a normal servo)
        position += 0.1;
        if (position > 0.7) {
          position = 0; // Reset servo position

        }
      }, 500); // Every 500 milliseconds
    });
  });



var climate = climatelib.use(tessel.port['B']);

climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        if (+humid.toFixed(2) > 24.00 && readTemp){
          servo.emit('motorOn')
          readTemp = false;
        }
      console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
      setTimeout(loop, 300);
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});


