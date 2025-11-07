/**
 * 设备信息页面
 * 展示从微信API获取的完整设备信息
 */
const DeviceService = require('../../utils/device-service');
const PermissionService = require('../../utils/permission-service');
const DeviceUtils = require('../../utils/device-utils');

Page({
  data: {
    deviceInfo: {},    // 设备信息数据
    displayInfo: {},   // 显示配置
    basicInfo: {},     // 基础设备信息
    screenInfo: {},    // 屏幕信息
    authInfo: {},      // 权限信息
    performanceInfo: {}, // 性能信息
    batteryInfo: {}    // 电量信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    this.setData({
      displayInfo: DeviceUtils.getDisplayConfig()
    });

    try {
      const [deviceInfo, ipAddress] = await Promise.all([
        DeviceService.getDeviceInfo(),
        DeviceService.getIPAddress()
      ]);
      
      deviceInfo.ipAddress = ipAddress;
      this._updateDeviceInfo(deviceInfo);
    } catch (error) {
      console.error('获取设备信息失败:', error);
      // 设置默认数据，避免页面空白
      this._updateDeviceInfo({
        brand: '未知',
        model: '未知',
        system: '未知',
        version: '未知',
        platform: '未知',
        SDKVersion: '未知',
        ipAddress: '获取失败',
        pixelRatio: 1,
        screenWidth: 375,
        screenHeight: 667,
        windowWidth: 375,
        windowHeight: 667,
        statusBarHeight: 20,
        benchmarkLevel: -1,
        modelLevel: 0,
        level: -1,
        isCharging: false,
        isLowPowerModeEnabled: false,
        albumAuthorized: false,
        cameraAuthorized: false,
        locationAuthorized: false,
        microphoneAuthorized: false,
        networkType: '未知'
      });
    }
  },

  /**
   * 更新设备信息显示
   * @private
   */
  _updateDeviceInfo(deviceInfo) {
    const categorizedInfo = DeviceUtils.categorizeDeviceInfo(deviceInfo);

    // 格式化性能信息显示
    if (categorizedInfo.performanceInfo) {
      const formattedPerformance = {};
      Object.keys(categorizedInfo.performanceInfo).forEach(key => {
        const value = categorizedInfo.performanceInfo[key];
        if (key === 'benchmarkLevel') {
          formattedPerformance[key] = DeviceUtils.formatBenchmarkLevel(value);
        } else if (key === 'modelLevel') {
          formattedPerformance[key] = DeviceUtils.formatModelLevel(value);
        } else {
          formattedPerformance[key] = value;
        }
      });
      categorizedInfo.performanceInfo = formattedPerformance;
    }

    // 格式化电量信息显示
    if (categorizedInfo.batteryInfo) {
      const formattedBattery = {};
      Object.keys(categorizedInfo.batteryInfo).forEach(key => {
        const value = categorizedInfo.batteryInfo[key];
        if (key === 'level') {
          formattedBattery[key] = DeviceUtils.formatBatteryLevel(value);
        } else if (key === 'isCharging') {
          formattedBattery[key] = DeviceUtils.formatChargingStatus(value);
        } else if (key === 'isLowPowerModeEnabled') {
          formattedBattery[key] = DeviceUtils.formatLowPowerMode(value);
        } else {
          formattedBattery[key] = value;
        }
      });
      categorizedInfo.batteryInfo = formattedBattery;
    }

    this.setData({
      deviceInfo,
      ...categorizedInfo
    });
  },

  /**
   * 点击权限项事件处理
   */
  async onAuthItemTap(e) {
    const key = e.currentTarget.dataset.key;
    const value = this.data.authInfo[key];
    
    if (value === '未请求') {
      const newStatus = await PermissionService.requestPermission(key);
      this._updateAuthStatus(key, newStatus);
    }
  },

  /**
   * 更新权限状态
   * @private
   */
  _updateAuthStatus(key, status) {
    this.setData({
      [`authInfo.${key}`]: status
    });
  },


  onShareAppMessage() {
    return {
      title: '设备信息详情',
      path: '/pages/deviceinfo/deviceinfo',
      imageUrl: '/images/tools.png'
    };
  },

  onShareTimeline() {
    return {
      title: '星芒集盒 - 设备信息',
      imageUrl: '/images/tools.png'
    };
  }
});



