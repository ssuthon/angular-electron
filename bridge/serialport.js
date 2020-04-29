const SerialPort  = require('serialport');
const Readline  = require('@serialport/parser-readline');
const usbDetect = require('usb-detection');
const _ = require('lodash')
const logger = require('winston');

const bridge = {
  openedPorts: {},  
  detectionActivated: false,
  open: (event, path) => {    
    if(bridge.openedPorts[path]){
      logger.debug(`${path} has been openned, open request is ignored`)
      return
    }
    logger.debug('openning port', {path})    
    const port = new SerialPort(path)
    bridge.openedPorts[path] = port 
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
    const channel = `serialport/onData/${path}` 
    parser.on('data', data => {            
      event.reply(channel, data)
    })
    logger.debug('port opening completed.')
  },  
  list: (event) => {    
    SerialPort.list().then( portInfos => {
      //do close opened ports
      _.forOwn(bridge.openedPorts, (port, path) => {
        if(!_.find(portInfos, ['path', path])){
          logger.debug(`removing ${path}`)          
          delete bridge.openedPorts[path]
        }
      })      
      event.reply('serialport/onList', portInfos)
    })
  },
  listWithDetection: (event) => {
    bridge.list(event)
    if(!bridge.detectionActivated){
      usbDetect.startMonitoring()
      usbDetect.on('change', (device) => {
        bridge.list(event)
      })
      bridge.detectionActivated = true
    }
  },
  stopDeviceDetection: (event) => {
    usbDetect.stopMonitoring()
  },
  write: (event, path, command) => {
    let port = bridge.openedPorts[path]
    if(port){      
      port.write(command)
    }
  }
}

module.exports = bridge