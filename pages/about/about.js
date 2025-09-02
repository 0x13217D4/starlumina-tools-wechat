Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 关于',
      imageUrl: '/images/logo.jpg'
    }
  },
  data: {
    year: new Date().getFullYear()
  },
  navigateToPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们非常重视您的隐私。本应用的所有功能均在您的设备本地运行，您输入的任何数据都不会上传至服务器，也不会被收集、存储或分享给任何第三方。所有处理过程仅在您的设备上完成，数据不会离开您的设备。您可以完全放心使用。',
      showCancel: false,
      confirmText: '好的'
    })
  },

  contactUs() {
    wx.setClipboardData({
      data: 'huhuangchenglin@petalmail.com',
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  },
  
  onShareAppMessage: function() {
    return {
      title: '关于星芒集盒',
      path: '/pages/about/about',
      imageUrl: '/images/logo.jpg'
    }
  }
})