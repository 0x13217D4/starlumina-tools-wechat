Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 屏幕测试',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    colors: ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'],
    currentColor: '#FFFFFF',
    currentIndex: 0
  },
  changeColor: function() {
    const nextIndex = (this.data.currentIndex + 1) % this.data.colors.length;
    const color = this.data.colors[nextIndex];
    this.setData({
      currentColor: color,
      currentIndex: nextIndex
    });
    // 设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: color === '#000000' ? '#ffffff' : '#000000',
      backgroundColor: color,
      animation: {
        duration: 300,
        timingFunc: 'easeInOut'
      }
    });
  },
  onLoad: function() {
    // 初始化导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  },
  onShareAppMessage: function() {
    return {
      title: '屏幕测试工具',
      path: '/pages/screentest/screentest',
      imageUrl: '/images/logo.jpg'
    }
  }
})