/**
 * 设备信息工具模块
 * 封装设备信息处理相关工具方法
 */

class DeviceUtils {
  /**
   * 分类设备信息
   * @param {Object} data 原始设备数据
   * @returns {Object} 分类后的设备信息
   */
  static categorizeDeviceInfo(data) {
    return {
      basicInfo: this._filterData(data, [
        'brand', 'model', 'system', 'version', 
        'platform', 'SDKVersion', 'ipAddress', 'networkType'
      ]),
      screenInfo: this._filterData(data, [
        'pixelRatio', 'screenWidth', 'screenHeight',
        'windowWidth', 'windowHeight', 'statusBarHeight'
      ]),
      authInfo: this._filterData(data, [
        'albumAuthorized', 'cameraAuthorized',
        'locationAuthorized', 'microphoneAuthorized'
      ]),
      performanceInfo: this._filterData(data, [
        'benchmarkLevel', 'modelLevel'
      ]),
      batteryInfo: this._filterData(data, [
        'level', 'isCharging', 'isLowPowerModeEnabled'
      ])
    };
  }

  /**
   * 从完整数据中筛选指定字段
   * @private
   */
  static _filterData(data, keys) {
    const result = {};
    keys.forEach(key => {
      if (data[key] !== undefined) {
        result[key] = data[key];
      }
    });
    return result;
  }

  /**
   * 获取显示配置（字段名映射）
   * @returns {Object} 显示配置
   */
  static getDisplayConfig() {
    return {
      // 设备基本信息
      'brand': '设备品牌',
      'model': '设备型号',
      'system': '操作系统',
      'version': '微信版本',
      'platform': '运行平台',
      'SDKVersion': '基础库版本',
      'ipAddress': 'IP地址',
      'networkType': '网络状态',
      // 屏幕信息
      'pixelRatio': '设备像素比',
      'screenWidth': '屏幕宽度(px)',
      'screenHeight': '屏幕高度(px)',
      'windowWidth': '窗口宽度(px)',
      'windowHeight': '窗口高度(px)',
      'statusBarHeight': '状态栏高度',
      
      // 权限状态
      'albumAuthorized': '相册权限',
      'cameraAuthorized': '相机权限',
      'locationAuthorized': '位置权限',
      'microphoneAuthorized': '麦克风权限',
      
      // 性能信息
      'benchmarkLevel': '设备性能等级',
      'modelLevel': '设备机型档位',
      
      // 电量信息
      'level': '设备电量',
      'isCharging': '充电状态',
      'isLowPowerModeEnabled': '省电模式'
    };
  }

  /**
   * 格式化电量显示
   * @param {number} level 电量值
   * @returns {string} 格式化后的显示文本
   */
  static formatBatteryLevel(level) {
    if (level === -1) {
      return '电量未知';
    }
    return `${level}%`;
  }

  /**
   * 格式化充电状态显示
   * @param {boolean} isCharging 是否正在充电
   * @returns {string} 格式化后的显示文本
   */
  static formatChargingStatus(isCharging) {
    return isCharging ? '充电中' : '未充电';
  }

  /**
   * 格式化省电模式显示
   * @param {boolean} isLowPowerModeEnabled 是否开启省电模式
   * @returns {string} 格式化后的显示文本
   */
  static formatLowPowerMode(isLowPowerModeEnabled) {
    return isLowPowerModeEnabled ? '已开启' : '已关闭';
  }

  /**
   * 格式化性能等级显示
   * @param {number} benchmarkLevel 性能等级
   * @returns {string} 格式化后的显示文本
   */
  static formatBenchmarkLevel(benchmarkLevel) {
    if (benchmarkLevel === -1) {
      return '性能未知';
    }
    return `性能等级 ${benchmarkLevel}`;
  }

  /**
   * 格式化机型档位显示
   * @param {number} modelLevel 机型档位
   * @returns {string} 格式化后的显示文本
   */
  static formatModelLevel(modelLevel) {
    switch (modelLevel) {
      case 0:
        return '档位未知';
      case 1:
        return '高档机';
      case 2:
        return '中档机';
      case 3:
        return '低档机';
      default:
        return `未知档位(${modelLevel})`;
    }
  }

}

module.exports = DeviceUtils;