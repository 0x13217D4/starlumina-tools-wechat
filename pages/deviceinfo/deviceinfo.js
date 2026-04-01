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
    themeClass: '',     // 主题类名
    isShared: false     // 是否为分享页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
        PCKernelVersion: '获取中...',
        cpuType: '获取中...',
        memorySize: '获取中...',
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

    // 检查是否有分享传递的设备信息
    if (options.info) {
      this._loadSharedDeviceInfo(options.info);
    } else {
      // 异步获取真实数据
      this._loadDeviceInfo();
    }
  },

  onShow() {
    this.loadThemeMode();
    // 分享页面不需要实时刷新
    if (!this.data.isShared) {
      this._startRealtimeUpdate();
    }
  },

  onHide() {
    // 停止实时更新
    this._stopRealtimeUpdate();
  },

  onUnload() {
    // 停止实时更新
    this._stopRealtimeUpdate();
  },

  /**
   * 开启实时数据更新
   * @private
   */
  _startRealtimeUpdate() {
    // 监听网络状态变化
    this._networkChangeListener = (res) => {
      console.log('网络状态变化:', res);
      this._updateNetworkInfo(res);
    };
    wx.onNetworkStatusChange(this._networkChangeListener);

    // 监听电量信息变化
    this._batteryChangeListener = (res) => {
      console.log('电量信息变化:', res);
      this._updateBatteryInfo(res);
    };
    wx.onBatteryInfoChange(this._batteryChangeListener);
  },

  /**
   * 停止实时数据更新
   * @private
   */
  _stopRealtimeUpdate() {
    // 取消网络状态监听
    if (this._networkChangeListener) {
      wx.offNetworkStatusChange(this._networkChangeListener);
      this._networkChangeListener = null;
    }
    // 取消电量信息监听
    if (this._batteryChangeListener) {
      wx.offBatteryInfoChange(this._batteryChangeListener);
      this._batteryChangeListener = null;
    }
  },

  /**
   * 更新网络信息
   * @private
   */
  _updateNetworkInfo(networkRes) {
    const networkType = networkRes.networkType || 'unknown';
    this.setData({
      'basicInfo.networkType': networkType.toUpperCase()
    });
    // 网络变化时重新获取IP
    this._loadIPInfo();
  },

  /**
   * 更新电量信息
   * @private
   */
  _updateBatteryInfo(batteryRes) {
    const formattedBattery = {
      level: DeviceUtils.formatBatteryLevel(batteryRes.level),
      isCharging: DeviceUtils.formatChargingStatus(batteryRes.isCharging),
      isLowPowerModeEnabled: DeviceUtils.formatLowPowerMode(batteryRes.isLowPowerModeEnabled)
    };
    this.setData({
      batteryInfo: formattedBattery,
      'deviceInfo.level': batteryRes.level,
      'deviceInfo.isCharging': batteryRes.isCharging,
      'deviceInfo.isLowPowerModeEnabled': batteryRes.isLowPowerModeEnabled
    });
  },

  /**
   * 异步加载设备信息
   * @private
   */
  async _loadDeviceInfo() {
    try {
      // 第一阶段：快速获取核心设备信息（不包含 IP）
      const deviceInfo = await DeviceService.getDeviceInfo();
        
      // 立即更新页面，展示核心信息
      this._updateDeviceInfo(deviceInfo);
        
      // 第二阶段：异步获取 IP 地址（不阻塞页面）
      this._loadIPInfo();
    } catch (error) {
      // 生产环境减少日志输出
      if (__DEV__) {
        console.error('获取设备信息失败:', error);
      }
      // 设置错误数据，避免页面空白
      this._updateDeviceInfo({
        brand: '获取失败',
        model: '获取失败',
        system: '获取失败',
        version: '获取失败',
        platform: '获取失败',
        SDKVersion: '获取失败',
        PCKernelVersion: undefined,
        cpuType: undefined,
        memorySize: undefined,
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
   * 异步加载 IP 信息（不阻塞页面渲染）
   * @private
   */
  async _loadIPInfo() {
    try {
      // 并行获取 IPv4 和 IPv6，提高加载速度
      const [ipv4, ipv6] = await Promise.all([
        DeviceService.getIPv4(),
        DeviceService.getIPv6()
      ]);
        
      // 更新 IP 信息
      this.setData({
        'basicInfo.ipv4': ipv4,
        'basicInfo.ipv6': ipv6
      });
    } catch (error) {
      // 生产环境减少日志输出
      if (__DEV__) {
        console.warn('获取 IP 信息失败:', error);
      }
      this.setData({
        'basicInfo.ipv4': '获取失败',
        'basicInfo.ipv6': '获取失败'
      });
    }
  },

  /**
   * 更新设备信息显示
   * @private
   */
  _updateDeviceInfo(deviceInfo) {
    const isShared = deviceInfo._isShared || this.data.isShared;
    const categorizedInfo = DeviceUtils.categorizeDeviceInfo(deviceInfo, isShared);

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

    // 格式化基本信息中的内存大小和平台
    if (categorizedInfo.basicInfo) {
      if (categorizedInfo.basicInfo.memorySize) {
        categorizedInfo.basicInfo.memorySize = DeviceUtils.formatMemorySize(
          categorizedInfo.basicInfo.memorySize
        );
      }
      if (categorizedInfo.basicInfo.platform) {
        categorizedInfo.basicInfo.platform = DeviceUtils.formatPlatform(
          categorizedInfo.basicInfo.platform
        );
      }
      // 分享模式下，过滤掉空值的PC内核版本和CPU型号
      if (isShared) {
        if (!categorizedInfo.basicInfo.PCKernelVersion || categorizedInfo.basicInfo.PCKernelVersion === 'undefined') {
          delete categorizedInfo.basicInfo.PCKernelVersion;
        }
        if (!categorizedInfo.basicInfo.cpuType || categorizedInfo.basicInfo.cpuType === 'undefined') {
          delete categorizedInfo.basicInfo.cpuType;
        }
      }
    }

    this.setData({
      deviceInfo,
      ...categorizedInfo
    });
  },

  /**
   * 编码设备信息用于分享
   * @private
   * @returns {string} 编码后的设备信息字符串
   */
  _encodeDeviceInfo() {
    const info = this.data.deviceInfo;
    const basicInfo = this.data.basicInfo;
    const batteryInfo = this.data.batteryInfo;
    
    // 编码分享页面需要显示的信息
    const keyInfo = {
      // 基本信息
      brand: info.brand || basicInfo.brand || '',
      model: info.model || basicInfo.model || '',
      system: info.system || basicInfo.system || '',
      version: info.version || basicInfo.version || '',
      platform: info.platform || basicInfo.platform || '',
      SDKVersion: info.SDKVersion || basicInfo.SDKVersion || '',
      PCKernelVersion: info.PCKernelVersion || basicInfo.PCKernelVersion || '',
      cpuType: info.cpuType || basicInfo.cpuType || '',
      memorySize: info.memorySize || basicInfo.memorySize || '',
      // 网络信息
      ipv4: info.ipv4 || basicInfo.ipv4 || '',
      ipv6: info.ipv6 || basicInfo.ipv6 || '',
      networkType: info.networkType || basicInfo.networkType || '',
      // 电量信息
      level: info.level,
      isCharging: info.isCharging,
      isLowPowerModeEnabled: info.isLowPowerModeEnabled
    };
    try {
      return encodeURIComponent(JSON.stringify(keyInfo));
    } catch (e) {
      console.error('编码设备信息失败:', e);
      return '';
    }
  },

  /**
   * 加载分享传递的设备信息
   * @private
   * @param {string} encodedInfo 编码后的设备信息
   */
  _loadSharedDeviceInfo(encodedInfo) {
    try {
      const info = JSON.parse(decodeURIComponent(encodedInfo));
      // 标记为分享的设备信息
      info._isShared = true;
      // 设置分享模式标志
      this.setData({ isShared: true });
      this._updateDeviceInfo(info);
    } catch (e) {
      console.error('解析分享的设备信息失败:', e);
      // 解析失败时获取当前设备信息
      this._loadDeviceInfo();
    }
  },

  onShareAppMessage() {
    // 编码设备信息到URL参数
    const sharedInfo = this._encodeDeviceInfo();
    return {
      title: '设备信息详情',
      path: `/pages/deviceinfo/deviceinfo?info=${sharedInfo}`
      // 不设置 imageUrl，让微信自动截取当前页面内容
    };
  },

  onShareTimeline() {
    return {
      title: '星芒集盒 - 设备信息'
      // 不设置 imageUrl，让微信自动截取当前页面内容
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
