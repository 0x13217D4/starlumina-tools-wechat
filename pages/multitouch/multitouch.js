Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 多点触控测试'
    }
  },
  data: {
    touchPoints: [],
    currentPoints: 0,
    maxPoints: 0,
    themeClass: ''
  },
  onLoad: function(options) {
    this.loadThemeMode();
    this.setData({
      touchPoints: []
    });
  },

  onShow() {
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    let actualTheme
    if (themeMode === 'system') {
      const systemSetting = wx.getSystemSetting()
      actualTheme = systemSetting.theme || 'light'
    } else {
      actualTheme = themeMode
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
    handleTouchStart: function(e) {
      const touches = e.touches;
      this.setData({
        currentPoints: touches.length,
        maxPoints: Math.max(this.data.maxPoints, touches.length)
      });
      
      const query = wx.createSelectorQuery();
      query.select('.container').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const rect = res[0];
          const newTouchPoints = touches.map(touch => ({
            id: touch.identifier,
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          }));
          this.setData({
            touchPoints: newTouchPoints
          });
        }
      });
    },
    handleTouchMove: function(e) {
      const query = wx.createSelectorQuery();
      query.select('.container').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const rect = res[0];
          const touches = e.touches;
          const newTouchPoints = touches.map(touch => ({
            id: touch.identifier,
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
          }));
          this.setData({
            touchPoints: newTouchPoints,
            currentPoints: touches.length
          });
        }
      });
    },
    handleTouchEnd: function() {
      this.setData({
        touchPoints: [],
        currentPoints: 0
      });
    },
    
    onShareAppMessage: function() {
      return {
        title: '多指触控测试',
        path: '/pages/multitouch/multitouch'
      }
    }
});