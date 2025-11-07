Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 随机数生成',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    minValue: '',
    maxValue: '',
    result: null,
    error: null
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
      path: '/pages/random/random',
      imageUrl: '/images/tools.png'
    }
  }
});