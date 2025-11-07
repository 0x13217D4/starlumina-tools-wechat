Page({
  data: {
    currentTime: ''
  },

  onLoad: function() {
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
    
    // 检测横竖屏变化
    wx.onWindowResize((res) => {
      this.setData({
        isLandscape: res.size.windowWidth > res.size.windowHeight
      });
    });
    
    // 初始检测 - 使用新的API替代已弃用的wx.getSystemInfo
    try {
      const windowInfo = wx.getWindowInfo();
      this.setData({
        isLandscape: windowInfo.windowWidth > windowInfo.windowHeight
      });
    } catch (error) {
      console.warn('获取窗口信息失败:', error);
      // 使用默认值
      this.setData({
        isLandscape: false
      });
    }
  },

  updateTime: function() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}:${seconds}`
    });
  },

  onUnload: function() {
    clearInterval(this.timer);
  },

  onShareAppMessage: function() {
    return {
      title: '时间屏幕 - 星芒集盒',
      path: '/pages/time-screen/time-screen'
    }
  }
})