/**
 * 日志管理工具
 * 统一控制日志输出，生产环境自动禁用调试日志
 */

// 判断是否为开发环境（根据小程序环境变量或自定义标识）
const isDevelopment = () => {
  // 微信小程序中可以通过 __DEV__ 全局变量判断
  // 如果没有定义，默认为生产环境
  return typeof __DEV__ !== 'undefined' && __DEV__;
};

/**
 * 日志级别枚举
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// 当前日志级别（生产环境设置为 WARN，只显示警告和错误）
let currentLogLevel = isDevelopment() ? LogLevel.DEBUG : LogLevel.WARN;

/**
 * 设置日志级别
 * @param {number} level 日志级别
 */
function setLogLevel(level) {
  currentLogLevel = level;
}

/**
 * 获取当前日志级别
 * @returns {number} 当前日志级别
 */
function getLogLevel() {
  return currentLogLevel;
}

/**
 * 调试日志（只在开发环境显示）
 * @param {string} message 日志消息
 * @param  {...any} args 附加参数
 */
function debug(message, ...args) {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.debug(message, ...args);
  }
}

/**
 * 信息日志
 * @param {string} message 日志消息
 * @param  {...any} args 附加参数
 */
function info(message, ...args) {
  if (currentLogLevel <= LogLevel.INFO) {
    console.info(message, ...args);
  }
}

/**
 * 警告日志
 * @param {string} message 日志消息
 * @param  {...any} args 附加参数
 */
function warn(message, ...args) {
  if (currentLogLevel <= LogLevel.WARN) {
    console.warn(message, ...args);
  }
}

/**
 * 错误日志
 * @param {string} message 日志消息
 * @param  {...any} args 附加参数
 */
function error(message, ...args) {
  if (currentLogLevel <= LogLevel.ERROR) {
    console.error(message, ...args);
  }
}

/**
 * 普通日志（开发环境使用）
 * @param {string} message 日志消息
 * @param  {...any} args 附加参数
 */
function log(message, ...args) {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.log(message, ...args);
  }
}

module.exports = {
  LogLevel,
  debug,
  info,
  warn,
  error,
  log,
  setLogLevel,
  getLogLevel,
  isDevelopment
};
