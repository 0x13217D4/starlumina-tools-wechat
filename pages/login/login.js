Page({
  data: {
    loading: false,
    themeClass: '',
    agreedToPrivacy: false  // 是否同意用户协议和隐私政策
  },

  onLoad() {
    // 检查是否已经登录
    this.checkLoginStatus()
    this.loadThemeMode()
  },

  onShow() {
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    let actualTheme
    if (themeMode === 'system') {
      const systemSetting = wx.getSystemSetting()
      actualTheme = systemSetting.theme || 'light'
    } else {
      actualTheme = themeMode
    }
    
    // 更新页面主题类
    this.updateThemeClass(actualTheme)
    
    // 更新导航栏样式
    this.updateNavigationBar(actualTheme)
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
  
  updateNavigationBar(theme) {
    // 设置导航栏
    if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
      wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
      })
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    wx.checkSession({
      success: () => {
        // session_key 未过期
        const userInfo = wx.getStorageSync('userInfo')
        const token = wx.getStorageSync('token')
        if (userInfo && token) {
          // 已登录，返回上一页或跳转到个人中心
          wx.navigateBack({
            delta: 1,
            fail: () => {
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            }
          })
        }
      },
      fail: () => {
        // session_key 已过期，需要重新登录
        console.log('session_key 已过期，需要重新登录')
      }
    })
  },

  // 切换协议同意状态
  toggleAgreement() {
    this.setData({
      agreedToPrivacy: !this.data.agreedToPrivacy
    })
  },

  // 打开用户协议
  openUserAgreement() {
    wx.navigateTo({
      url: '/pages/about/about?type=userAgreement'
    })
  },

  // 打开隐私政策
  openPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/about/about?type=privacyPolicy'
    })
  },

  // 获取用户信息授权
  onGetUserInfo(e) {
    // 先检查是否同意了协议
    if (!this.data.agreedToPrivacy) {
      wx.showToast({
        title: '请先同意用户协议和隐私政策',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (e.detail.userInfo) {
      // 用户同意授权
      this.doLogin(e.detail.userInfo)
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: '需要授权才能使用完整功能',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 执行登录
  doLogin(userInfo) {
    this.setData({ loading: true })

    // 调用 wx.login 获取 code
    wx.login({
      success: (res) => {
        if (res.code) {
          // 这里需要将 code 发送到后台服务器换取 openid 和 session_key
          // 由于没有后台服务器，我们直接使用本地存储模拟登录成功
          this.mockLoginSuccess(userInfo, res.code)
        } else {
          console.log('登录失败：' + res.errMsg)
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          })
          this.setData({ loading: false })
        }
      },
      fail: (err) => {
        console.error('wx.login 调用失败：', err)
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
        this.setData({ loading: false })
      }
    })
  },

  // 模拟登录成功（实际项目中应该调用后台接口）
  mockLoginSuccess(userInfo, code) {
    // 存储用户信息
    const userData = {
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      gender: userInfo.gender || 0,
      birthday: ''
    }

    wx.setStorageSync('userInfo', userData)
    
    // 存储模拟的 token（实际项目应该从后台获取）
    wx.setStorageSync('token', 'mock_token_' + Date.now())

    // 存储登录时间，用于判断是否需要重新登录
    wx.setStorageSync('loginTime', Date.now())

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    })

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      this.setData({ loading: false })
      // 返回上一页或跳转到个人中心
      wx.navigateBack({
        delta: 1,
        fail: () => {
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        }
      })
    }, 1500)
  }
})