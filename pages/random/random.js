Page({
  data: {
    minValue: '',
    maxValue: '',
    result: null,
    error: null,
    themeClass: ''
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

  onMinChange: function(e) {
    this.setData({
      minValue: e.detail.value,
      error: null
    });
  },

  onMaxChange: function(e) {
    this.setData({
      maxValue: e.detail.value,
      error: null
    });
  },

  generateRandom: function() {
    if (!this.data.minValue || !this.data.maxValue) {
      this.setData({
        error: '请输入最小值和最大值',
        result: null
      });
      return;
    }
    
    const min = Number(this.data.minValue);
    const max = Number(this.data.maxValue);
    
    if (isNaN(min) || isNaN(max)) {
      this.setData({
        error: '请输入有效数字',
        result: null
      });
      return;
    }
    
    if (min >= max) {
      this.setData({
        error: '最小值必须小于最大值',
        result: null
      });
      return;
    }
    // 直接生成随机数
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    this.setData({
      result: result
    });
    
    // 发送数据到Worker
    worker.postMessage({
      min: min,
      max: max,
      count: 1
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '随机数生成器',
      path: '/pages/random/random'
    }
  },

  onShareTimeline: function() {
    return {
      title: '随机数生成器 - 星芒集盒'
    }
  }
});