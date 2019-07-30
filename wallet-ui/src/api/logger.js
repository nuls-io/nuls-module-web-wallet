//const IS_DEV = process.env.NODE_ENV !== 'production';//开发模式
//const log4js = require('log4js');
const log4js = {};

/*let fileUrl = IS_DEV ? 'wallet_web_log/data.log' : __dirname + '../../../wallet_web_log/data.log';
log4js.configure({
  appenders: {
    everything: {
      type: 'dateFile',
      filename: fileUrl,
      pattern: '.yyyy-MM-dd-hh',
      keepFileExt: true
    }
  },
  categories: {
    default: {
      appenders: ['everything'],
      level: 'info'
    }
  }
});
*/

//获取logger对象
let logger = log4js.getLogger();

/*logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Comté.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');*/

/**
 * trace级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function trace(data) {
  logger.level = 'trace';
  logger.trace(data);
  console.log(data);
}

/**
 * debug级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function debug(data) {
  logger.level = 'debug';
  logger.debug(data);
  console.log(data);
}

/**
 * info级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function info(data) {
  logger.level = 'info';
  logger.info(data);
  console.log(data);
}

/**
 * warn级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function warn(data) {
  logger.level = 'warn';
  logger.warn(data);
  console.warn(data);
}

/**
 * log级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function log(data) {
  logger.level = 'log';
  logger.log(data);
  console.log(data);
}

/**
 * error级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function error(data) {
  logger.level = 'error';
  logger.error(data);
  console.error(data);
}

/**
 * fatal级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function fatal(data) {
  logger.level = 'fatal';
  logger.fatal(data);
  console.log(data);
}

//对外暴露方法
module.exports = {
  trace, debug, info, warn, log, error, fatal
};


