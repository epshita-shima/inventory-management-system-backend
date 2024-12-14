const path=require('path');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, label ,printf} = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date=new Date(timestamp)
  const hours=date.getHours()
  const minutes=date.getMinutes()
  const seconds=date.getSeconds()
  return `${date.toLocaleDateString()} ${hours}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'MEB' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
       new transports.DailyRotateFile({
        filename: path.join(process.cwd(),'logs','winston','successes','meb-%DATE%-success.log'),
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      })
  ],
});
const errorlogger = createLogger({
  level: 'error',
  format: combine(
    label({ label: 'MEB' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
      new transports.DailyRotateFile({
        filename: path.join(process.cwd(),'logs','winston','errors','meb-%DATE%-error.log'), 
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      })
  ],
});

module.exports={logger,errorlogger}