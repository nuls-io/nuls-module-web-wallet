/**
 * trace级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function trace(data) {
  console.log(data);
}

/**
 * debug级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function debug(data) {
  console.log(data);
}

/**
 * info级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function info() {
//function info(data) {
  //console.log(data);
}

/**
 * warn级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function warn(data) {
  console.warn(data);
}

/**
 * log级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function log(data) {
  console.log(data);
}

/**
 * error级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function error(data) {
  console.error(data);
}

/**
 * fatal级别
 * @kind AnyProcess [任意进程调用]
 * @param {any} data 日志数据
 */
function fatal(data) {
  console.log(data);
}

//对外暴露方法
module.exports = {
  trace, debug, info, warn, log, error, fatal
};


