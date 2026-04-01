/**
 * 设备信息工具模块
 * 封装设备信息处理相关工具方法
 */

class DeviceUtils {
  /**
   * 分类设备信息
   * @param {Object} data 原始设备数据
   * @param {boolean} isShared 是否为分享模式
   * @returns {Object} 分类后的设备信息
   */
  static categorizeDeviceInfo(data, isShared = false) {
    // 分享模式下的基本信息字段（不包含屏幕宽高）
    const sharedBasicFields = [
      'brand', 'model', 'modelCode', 'system', 'version', 
      'platform', 'SDKVersion', 'PCKernelVersion', 'cpuType', 'memorySize', 
      'ipv4', 'ipv6', 'networkType'
    ];
    
    // 普通模式下的基本信息字段
    const normalBasicFields = [
      'brand', 'model', 'modelCode', 'system', 'version', 
      'platform', 'SDKVersion', 'PCKernelVersion', 'cpuType', 'memorySize', 
      'ipv4', 'ipv6', 'networkType'
    ];

    return {
      basicInfo: this._filterData(data, isShared ? sharedBasicFields : normalBasicFields, isShared),
      // 分享模式下不返回屏幕信息
      screenInfo: isShared ? {} : this._filterData(data, [
        'pixelRatio', 'screenWidth', 'screenHeight',
        'windowWidth', 'windowHeight', 'statusBarHeight'
      ]),
      // 分享模式下不返回性能信息
      performanceInfo: isShared ? {} : this._filterData(data, [
        'benchmarkLevel', 'modelLevel'
      ]),
      // 分享模式下也需要电量信息
      batteryInfo: this._filterData(data, [
        'level', 'isCharging', 'isLowPowerModeEnabled'
      ])
    };
  }

  /**
   * 从完整数据中筛选指定字段
   * @private
   */
  static _filterData(data, keys, isShared = false) {
    const result = {};
    keys.forEach(key => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        result[key] = data[key];
      }
      // PC内核版本仅在PC端显示，非PC端不显示该字段
      // CPU型号仅在Android端显示，其他平台不显示该字段
      // 分享模式下，空值的PC内核版本和CPU型号不显示
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
      'modelCode': '型号代码',
      'system': '操作系统',
      'version': '微信版本',
      'platform': '运行平台',
      'SDKVersion': '基础库版本',
      'PCKernelVersion': 'PC内核版本',
      'cpuType': 'CPU型号',
      'memorySize': '内存大小',
      'ipv4': 'IPv4地址',
      'ipv6': 'IPv6地址',
      'networkType': '网络状态',
      // 屏幕信息
      'pixelRatio': '设备像素比',
      'screenWidth': '屏幕宽度(px)',
      'screenHeight': '屏幕高度(px)',
      'windowWidth': '窗口宽度(px)',
      'windowHeight': '窗口高度(px)',
      'statusBarHeight': '状态栏高度',
      
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

  /**
   * 格式化内存大小显示
   * @param {number} memorySize 内存大小（单位：MB）
   * @returns {string} 格式化后的显示文本
   */
  static formatMemorySize(memorySize) {
    if (!memorySize) {
      return '未知';
    }
    const gb = memorySize / 1024;
    if (gb >= 1) {
      return `${gb.toFixed(1)} GB`;
    }
    return `${memorySize} MB`;
  }

  /**
   * 格式化平台显示
   * @param {string} platform 平台代码
   * @returns {string} 格式化后的显示文本
   */
  static formatPlatform(platform) {
    const platformMap = {
      'ios': 'iOS',
      'android': 'Android',
      'ohos': 'HarmonyOS',
      'ohos_pc': '鸿蒙PC',
      'windows': 'Windows',
      'mac': 'macOS',
      'devtools': '微信开发者工具'
    };
    return platformMap[platform] || platform || '未知';
  }

}

module.exports = DeviceUtils;