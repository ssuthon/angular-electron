const logger = require('winston');

const bridge = {
  debug: (event, message, ...args) => {
    logger.debug('..' + message, ...args)
  },
  info: (event, message, ...args) => {
    logger.info('..' + message, ...args)
  },
  warn: (event, message, ...args) => {
    logger.warn('..' + message, ...args)
  },
  error: (event, message, ...args) => {
    logger.error('..' + message, ...args)
  },
}

module.exports = bridge