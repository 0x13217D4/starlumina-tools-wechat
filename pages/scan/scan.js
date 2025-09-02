Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 扫码工具',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    isScanning: false,
    result: null
  },

  startScan() {
    if (this.data.isScanning) return;
    
    this.setData({ isScanning: true });
    
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        this.setData({ 
          result: res.result,
          isScanning: false
        });
      },
      fail: (err) => {
        console.error('扫描失败:', err);
        wx.showToast({
          title: '扫描取消或失败',
          icon: 'none'
        });
        this.setData({ isScanning: false });
      }
    });
  },

  copyResult() {
    if (!this.data.result) return;
    
    wx.setClipboardData({
      data: this.data.result,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板'
        });
      }
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '扫码工具',
      path: '/pages/scan/scan',
      imageUrl: '/images/tools.png'
    }
  }
})