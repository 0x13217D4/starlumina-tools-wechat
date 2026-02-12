Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 扫码工具',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    isScanning: false,
    result: null,
    scanMode: 'camera', // 'camera' 或 'album'
    themeClass: ''
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

  selectFromAlbum() {
    if (this.data.isScanning) return;
    
    this.setData({ isScanning: true });
    
    // 直接调用扫码接口，设置 onlyFromCamera: false 支持从相册选择
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        this.setData({ 
          result: res.result,
          isScanning: false
        });
        wx.showToast({
          title: '识别成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('识别失败:', err);
        wx.showToast({
          title: '识别取消或失败',
          icon: 'none'
        });
        this.setData({ isScanning: false });
      }
    });
  },

  switchScanMode() {
    const newMode = this.data.scanMode === 'camera' ? 'album' : 'camera';
    this.setData({ scanMode: newMode });
  },

  copyResult() {
    if (!this.data.result) return;
    
    // 对要复制的数据进行安全验证
    const sanitizedResult = this.sanitizeUserData(this.data.result);
    
    wx.setClipboardData({
      data: sanitizedResult,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板'
        });
      }
    });
  },
  
  /**
   * 清理用户数据，防止XSS等安全问题
   * @param {string} input - 输入数据
   * @returns {string} 清理后的安全数据
   */
  sanitizeUserData(input) {
    if (typeof input !== 'string') {
      return String(input || '');
    }
    
    // 移除潜在的危险字符序列
    // 防止包含javascript:、data:等协议的链接
    if (/^(javascript:|data:|vbscript:)/i.test(input.trim())) {
      console.warn('检测到潜在的危险协议，已阻止:', input);
      return '安全的文本内容';
    }
    
    // 返回清理后的字符串
    return input.substring(0, 1000); // 限制长度防止滥用
  },
  
  onShareAppMessage: function() {
    return {
      title: '扫码工具',
      path: '/pages/scan/scan',
      imageUrl: '/images/tools.png'
    }
  },

  onShow() {
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    
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
  }
})