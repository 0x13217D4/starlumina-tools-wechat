// app.js
App({
  globalData: {
    userInfo: null,
    theme: 'light',
    themeMode: 'system', // 'system', 'light', 'dark'
  },

  onLaunch() {
    try {
      // 初始化深色模式
      this.initThemeMode()

      // 展示本地存储能力
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        },
        fail: err => {
          console.error('登录失败:', err)
        }
      })
      // 检查更新
      this.checkForUpdate()
    } catch (error) {
      console.error('应用启动错误:', error)
    }
  },
  
  // 监听页面切换
  onPageNotFound(options) {
    console.log('页面未找到:', options)
  },

  // 重置到系统主题（只在切换到跟随系统模式时调用）
  resetToSystemTheme() {
    // 清除 TabBar 手动设置，恢复跟随系统
    if (wx.setTabBarStyle && typeof wx.setTabBarStyle === 'function') {  
      wx.setTabBarStyle({
        color: '',
        selectedColor: '',
        backgroundColor: '',
        borderStyle: ''
      })
    }
    
    // 清除导航栏手动设置，恢复跟随系统
    if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
      wx.setNavigationBarColor({
        frontColor: '',
        backgroundColor: ''
      })
    }
    
    // 清除页面手动设置
    if (wx.setPageStyle && typeof wx.setPageStyle === 'function') {
      wx.setPageStyle({
        style: {}
      })
    }
  },

  // 初始化深色模式
  initThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    this.globalData.themeMode = themeMode
    
    if (themeMode === 'system') {
      // 跟随系统 - 完全依赖 theme.json，不清除设置
      const systemSetting = wx.getSystemSetting()
      this.applySystemTheme(systemSetting.theme || 'light')
      
      // 监听系统主题变化
      this.setupSystemThemeListener()
    } else {
      // 强制使用指定模式 - 手动设置所有样式
      this.applyManualTheme(themeMode)
    }
  },

  // 设置系统主题监听器
  setupSystemThemeListener() {
    // 移除之前的监听器（如果有的话）
    if (this.themeChangeListener) {
      wx.offThemeChange(this.themeChangeListener)
    }
    
    // 创建新的监听器
    this.themeChangeListener = (res) => {
      console.log('系统主题实时变化:', res.theme)
      this.applySystemTheme(res.theme)
    }
    
    // 注册监听器
    if (wx.onThemeChange && typeof wx.onThemeChange === 'function') {
      wx.onThemeChange(this.themeChangeListener)
      console.log('系统主题监听器已注册')
    } else {
      console.warn('当前环境不支持系统主题监听')
    }
  },
  
  // 应用系统主题
  applySystemTheme(systemTheme) {
    const theme = systemTheme || 'light'
    this.globalData.theme = theme
    
    console.log('应用系统主题:', theme)
    
    // 更新导航栏和TabBar样式以匹配系统主题
    this.updateSystemUIStyles(theme)
    
    // 使用微信 API 设置页面背景色
    if (wx.setPageStyle && typeof wx.setPageStyle === 'function') {
      wx.setPageStyle({
        style: {
          background: theme === 'dark' ? '#1f1f1f' : '#f5f5f5'
        }
      })
    }
    
    // 系统模式：不清除设置，让 theme.json 自动管理
    // 不调用 resetToSystemTheme()，避免清除有效的手动设置
    
    this.notifyAllPagesThemeChanged(theme)
  },

  // 应用手动主题
  applyManualTheme(themeMode) {
    const theme = themeMode === 'dark' ? 'dark' : 'light'
    this.globalData.theme = theme
    
    console.log('应用手动主题:', theme)
    
    // 手动模式：设置所有样式
    if (wx.setPageStyle && typeof wx.setPageStyle === 'function') {
      wx.setPageStyle({
        style: {
          background: theme === 'dark' ? '#1f1f1f' : '#f5f5f5'
        }
      })
    }
    
    if (wx.setTabBarStyle && typeof wx.setTabBarStyle === 'function') {
      wx.setTabBarStyle({
        color: theme === 'dark' ? '#999999' : '#666666',
        selectedColor: theme === 'dark' ? '#09e765' : '#07C160',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderStyle: theme === 'dark' ? 'white' : 'black'
      })
    }
    
    if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
      wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
      })
    }
    
    this.notifyAllPagesThemeChanged(theme)
  },

  // 通知所有页面主题已变化
  notifyAllPagesThemeChanged(theme) {
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.onThemeChanged) {
        page.onThemeChanged(theme)
      }
    })
  },

  // 切换主题（供页面调用）
  switchTheme(themeMode) {
    wx.setStorageSync('themeMode', themeMode)
    this.globalData.themeMode = themeMode
    
    if (themeMode === 'system') {
      // 跟随系统：先清除手动设置，让 theme.json 自动管理
      this.resetToSystemTheme()
      
      // 然后应用系统主题
      const systemSetting = wx.getSystemSetting()
      this.applySystemTheme(systemSetting.theme || 'light')
      
      // 重新设置系统主题监听器
      this.setupSystemThemeListener()
    } else {
      // 手动模式：强制设置所有样式
      this.applyManualTheme(themeMode)
      
      // 移除系统主题监听器
      if (this.themeChangeListener) {
        wx.offThemeChange(this.themeChangeListener)
        this.themeChangeListener = null
        console.log('系统主题监听器已移除')
      }
    }
  },

  // 获取当前主题模式
  getThemeMode() {
    return this.globalData.themeMode
  },

  // 获取当前主题
  getTheme() {
    return this.globalData.theme
  },
  
  // 更新系统UI样式（导航栏和TabBar）
  updateSystemUIStyles(theme) {
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

  checkForUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(() => {
            wx.showModal({
              title: '更新失败',
              content: '新版本下载失败，请检查网络后重试',
              showCancel: false
            })
          })
        }
      })
    }
  }
})
