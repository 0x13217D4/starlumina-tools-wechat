const auth = require('../../utils/auth.js')

Page({
  data: {
    userInfo: null,
    themeMode: 'system', // 'system', 'light', 'dark'
    themeModeText: '深色模式',
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
    // 当主题变化时，更新页面的主题类名
    this.updateThemeClass(theme)
  },

  loadUserInfo() {
    const userInfo = auth.getUserInfo()
    this.setData({ userInfo })
    this.loadThemeMode()
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    this.setData({ themeMode })
    this.updateThemeModeText(themeMode)
    
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

  updateThemeModeText(themeMode) {
    let themeModeText = ''
    switch(themeMode) {
      case 'system':
        themeModeText = '跟随系统'
        break
      case 'light':
        themeModeText = '浅色模式'
        break
      case 'dark':
        themeModeText = '深色模式'
        break
    }
    this.setData({ themeModeText })
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

  toggleTheme() {
    const items = ['跟随系统', '浅色模式', '深色模式']
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const modeIndex = res.tapIndex
        const modes = ['system', 'light', 'dark']
        const newMode = modes[modeIndex]
        
        // 更新存储和显示文本
        wx.setStorageSync('themeMode', newMode)
        this.setData({ themeMode: newMode })
        this.updateThemeModeText(newMode)
        
        // 调用 App 的 switchTheme 方法
        const app = getApp()
        app.switchTheme(newMode)
        
        // 立即更新当前页面的主题类
        if (newMode === 'system') {
          const systemSetting = wx.getSystemSetting()
          this.updateThemeClass(systemSetting.theme || 'light')
        } else {
          this.updateThemeClass(newMode)
          // 立即更新导航栏和 TabBar
          this.updateNavigationBarAndTabBar(newMode)
        }
      }
    })
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            wx.showToast({
              title: '清除成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/mine/mine'
              })
            }, 1500)
          } catch (e) {
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // 关于小程序
  about() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  // 意见反馈
  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请联系开发者',
      showCancel: false
    })
  },
  // 检查更新
  checkUpdate() {
    if (!wx.canIUse('getUpdateManager')) {
      wx.showToast({
        title: '当前版本不支持',
        icon: 'none'
      })
      return
    }

    const updateManager = wx.getUpdateManager()
    
    wx.showLoading({
      title: '检查中...'
    })

    updateManager.onCheckForUpdate(function(res) {
      wx.hideLoading()
      
      if (!res.hasUpdate) {
        wx.showToast({
          title: '已是最新版本',
          icon: 'success'
        })
        return
      }

      wx.showModal({
        title: '发现新版本',
        content: '新版本已经准备好，是否更新？',
        success: function(res) {
          if (!res.confirm) {
            return
          }
          
          updateManager.onUpdateReady(function() {
            updateManager.applyUpdate()
          })
          
          updateManager.onUpdateFailed(function() {
            wx.showToast({
              title: '更新失败',
              icon: 'none'
            })
          })
        }
      })
    })
  },

  // 退出登录
  logout() {
    if (!auth.checkIsLoggedIn()) {
      wx.showToast({
        title: '未登录',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout()
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/mine/mine'
            })
          }, 1500)
        }
      }
    })
  },
  onShareAppMessage: function() {
    return {
      title: '设置',
      path: '/pages/settings/settings'
    }
  },

  onShareTimeline: function() {
    return {
      title: '设置 - 星芒集盒'
    }
  }
})
