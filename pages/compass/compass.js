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
            reject(new Error('当前环境不支持指南针功能'));
          }
        },
        fail: reject
      });
    });
  }
}

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

  // 平滑处理方向变化（避免指针抖动）
  smoothDirection(currentDirection, newDirection, threshold = 2) {
    const diff = Math.abs(newDirection - currentDirection);
    if (diff < threshold) {
      return currentDirection;
    }
    return newDirection;
  }
};

// 精度格式化工具
const AccuracyFormatter = {
  // 格式化精度信息
  formatAccuracy(accuracy) {
    if (typeof accuracy === 'number') {
      // iOS：number类型，表示相对于磁北极的偏差
      if (accuracy === 0) return '精确';
      if (accuracy < 5) return '高精度';
      if (accuracy < 15) return '中等精度';
      return '低精度';
    } else if (typeof accuracy === 'string') {
      // Android：string类型的枚举值
      const accuracyMap = {
        'high': '高精度',
        'medium': '中等精度',
        'low': '低精度',
        'no-contact': '不可信',
        'unreliable': '不可信'
      };
      return accuracyMap[accuracy] || accuracy;
    }
    return '未知';
  },

  // 获取精度等级
  getAccuracyLevel(accuracy) {
    if (typeof accuracy === 'number') {
      if (accuracy === 0) return 4; // 精确
      if (accuracy < 5) return 3;   // 高精度
      if (accuracy < 15) return 2;  // 中等精度
      return 1;                     // 低精度
    } else if (typeof accuracy === 'string') {
      const levelMap = {
        'high': 3,
        'medium': 2,
        'low': 1,
        'no-contact': 0,
        'unreliable': 0
      };
      return levelMap[accuracy] || 0;
    }
    return 0;
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
    accuracy: '未知',
    accuracyLevel: 0,
    lastTimestamp: 0,
    isCalibrating: false
  },

  compassManager: null,

  onLoad() {
    this.compassManager = new CompassManager();
    this.setData({
      lastTimestamp: Date.now()
    });
  },

  // 启动指南针监听
  async startCompassListening() {
    if (this.data.isListening) {
      return;
    }

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
      UIHelper.showErrorMessage(error.message || '启动失败，请检查设备支持');
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
      lastTimestamp: 0
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

  // 处理指南针数据变化
  handleCompassChange(res) {
    const newDirection = parseFloat(res.direction);
    const smoothedDirection = DirectionCalculator.smoothDirection(
      this.data.displayDirection, 
      newDirection
    );
    
    const updateData = {
      direction: newDirection,
      displayDirection: smoothedDirection,
      directionFormatted: DirectionCalculator.formatDirection(newDirection),
      directionText: DirectionCalculator.getDirectionName(newDirection),
      accuracy: AccuracyFormatter.formatAccuracy(res.accuracy),
      accuracyLevel: AccuracyFormatter.getAccuracyLevel(res.accuracy),
      lastTimestamp: Date.now()
    };
    
    this.setData(updateData);
  },

  // 页面卸载时清理资源
  onUnload() {
    if (this.compassManager && this.data.isListening) {
      this.compassManager.stopCompass();
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '指南针测试 - 星芒集盒',
      path: '/pages/compass/compass',
      imageUrl: '/images/tools.png'
    };
  }
});