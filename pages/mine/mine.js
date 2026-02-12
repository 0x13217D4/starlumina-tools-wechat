const defaultAvatarUrl = '/images/user.png'
const auth = require('../../utils/auth.js')

Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 我的',
      imageUrl: '/images/mine.png'
    }
  },
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      gender: 0,
      birthday: ''
    },
    defaultAvatarUrl: defaultAvatarUrl,
    genderText: ['未知', '男', '女'],
    themeClass: ''
  },

  onLoad() {
    this.loadUserInfo()
    this.loadThemeMode()
  },

  onShow() {
    this.loadUserInfo()
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    this.setData({ themeMode })
    
    // 获取实际的主题 - 优先使用应用级别的当前主题
    const app = getApp()
    let actualTheme = app.globalData.theme || 'light'
    
    // 如果应用级别没有主题信息，则按传统方式计算
    if (!actualTheme || actualTheme === 'light') {
      if (themeMode === 'system') {
        const systemSetting = wx.getSystemSetting()
        actualTheme = systemSetting.theme || 'light'
      } else {
        actualTheme = themeMode
      }
    }
    
    // 更新页面主题类
    this.updateThemeClass(actualTheme)
    
    // 更新导航栏和 TabBar（无论什么模式都要更新）
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

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  editUserInfo() {
    // 检查用户是否登录
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    
    if (!userInfo || !token) {
      // 未登录，跳转到登录页面
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      // 已登录，跳转到编辑个人信息页面
      wx.navigateTo({
        url: '/pages/mine/edit/edit'
      })
    }
  },

  aboutApp() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    })
    this.saveUserInfo()
  },

  saveUserInfo() {
    wx.setStorageSync('userInfo', this.data.userInfo)
  },
  
  onShareAppMessage: function() {
    return {
      title: '个人中心',
      path: '/pages/mine/mine',
      imageUrl: this.data.userInfo.avatarUrl || '/images/user.png'
    }
  }
})
