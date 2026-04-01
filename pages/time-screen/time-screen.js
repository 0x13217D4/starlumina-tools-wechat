Page({
  data: {
    currentTime: ''
  },

  onLoad: function() {
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
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

  goBack: function() {
    wx.navigateBack();
  },

  onUnload: function() {
    clearInterval(this.timer);
  },

  onShareAppMessage: function() {
    return {
      title: '时间屏幕 - 星芒集盒',
      path: '/pages/time-screen/time-screen'
    }
  },

  onShareTimeline: function() {
    return {
      title: '时间屏幕 - 星芒集盒'
    }
  }
})