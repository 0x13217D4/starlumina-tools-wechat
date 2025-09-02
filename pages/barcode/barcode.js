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
    isSaving: false
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
    // 模拟生成条码图片URL
    const mockBarcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${this.data.barcodeText}&code=${this.data.barcodeType}`;
    this.setData({ generatedBarcode: mockBarcodeUrl });
    wx.hideLoading();
  },
  
  saveBarcode() {
    if (!this.data.generatedBarcode) return;
    
    this.setData({ isSaving: true });
    
    wx.downloadFile({
      url: this.data.generatedBarcode,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({ title: '保存成功' });
            this.setData({ isSaving: false });
          },
          fail: () => {
            wx.showToast({ title: '保存失败', icon: 'none' });
            this.setData({ isSaving: false });
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '下载失败', icon: 'none' });
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