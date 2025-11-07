/**
 * 设备信息服务模块
 * 封装设备信息获取相关逻辑
 */

class DeviceService {
  /**
   * 获取设备基准信息
   * @returns {Promise<Object>} 设备基准信息对象
   */
  static async getDeviceBenchmarkInfo() {
    return new Promise((resolve) => {
      // 检查API是否可用
      if (wx.getDeviceBenchmarkInfo) {
        wx.getDeviceBenchmarkInfo({
          success: (res) => {
            resolve({
              benchmarkLevel: res.benchmarkLevel || -1,
              modelLevel: res.modelLevel || 0
            });
          },
          fail: () => {
            resolve({
              benchmarkLevel: -1,
              modelLevel: 0
            });
          }
        });
      } else {
        // 低版本兼容处理
        resolve({
          benchmarkLevel: -1,
          modelLevel: 0
        });
      }
    });
  }

  /**
   * 获取电量信息
   * @returns {Object} 电量信息对象
   */
  static getBatteryInfo() {
    try {
      // 检查API是否可用
      if (wx.getBatteryInfoSync) {
        const batteryInfo = wx.getBatteryInfoSync();
        return {
          level: batteryInfo.level || -1,
          isCharging: batteryInfo.isCharging || false,
          isLowPowerModeEnabled: batteryInfo.isLowPowerModeEnabled || false
        };
      } else {
        // 低版本兼容处理
        return {
          level: -1,
          isCharging: false,
          isLowPowerModeEnabled: false
        };
      }
    } catch (error) {
      console.warn('获取电量信息失败:', error);
      return {
        level: -1,
        isCharging: false,
        isLowPowerModeEnabled: false
      };
    }
  }

  /**
   * 获取完整设备信息
   * @returns {Promise<Object>} 设备信息对象
   */
  static async getDeviceInfo() {
    const systemInfo = await this._getSystemInfo();
    const authInfo = await this._getAuthInfo();
    const networkInfo = await this._getNetworkInfo();
    const benchmarkInfo = await this.getDeviceBenchmarkInfo();
    const batteryInfo = this.getBatteryInfo();
    
    return {
      ...systemInfo,
      ...authInfo,
      networkType: networkInfo.networkType,
      ...benchmarkInfo,
      ...batteryInfo
    };
  }

  /**
   * 获取系统信息
   * @private
   */
  static async _getSystemInfo() {
    try {
      // 使用新的API替代已弃用的wx.getSystemInfo
      const appBaseInfo = wx.getAppBaseInfo();
      const deviceInfo = wx.getDeviceInfo();
      const windowInfo = wx.getWindowInfo();
      
      return {
        ...appBaseInfo,
        ...deviceInfo,
        ...windowInfo
      };
    } catch (error) {
      console.warn('获取系统信息失败，使用备用方案:', error);
      // 备用方案：返回基本系统信息
      return {
        platform: 'unknown',
        version: 'unknown',
        SDKVersion: 'unknown',
        windowWidth: 375,
        windowHeight: 667
      };
    }
  }

  /**
   * 获取权限信息
   * @private
   */
  static _getAuthInfo() {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => resolve({
          albumAuthorized: res.authSetting['scope.writePhotosAlbum'],
          cameraAuthorized: res.authSetting['scope.camera'],
          locationAuthorized: res.authSetting['scope.userLocation'],
          microphoneAuthorized: res.authSetting['scope.record']
        }),
        fail: () => resolve({
          albumAuthorized: false,
          cameraAuthorized: false,
          locationAuthorized: false,
          microphoneAuthorized: false
        })
      });
    });
  }

  /**
   * 获取网络信息
   * @private
   */
  static _getNetworkInfo() {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: resolve,
        fail: () => resolve({ networkType: '未知' })
      });
    });
  }

  /**
   * 获取IP地址
   * @returns {Promise<string>} IP地址
   */
  static async getIPAddress() {
    try {
      const res = await new Promise((resolve) => {
        wx.request({
          url: 'https://test.ustc.edu.cn/backend/getIP.php',
          success: resolve,
          fail: () => resolve({ data: { processedString: '获取失败' } })
        });
      });
      return res.data?.processedString || '获取失败';
    } catch (error) {
      return '获取失败';
    }
  }
}

module.exports = DeviceService;