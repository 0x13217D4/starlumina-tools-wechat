/**
 * 设备信息页面
 * 展示从微信API获取的完整设备信息
 */
const DeviceService = require('../../utils/device-service');
const DeviceUtils = require('../../utils/device-utils');

Page({
  data: {
    deviceInfo: {},    // 设备信息数据
    displayInfo: {},   // 显示配置
    basicInfo: {},     // 基础设备信息
    screenInfo: {},    // 屏幕信息
    performanceInfo: {}, // 性能信息
    batteryInfo: {},    // 电量信息
    themeClass: ''     // 主题类名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.loadThemeMode();
    // 首先设置显示配置和默认数据，让页面框架先显示
    this.setData({
      displayInfo: DeviceUtils.getDisplayConfig(),
      // 设置占位数据，显示加载状态
      basicInfo: {
        brand: '获取中...',
        model: '获取中...',
        system: '获取中...',
        version: '获取中...',
        platform: '获取中...',
        SDKVersion: '获取中...',
        ipv4: '获取中...',
        ipv6: '获取中...',
        networkType: '获取中...'
      },
      screenInfo: {
        pixelRatio: '获取中...',
        screenWidth: '获取中...',
        screenHeight: '获取中...',
        windowWidth: '获取中...',
        windowHeight: '获取中...',
        statusBarHeight: '获取中...'
      },
      performanceInfo: {
        benchmarkLevel: '获取中...',
        modelLevel: '获取中...',
        level: '获取中...'
      },
      batteryInfo: {
        level: '获取中...',
        isCharging: '获取中...',
        isLowPowerModeEnabled: '获取中...'
      }
    });

    // 然后异步获取真实数据
    this._loadDeviceInfo();
  },

  onShow() {
    this.loadThemeMode();
  },

  /**
   * 异步加载设备信息
   * @private
   */
  async _loadDeviceInfo() {
    try {
      // 并行获取设备信息和网络IP地址
      const [deviceInfo, ipv4, ipv6] = await Promise.all([
        DeviceService.getDeviceInfo(),
        DeviceService.getIPv4(),
        DeviceService.getIPv6()
      ]);
      
      // 设置IPv4和IPv6信息
      deviceInfo.ipv4 = ipv4;
      deviceInfo.ipv6 = ipv6;
      
      this._updateDeviceInfo(deviceInfo);
    } catch (error) {
      console.error('获取设备信息失败:', error);
      // 设置错误数据，避免页面空白
      this._updateDeviceInfo({
        brand: '获取失败',
        model: '获取失败',
        system: '获取失败',
        version: '获取失败',
        platform: '获取失败',
        SDKVersion: '获取失败',
        ipv4: '获取失败',
        ipv6: '获取失败',
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
        networkType: '获取失败'
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
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    
    // 获取实际的主题 - 优先使用应用级别的当前主题
    const app = getApp()
    let actualTheme = app.globalData.theme || 'light'
    
    // 如果应用级别没有主题信息，则按传统方式计算
    if (!actualTheme || actualTheme === 'light') {
      if (themeMode === 'system') {
        const systemSetting = wx.getSystemSetting()
        actualTheme = systemSetting.theme || 'light'
      } else {
        actualTheme = themeMode
      }
    }
    
    // 更新页面主题类
    this.updateThemeClass(actualTheme)
    
    // 更新导航栏样式
    this.updateNavigationBar(actualTheme)
  },

  updateThemeClass(theme) {
    let themeClass = ''
    if (theme === 'dark') {
      themeClass = 'dark'
    } else {
      themeClass = ''
    }
    this.setData({ themeClass })
  },
  
  updateNavigationBar(theme) {
    // 设置导航栏
    if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
      wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
      })
    }
  }
});
