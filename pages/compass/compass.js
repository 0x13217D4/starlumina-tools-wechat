// 指南针管理器
class CompassManager {
  constructor() {
    this.isListening = false;
    this.compassCallback = null;
  }

  // 启动指南针
  startCompass() {
    return new Promise((resolve, reject) => {
      wx.startCompass({
        success: () => {
          this.isListening = true;
          resolve();
        },
        fail: (error) => {
          console.error('启动指南针失败:', error);
          reject(error);
        }
      });
    });
  }

  // 停止指南针
  stopCompass() {
    wx.stopCompass();
    if (this.compassCallback) {
      wx.offCompassChange(this.compassCallback);
      this.compassCallback = null;
    }
    this.isListening = false;
  }

  // 监听指南针变化
  onCompassChange(callback) {
    this.compassCallback = callback;
    wx.onCompassChange(callback);
  }

  // 检查指南针支持
  checkCompassSupport() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: (res) => {
          const support = res.platform !== 'devtools'; // 开发工具不支持指南针
          if (support) {
            resolve(true);
          } else {
            reject(new Error('当前设备不支持指南针功能'));
          }
        },
        fail: reject
      });
    });
  }
}

// 性能优化：节流管理器
const ThrottleManager = {
  lastUpdateTime: 0,
  // 约30fps的更新频率，平衡流畅度和性能
  UPDATE_INTERVAL: 33,
  
  shouldUpdate() {
    const now = Date.now();
    if (now - this.lastUpdateTime >= this.UPDATE_INTERVAL) {
      this.lastUpdateTime = now;
      return true;
    }
    return false;
  },
  
  reset() {
    this.lastUpdateTime = 0;
  }
};

// 方向计算工具
const DirectionCalculator = {
  // 方向区间定义
  DIRECTIONS: [
    { name: '北', min: 337.5, max: 360 },
    { name: '北', min: 0, max: 22.5 },
    { name: '东北', min: 22.5, max: 67.5 },
    { name: '东', min: 67.5, max: 112.5 },
    { name: '东南', min: 112.5, max: 157.5 },
    { name: '南', min: 157.5, max: 202.5 },
    { name: '西南', min: 202.5, max: 247.5 },
    { name: '西', min: 247.5, max: 292.5 },
    { name: '西北', min: 292.5, max: 337.5 }
  ],

  // 获取方向名称
  getDirectionName(direction) {
    const dir = parseFloat(direction);
    for (const item of this.DIRECTIONS) {
      if (dir >= item.min && dir < item.max) {
        return item.name;
      }
    }
    return '未知';
  },

  // 格式化角度显示
  formatDirection(direction) {
    return `${parseFloat(direction).toFixed(1)}°`;
  },

  // 计算最短角度差（处理 0/360 边界）
  angleDifference(from, to) {
    let diff = to - from;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  },

  // 平滑处理方向变化（线性插值平滑）
  smoothDirection(currentDirection, newDirection, smoothingFactor = 0.3) {
    const diff = this.angleDifference(currentDirection, newDirection);
    // 使用插值平滑，smoothingFactor 越小越平滑
    let smoothed = currentDirection + diff * smoothingFactor;
    // 确保角度在 0-360 范围内
    if (smoothed < 0) smoothed += 360;
    if (smoothed >= 360) smoothed -= 360;
    return smoothed;
  },

  // 判断角度变化是否显著（避免微小抖动触发更新）
  isSignificantChange(currentDirection, newDirection, threshold = 0.5) {
    return Math.abs(this.angleDifference(currentDirection, newDirection)) >= threshold;
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
  },

  showModal(title, content) {
    return new Promise((resolve) => {
      wx.showModal({
        title,
        content,
        showCancel: false,
        success: () => resolve()
      });
    });
  }
};

Page({
  data: {
    isListening: false,
    direction: 0,
    displayDirection: 0,
    directionFormatted: '0.0°',
    directionText: '北',
    lastTimestamp: 0,
    isCalibrating: false,
    hasAttemptedStart: false  // 标记是否已经尝试过启动
  },

  compassManager: null,

  onLoad() {
    this.loadThemeMode();
    this.compassManager = new CompassManager();
    this.setData({
      lastTimestamp: Date.now()
    });
    
    // 自动启动指南针
    
  },

  onShow() {
    this.loadThemeMode()
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
  },
  // 启动指南针监听
  async startCompassListening() {
    if (this.data.isListening || this.data.hasAttemptedStart) {
      return;
    }

    // 标记已尝试启动
    this.setData({ hasAttemptedStart: true });

    try {
      // 检查设备支持
      await this.compassManager.checkCompassSupport();
      
      // 启动指南针
      await this.compassManager.startCompass();
      
      // 设置监听回调
      this.compassManager.onCompassChange(this.handleCompassChange.bind(this));
      
      this.setData({ isListening: true });
      UIHelper.showToast('指南针已启动');
      
    } catch (error) {
      console.error('启动指南针失败:', error);
      UIHelper.showModal('提示', error.message || '启动失败，请检查设备支持');
    }
  },

  // 停止指南针监听
  stopCompassListening() {
    if (!this.data.isListening) {
      return;
    }

    this.compassManager.stopCompass();
    this.setData({ 
      isListening: false,
      lastTimestamp: 0,
      hasAttemptedStart: false  // 重置启动标志，允许下次重新启动
    });
    UIHelper.showToast('指南针已停止');
  },

  // 校准指南针
  async calibrateCompass() {
    if (this.data.isCalibrating) {
      return;
    }

    this.setData({ isCalibrating: true });
    
    try {
      UIHelper.showToast('请按图示校准指南针', 'none', 2000);
      
      // 模拟校准过程（实际项目中可以调用校准API）
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      UIHelper.showToast('校准完成');
    } catch (error) {
      console.error('校准失败:', error);
      UIHelper.showErrorMessage('校准失败，请重试');
    } finally {
      this.setData({ isCalibrating: false });
    }
  },

  // 原始方向数据（用于平滑计算，不触发渲染）
  _rawDirection: 0,
  // 动画帧ID
  _animationFrameId: null,
  // 目标方向（用于动画插值）
  _targetDirection: 0,

  // 处理指南针数据变化
  handleCompassChange(res) {
    const newDirection = parseFloat(res.direction);
    this._targetDirection = newDirection;
    
    // 节流：限制 setData 调用频率
    if (!ThrottleManager.shouldUpdate()) {
      return;
    }
    
    // 检查变化是否显著，避免无意义的更新
    if (!DirectionCalculator.isSignificantChange(this.data.displayDirection, newDirection, 0.5)) {
      return;
    }
    
    // 平滑处理
    const smoothedDirection = DirectionCalculator.smoothDirection(
      this.data.displayDirection, 
      newDirection,
      0.4  // 平滑因子，平衡响应速度和流畅度
    );
    
    // 只更新必要的数据
    this.setData({
      displayDirection: smoothedDirection,
      directionFormatted: DirectionCalculator.formatDirection(newDirection),
      directionText: DirectionCalculator.getDirectionName(newDirection)
    });
  },

  // 页面显示时重新启动指南针
  onShow() {
    if (this.compassManager && !this.data.isListening) {
      this.startCompassListening();
    }
  },

  // 页面隐藏时停止指南针
  onHide() {
    if (this.compassManager && this.data.isListening) {
      this.compassManager.stopCompass();
      ThrottleManager.reset();
      this.setData({ isListening: false });
    }
  },

  // 页面卸载时清理资源
  onUnload() {
    if (this.compassManager && this.data.isListening) {
      this.compassManager.stopCompass();
    }
    ThrottleManager.reset();
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '指南针测试 - 星芒集盒',
      path: '/pages/compass/compass'
    };
  },

  onShareTimeline() {
    return {
      title: '指南针测试 - 星芒集盒'
    };
  }
});
