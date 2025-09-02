Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 二维码工具',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    qrText: '',
    generatedQRCode: null,
    isLoading: false,
    isSaving: false,
    mode: 'text', // 'text' 或 'wifi'
    wifiConfig: {
      ssid: '',
      password: '',
      encryption: 'WPA' // WPA/WEP/none
    }
  },
  
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ 
      mode,
      generatedQRCode: null
    });
  },

  onInputChange(e) {
    this.setData({ qrText: e.detail.value });
  },

  onWifiInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`wifiConfig.${field}`]: e.detail.value
    });
  },

  onEncryptionChange(e) {
    const encryptions = ['WPA', 'WEP', 'none'];
    const newEncryption = encryptions[e.detail.value];
    this.setData({
      'wifiConfig.encryption': newEncryption,
      // 当切换到无加密时清空密码
      'wifiConfig.password': newEncryption === 'none' ? '' : this.data.wifiConfig.password
    });
  },

  handleGenerateQRCode(e) {
    console.log('按钮点击事件:', e); // 调试日志
    wx.vibrateShort({ type: 'light' }); // 触觉反馈
    this.generateQRCode();
  },

  generateQRCode() {
    console.log('生成按钮被点击'); // 调试日志
    
    if (this.data.mode === 'text') {
      const text = this.data.qrText.trim();
      if (!text) {
        wx.showToast({ title: '请输入二维码内容', icon: 'none' });
        return;
      }
      this.generateTextQR(text);
    } else {
      const { ssid, password } = this.data.wifiConfig;
      if (!ssid) {
        wx.showToast({ title: '请输入WIFI名称', icon: 'none' });
        return;
      }
      this.generateWifiQR();
    }
  },

  generateTextQR(text) {
    this.setData({ isLoading: true });
    // 检查是否与上次内容相同
    if (this.data.lastText === text && this.data.generatedQRCode) {
      this.setData({ isLoading: false });
      return;
    }
    
    try {
      const encodedText = encodeURIComponent(text);
      // 优化API参数：降低质量提高速度，移除不必要的margin
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}&qzone=0`;
      this.setData({ 
        generatedQRCode: url,
        lastText: text,
        isLoading: false 
      });
    } catch (error) {
      console.error('生成二维码出错:', error);
      wx.showToast({ title: '生成失败', icon: 'none' });
      this.setData({ isLoading: false });
    }
  },

  generateWifiQR() {
    this.setData({ isLoading: true });
    const { ssid, password, encryption, hidden } = this.data.wifiConfig;
    const wifiConfigStr = JSON.stringify(this.data.wifiConfig);
    
    // 检查是否与上次配置相同
    if (this.data.lastWifiConfig === wifiConfigStr && this.data.generatedQRCode) {
      this.setData({ isLoading: false });
      return;
    }
    
    try {
      let wifiStr = `WIFI:T:${encryption};S:${ssid};`;
      if (password) wifiStr += `P:${password};`;
      wifiStr += ';';
      
      const encodedText = encodeURIComponent(wifiStr);
      // 优化API参数：降低质量提高速度，移除不必要的margin
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}&qzone=0`;
      this.setData({ 
        generatedQRCode: url,
        lastWifiConfig: wifiConfigStr,
        isLoading: false 
      });
    } catch (error) {
      console.error('生成WIFI二维码出错:', error);
      wx.showToast({ title: '生成失败', icon: 'none' });
      this.setData({ isLoading: false });
    }
  },
  
  
  saveQRCode() {
    if (!this.data.generatedQRCode) return;
    if (this.data.isSaving) return; // 防止重复点击
    
    this.setData({ isSaving: true });
    
    // 检查是否有缓存
    if (this.data.cachedFilePath && this.data.cachedQRUrl === this.data.generatedQRCode) {
      this.saveToAlbum(this.data.cachedFilePath);
      return;
    }
    
    // 并行下载和准备保存
    wx.downloadFile({
      url: this.data.generatedQRCode,
      success: (res) => {
        // 缓存文件路径
        this.setData({
          cachedFilePath: res.tempFilePath,
          cachedQRUrl: this.data.generatedQRCode
        });
        this.saveToAlbum(res.tempFilePath);
      },
      fail: () => {
        wx.showToast({ title: '下载失败', icon: 'none' });
        this.setData({ isSaving: false });
      }
    });
  },
  
  saveToAlbum(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        wx.showToast({ title: '保存成功' });
        this.setData({ isSaving: false });
      },
      fail: (err) => {
        console.error('保存失败:', err);
        wx.showToast({ 
          title: err.errMsg.includes('denied') ? '请授权相册访问权限' : '保存失败',
          icon: 'none'
        });
        this.setData({ isSaving: false });
      }
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '二维码生成工具',
      path: '/pages/qrcode/qrcode',
      imageUrl: this.data.generatedQRCode || '/images/tools.png'
    }
  }
})