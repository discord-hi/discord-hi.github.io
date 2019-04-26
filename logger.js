 /**
 * Configurations of logger.
 */
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');
const { format } = require('logform');
const LEVEL = Symbol.for('level');

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
//time in UTC
var rotFile = new (winston.transports.DailyRotateFile)({
  filename: 'access-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxFiles: '14d',
  dirname: './logs/'
});

const logger = winston.createLogger({
  format: alignedWithColorsAndTime,
  transports: [
    new winston.transports.Console(),
    rotFile
  ]
});
module.exports = {
  'log': logger,
};
