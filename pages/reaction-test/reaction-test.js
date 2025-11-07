Page({
  data: {
    startTime: 0,
    reactionTime: 0,
    bestTime: 0,
    testCount: 0,
    isTesting: false,
    screenColor: '#07C160',
    instructionText: '开始测试'
  },

  handleScreenTap: function() {
    if (!this.data.isTesting) {
      // 开始测试
      this.startTest();
    } else {
      if (this.data.screenColor === '#FF0000') {
        // 在红色状态下点击，提示点快了
        wx.showToast({
          title: '你点快了哦，请再次尝试',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          isTesting: false,
          screenColor: '#07C160',
          instructionText: '开始测试'
        });
      } else {
        // 点击目标
        this.tapTarget();
      }
    }
  },

  startTest: function() {
    this.setData({
      isTesting: true,
      screenColor: '#FF0000',
      instructionText: '等待变绿',
      reactionTime: 0
    });

    // 随机延迟3-5秒后变绿
    const delay = Math.random() * 2000 + 3000;
    setTimeout(() => {
      this.setData({
        screenColor: '#07C160',
        instructionText: '开始点击',
        startTime: new Date().getTime()
      });
    }, delay);
  },

  tapTarget: function() {
    if (this.data.screenColor !== '#07C160') return;
    
    const endTime = new Date().getTime();
    const reactionTime = endTime - this.data.startTime;
    const newTestCount = this.data.testCount + 1;
    const newBestTime = this.data.bestTime === 0 ? reactionTime : 
                       Math.min(this.data.bestTime, reactionTime);
    
    this.setData({
      reactionTime: reactionTime,
      bestTime: newBestTime,
      testCount: newTestCount,
      isTesting: false,
      screenColor: '#07C160',
      instructionText: '开始测试'
    });
  },

  onShareAppMessage: function() {
    return {
      title: '反应力测试 - 星芒集盒',
      path: '/pages/reaction-test/reaction-test'
    }
  }
})