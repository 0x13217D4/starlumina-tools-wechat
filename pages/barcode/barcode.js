Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 条形码工具',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    barcodeText: '',
    barcodeType: 'code128',
    barcodeTypes: ['code128', 'ean13', 'code39'],
    generatedBarcode: null,
    isLoading: false,
    isSaving: false,
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
  },
  
  onInputChange(e) {
    this.setData({ barcodeText: e.detail.value });
  },
  
  onTypeChange(e) {
    this.setData({ barcodeType: this.data.barcodeTypes[e.detail.value] });
  },
  
  generateBarcode() {
    const text = this.data.barcodeText.trim();
    if (!text) {
      wx.showToast({ title: '请输入条码内容', icon: 'none' });
      return;
    }
    
    // 验证EAN13格式
    if (this.data.barcodeType === 'ean13' && !/^\d{13}$/.test(text)) {
      wx.showToast({ title: 'EAN13需要13位数字', icon: 'none' });
      return;
    }
    
    // 验证CODE39格式
    if (this.data.barcodeType === 'code39' && !/^[A-Z0-9\-\. \$\/\+\%]+$/i.test(text)) {
      wx.showToast({ title: 'CODE39包含非法字符', icon: 'none' });
      return;
    }
    
    // 添加按钮加载状态
    this.setData({ isLoading: true });
    
    // 模拟API调用延迟
    setTimeout(() => {
      this.generateBarcodeImage();
      this.setData({ isLoading: false });
    }, 800);
  },
  
  generateBarcodeImage() {
    // 尝试多个条码服务，提高可用性
    const barcodeServices = [
      {
        name: 'TEC-IT',
        generate: (text, type) => `https://barcode.tec-it.com/barcode.ashx?data=${text}&code=${type}`
      },
      {
        name: 'Barcode Generator',
        generate: (text, type) => `https://barcodegenerator.org/api/barcode?data=${text}&type=${type}&width=200&height=100`
      },
      {
        name: 'Online Barcode',
        generate: (text, type) => `https://www.online-barcode-generator.com/api?text=${text}&type=${type}`
      }
    ];

    this.tryGenerateBarcode(barcodeServices);
  },
  
  // 尝试生成条码的通用方法
  tryGenerateBarcode(services) {
    let currentServiceIndex = 0;
    
    const tryNextService = () => {
      if (currentServiceIndex >= services.length) {
        wx.showToast({ title: '所有条码服务都不可用', icon: 'none' });
        this.setData({ isLoading: false });
        return;
      }
      
      const service = services[currentServiceIndex];
      try {
        const url = service.generate(this.data.barcodeText, this.data.barcodeType);
        
        // 验证URL是否可访问
        wx.request({
          url: url,
          method: 'HEAD',
          timeout: 5000,
          success: (res) => {
            if (res.statusCode === 200) {
              this.setData({ 
                generatedBarcode: url,
                isLoading: false 
              });
              wx.hideLoading();
            } else {
              currentServiceIndex++;
              tryNextService();
            }
          },
          fail: () => {
            currentServiceIndex++;
            tryNextService();
          }
        });
      } catch (error) {
        console.warn(`条码服务 ${service.name} 失败:`, error);
        currentServiceIndex++;
        tryNextService();
      }
    };
    
    tryNextService();
  },

  saveBarcode() {
    if (!this.data.generatedBarcode) return;
    
    this.setData({ isSaving: true });
    
    wx.downloadFile({
      url: this.data.generatedBarcode,
      timeout: 10000,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({ title: '保存成功' });
            this.setData({ isSaving: false });
          },
          fail: (err) => {
            console.error('保存条码失败:', err);
            wx.showToast({ 
              title: err.errMsg.includes('denied') ? '请授权相册访问权限' : '保存失败',
              icon: 'none'
            });
            this.setData({ isSaving: false });
          }
        });
      },
      fail: (err) => {
        console.error('下载条码失败:', err);
        wx.showToast({ title: '下载失败，请重试', icon: 'none' });
        this.setData({ isSaving: false });
      }
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '条码生成工具',
      path: '/pages/barcode/barcode',
      imageUrl: '/images/tools.png'
    }
  }
})