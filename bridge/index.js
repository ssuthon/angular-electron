const _ = require('lodash')
const { ipcMain } = require('electron');

function register(target, prefix, methods){
  if(!methods){
    methods = _.filter(_.keys(target), k => _.isFunction(target[k]))
  }
  _.each(methods, m => {
    console.log('registering ipc for ', `${prefix}/${m}`)
    ipcMain.on(`${prefix}/${m}`, (...args) => {      
      target[m].apply(target, args)
    })
  })
}

register(require('./log'), 'log')
register(require('./serialport'), 'serialport')

if(process.platform == 'linux'){  
  register(require('./gpio'), 'gpio')
}
