// 传感器管理器
class SensorManager {
  constructor() {
    this.isListening = false;
    this.accelerometerCallback = null;
    this.gyroscopeCallback = null;
  }

  // 启动加速度计
  startAccelerometer() {
    return new Promise((resolve, reject) => {
      wx.startAccelerometer({
        interval: 'ui',
        success: () => {
          this.isListening = true;
          resolve();
        },
        fail: (error) => {
          console.error('启动加速度计失败:', error);
          reject(error);
        }
      });
    });
  }

  // 启动陀螺仪
  startGyroscope() {
    return new Promise((resolve, reject) => {
      wx.startGyroscope({
        interval: 'ui',
        success: () => {
          resolve();
        },
        fail: (error) => {
          console.error('启动陀螺仪失败:', error);
          reject(error);
        }
      });
    });
  }

  // 停止加速度计
  stopAccelerometer() {
    wx.stopAccelerometer();
    if (this.accelerometerCallback) {
      wx.offAccelerometerChange(this.accelerometerCallback);
      this.accelerometerCallback = null;
    }
  }

  // 停止陀螺仪
  stopGyroscope() {
    wx.stopGyroscope();
    if (this.gyroscopeCallback) {
      wx.offGyroscopeChange(this.gyroscopeCallback);
      this.gyroscopeCallback = null;
    }
  }

  // 监听加速度计变化
  onAccelerometerChange(callback) {
    this.accelerometerCallback = callback;
    wx.onAccelerometerChange(callback);
  }

  // 监听陀螺仪变化
  onGyroscopeChange(callback) {
    this.gyroscopeCallback = callback;
    wx.onGyroscopeChange(callback);
  }

  // 停止所有传感器
  stopAll() {
    this.stopAccelerometer();
    this.stopGyroscope();
    this.isListening = false;
  }
}

// 数据格式化工具
const DataFormatter = {
  formatAxisValue(value) {
    // 值为0时返回 '0.00'，不带符号
    if (value === 0) {
      return '0.00';
    }
    return value.toFixed(2);
  },

  resetSensorData() {
    return {
      x: 0,
      y: 0,
      z: 0,
      xFormatted: '0.00',
      yFormatted: '0.00',
      zFormatted: '0.00',
      gx: 0,
      gy: 0,
      gz: 0,
      gxFormatted: '0.00',
      gyFormatted: '0.00',
      gzFormatted: '0.00'
    };
  }
};

// UI交互工具
const UIHelper = {
  showToast(title, icon = 'success', duration = 1000) {
    wx.showToast({
      title,
      icon,
      duration
    });
  },

  showErrorMessage(message) {
    this.showToast(message, 'none', 2000);
  }
};

Page({
  data: {
    isListening: false,
    ...DataFormatter.resetSensorData(),
    lastTimestamp: 0,
    startTime: 0
  },

  sensorManager: null,

  onLoad() {
    this.sensorManager = new SensorManager();
    this.setData({
      startTime: Date.now()
    });
    this.loadThemeMode();
  },

  // 启动传感器监听
  async startSensorListening() {
    if (this.data.isListening) {
      return;
    }

    try {
      // 启动加速度计
      await this.sensorManager.startAccelerometer();
      
      // 启动陀螺仪
      await this.sensorManager.startGyroscope();
      
      // 设置监听回调
      this.sensorManager.onAccelerometerChange(this.handleAccelerometerChange.bind(this));
      this.sensorManager.onGyroscopeChange(this.handleGyroscopeChange.bind(this));
      
      this.setData({ isListening: true });
      UIHelper.showToast('传感器已启动');
      
    } catch (error) {
      console.error('启动传感器失败:', error);
      UIHelper.showErrorMessage('启动失败，请检查设备支持');
    }
  },

  // 停止传感器监听
  stopSensorListening() {
    if (!this.data.isListening) {
      return;
    }

    this.sensorManager.stopAll();
    this.setData({ 
      isListening: false,
      lastTimestamp: 0
    });
    UIHelper.showToast('传感器已停止');
  },

  // 处理加速度计数据变化
  handleAccelerometerChange(res) {
    const updateData = {
      x: res.x,
      y: res.y,
      z: res.z,
      xFormatted: DataFormatter.formatAxisValue(res.x),
      yFormatted: DataFormatter.formatAxisValue(res.y),
      zFormatted: DataFormatter.formatAxisValue(res.z),
      lastTimestamp: Date.now()
    };
    
    this.setData(updateData);
  },

  // 处理陀螺仪数据变化
  handleGyroscopeChange(res) {
    const updateData = {
      gx: res.x,
      gy: res.y,
      gz: res.z,
      gxFormatted: DataFormatter.formatAxisValue(res.x),
      gyFormatted: DataFormatter.formatAxisValue(res.y),
      gzFormatted: DataFormatter.formatAxisValue(res.z)
    };
    
    this.setData(updateData);
  },

  // 重置数据
  resetData() {
    const resetData = {
      ...DataFormatter.resetSensorData(),
      lastTimestamp: 0,
      startTime: Date.now()
    };
    
    this.setData(resetData);
    UIHelper.showToast('数据已重置');
  },

  // 页面隐藏时停止传感器以节省资源
  onHide() {
    if (this.sensorManager && this.data.isListening) {
      this.sensorManager.stopAll();
      this.setData({ isListening: false });
    }
  },

  // 页面卸载时清理资源
  onUnload() {
    if (this.sensorManager && this.data.isListening) {
      this.sensorManager.stopAll();
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '传感器测试 - 星芒集盒',
      path: '/pages/sensor/sensor'
    };
  },

  onShareTimeline() {
    return {
      title: '传感器测试 - 星芒集盒'
    };
  },

  onShow() {
    this.loadThemeMode();
    // 自动启动传感器监听
    if (!this.data.isListening) {
      this.startSensorListening();
    }
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