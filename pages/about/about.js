Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 关于'
    }
  },
  data: {
    year: new Date().getFullYear(),
    themeClass: ''
  },

  onLoad() {
    this.loadThemeMode();
  },

  onShow() {
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    this.setData({ themeMode })
    
    // 获取实际的主题
    let actualTheme
    if (themeMode === 'system') {
      const systemSetting = wx.getSystemSetting()
      actualTheme = systemSetting.theme || 'light'
    } else {
      actualTheme = themeMode
    }
    
    // 更新页面主题类
    this.updateThemeClass(actualTheme)
    
    // 更新导航栏（无论什么模式都要更新）
    this.updateNavigationBarAndTabBar(actualTheme)
  },

  updateNavigationBarAndTabBar(theme) {
    // 设置导航栏
    if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
      wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
      })
    }
    
    // 设置 TabBar
    if (wx.setTabBarStyle && typeof wx.setTabBarStyle === 'function') {
      wx.setTabBarStyle({
        color: theme === 'dark' ? '#999999' : '#666666',
        selectedColor: theme === 'dark' ? '#09e765' : '#07C160',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderStyle: theme === 'dark' ? 'white' : 'black'
      })
    }
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

  navigateToPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们非常重视您的隐私。本应用的所有功能均在您的设备本地运行，您输入的任何数据都不会上传至服务器，也不会被收集、存储或分享给第三方。所有处理过程仅在您的设备上完成，数据不会离开您的设备。您可以完全放心使用。',
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
      path: '/pages/about/about'
    }
  }
})
