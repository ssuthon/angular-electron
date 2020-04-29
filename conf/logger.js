const winston = require('winston')
const jsonStringify = require('fast-safe-stringify');
const { combine, timestamp, printf, colorize, splat } = winston.format;
const _ = require('lodash')
const conf = require('./core')

require('winston-daily-rotate-file');

const meta2str = (meta) => {	
	return _.isEmpty(meta) ? '' : jsonStringify(meta)
}
let winston_conf = conf.isProd ?
{
	level: 'debug',
	format: combine(		
		timestamp({
      format: 'MM-DD HH:mm:ss'
    }),
		printf(({ timestamp, level, message, ...meta })=> 
			`${timestamp} ${level}: ${message} ${meta2str(meta)}`)
	),
	transports: [
		new winston.transports.DailyRotateFile({ 
			filename: conf.loggerFilenamePrefix + '-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '40m',
			maxFiles: '14' ,
			createSymlink: true,
			symlinkName: `${conf.loggerFilenamePrefix}.log`,
		})
	]
}
: 
{
	level: 'debug',
	format: combine(		
		colorize(),
		timestamp({
      format: 'MM-DD HH:mm:ss'
    }),
		printf(({ timestamp, level, message, ...meta })=> 
			`${timestamp} ${level}: ${message} ${meta2str(meta)}`)
	),
	transports: [
			new winston.transports.Console()
	]
}

winston.configure(winston_conf);

module.exports = winston