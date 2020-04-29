const fs = require('fs');

const args = process.argv.slice(1);
const isProd = !args.some(val => val === '--serve')
const isRunningInLinux = process.platform == 'linux'

const config = {
  isProd,
  isRunningInLinux,
  loggerFilenamePrefix: 'app'
}

/*const ensureDir = (dir) => {   
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir)
  }
}*/

module.exports = config