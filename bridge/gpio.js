const logger = require('winston');

let Gpio = null
try {
  Gpio = require('onoff').Gpio
}catch(e){
  logger.warn('GPIO is not available, all function call will be ignored without error.')
}

const configuredPins = {}; //pin:ref

const bridge = {
  init: (event, pin, value) => {
    if(Gpio && !configuredPins[pin]){
      configuredPins[pin] = new Gpio(pin, value)
    }
  },
  write: (event, pin, value) => {    
    if(Gpio && configuredPins[pin]){
      configuredPins[pin].writeSync(value)
    }    
  },
}

module.exports = bridge