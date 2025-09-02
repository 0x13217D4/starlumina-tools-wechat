Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 多点触控测试',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    touchPoints: [],
    currentPoints: 0,
    maxPoints: 0
  },
  onLoad: function(options) {
    this.setData({
      touchPoints: []
    });
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
        path: '/pages/multitouch/multitouch',
        imageUrl: '/images/tools.png'
      }
    }
});