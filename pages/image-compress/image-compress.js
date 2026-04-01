// utils/imageCompressor.js (或直接在页面JS文件中)

/**
 * 计算最优质量
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度
 * @param {number} baseQuality - 基础质量
 * @returns {number} - 计算后的最优质量 (0-100)
 */
function calculateOptimalQuality(width, height, baseQuality = 80) {
  const complexity = (width * height) / 1000000; // 百万像素为单位
  let quality = baseQuality;

  if (complexity > 5) {
    quality = Math.max(50, baseQuality - 20); // 降低质量上限
  } else if (complexity > 2) {
    quality = Math.max(60, baseQuality - 15);
  } else if (complexity > 0.5) {
    quality = Math.max(70, baseQuality - 10);
  } else {
    // 小图片使用更低的压缩质量
    quality = Math.min(60, baseQuality);
  }

  return Math.min(85, quality); // 降低最大质量到85%
}

/**
 * 选择最佳文件格式
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度
 * @param {string} userFormat - 用户选择的格式 ('jpg', 'png', 'webp', 'auto')
 * @returns {string} - 最终使用的格式 ('jpg', 'png', 'webp')
 */
function selectBestFormat(width, height, userFormat) {
    if (userFormat === 'auto') {
        // 简单规则：大图用jpg，小图或可能透明用png
        // 注意：webp支持需要微信版本和平台支持检查
        return (width * height > 1000000) ? 'jpg' : 'png'; 
    }
    return userFormat;
}

/**
 * 智能调整图片尺寸
 * @param {number} width - 原始宽度
 * @param {number} height - 原始高度
 * @param {number} maxSize - 最大尺寸限制
 * @returns {Object} - 包含新宽高的对象
 */
function calculateOptimalSize(width, height, maxSize = 1920) {
  let targetWidth = width;
  let targetHeight = height;
  
  // 如果任一维度超过最大尺寸，按比例缩放
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    targetWidth = Math.round(width * ratio);
    targetHeight = Math.round(height * ratio);
  }
  
  return { width: targetWidth, height: targetHeight };
}


// pages/compress/compress.js (或你的页面JS文件)
Page({
  data: {
    originalSize: '0 KB',
    compressedSize: '0 KB',
    dimensions: '0 × 0',
    saving: '0%',
    quality: 80,
    showResize: false,
    imagePath: '',
    compressedPath: '',
    format: 'auto', // 默认设为auto
    isCompressing: false,
    progress: 0,
    originalFileSize: 0, // 保存原始文件大小(字节)
    originalFormat: '', // 保存原始图片格式
    themeClass: ''
  },

  onLoad: function(options) {
    this.loadThemeMode();
    // 页面创建时执行
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
    
    this.updateThemeClass(actualTheme)
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

  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 原图
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        if (!tempFilePath || typeof tempFilePath !== 'string') {
          wx.showToast({ title: '图片路径无效', icon: 'none' });
          return;
        }
        
        const fs = wx.getFileSystemManager();
        // 并行获取文件大小和图片信息
        Promise.all([
            new Promise((resolve, reject) => {
                fs.getFileInfo({
                    filePath: tempFilePath,
                    success: resolve,
                    fail: reject
                });
            }),
            new Promise((resolve, reject) => {
                wx.getImageInfo({
                    src: tempFilePath,
                    success: resolve,
                    fail: reject
                });
            })
        ]).then(([fileInfo, imgInfo]) => {
             that.setData({
                imagePath: tempFilePath,
                originalSize: (fileInfo.size / 1024).toFixed(2) + ' KB',
                originalFileSize: fileInfo.size, // 保存原始文件大小
                originalFormat: imgInfo.type || '', // 保存原始格式
                dimensions: `${imgInfo.width} × ${imgInfo.height}`,
                compressedPath: '',
                compressedSize: '0 KB',
                saving: '0%'
            });
        }).catch(err => {
            console.error('获取图片信息失败:', err);
            wx.showToast({ title: '图片加载失败', icon: 'none' });
        });
      },
      fail(err) {
        console.error('选择图片失败:', err);
        wx.showToast({ title: '选择图片失败', icon: 'none' });
      }
    });
  },

  compressImage: function() {
    const that = this;
    if (!this.data.imagePath) {
      wx.showToast({ title: '请先选择图片', icon: 'none' });
      return;
    }

    if (this.data.isCompressing) {
      return; // 防止重复点击
    }

    this.setData({ isCompressing: true, progress: 0 });
    wx.showLoading({ title: '压缩中...', mask: true });

    const { showResize, format: userFormat, quality: userQuality } = this.data;
    const imagePath = this.data.imagePath;
    const originalSize = this.data.originalFileSize; // 获取原始文件大小
    
    // 清理旧压缩文件
    if (this.data.compressedPath) {
        wx.getFileSystemManager().unlink({
            filePath: this.data.compressedPath,
            success: () => console.log('旧压缩文件已清理'),
            fail: (err) => console.log('清理旧文件失败(可能不存在):', err)
        });
    }

    // 获取图片信息并执行压缩
    wx.getImageInfo({
      src: imagePath,
      success(imgInfo) {
        let targetWidth = imgInfo.width;
        let targetHeight = imgInfo.height;

        // 智能尺寸调整
        if (showResize) {
          const newSize = calculateOptimalSize(targetWidth, targetHeight, 1920);
          targetWidth = newSize.width;
          targetHeight = newSize.height;
        }

        // 计算最优质量
        const optimalQuality = calculateOptimalQuality(targetWidth, targetHeight, userQuality);
        that.setData({ quality: optimalQuality });

        // 尝试多种压缩策略以获得最佳效果
        that.tryMultipleCompressionStrategies(imagePath, optimalQuality, originalSize, targetWidth, targetHeight);
      },
      fail(err) {
        console.error('获取图片信息失败:', err);
        that.handleCompressError('图片信息获取失败');
      }
    });
  },

  // 尝试多种压缩策略
  tryMultipleCompressionStrategies: function(imagePath, baseQuality, originalSize, targetWidth, targetHeight) {
    const that = this;
    const strategies = [
      { quality: baseQuality, label: '标准压缩' },
      { quality: Math.max(30, baseQuality - 20), label: '高质量压缩' },
      { quality: Math.max(20, baseQuality - 40), label: '高压缩比' }
    ];

    let currentStrategy = 0;
    
    function tryNextStrategy() {
      if (currentStrategy >= strategies.length) {
        // 所有策略都失败，使用原图
        that.setData({
          compressedPath: imagePath,
          compressedSize: (originalSize / 1024).toFixed(2) + ' KB',
          saving: '0%',
          progress: 100,
          isCompressing: false
        });
        wx.hideLoading();
        wx.showToast({ title: '无法进一步压缩，使用原图', icon: 'none' });
        return;
      }

      const strategy = strategies[currentStrategy];
      console.log(`尝试策略: ${strategy.label}, 质量: ${strategy.quality}`);
      
      wx.compressImage({
        src: imagePath,
        quality: strategy.quality,
        success(res) {
          const fs = wx.getFileSystemManager();
          fs.getFileInfo({
            filePath: res.tempFilePath,
            success(info) {
              // 如果压缩效果良好，使用这个结果
              if (info.size < originalSize * 0.95) { // 至少压缩5%
                const compressedSizeKB = (info.size / 1024);
                const savingPercentage = ((originalSize - info.size) / originalSize * 100).toFixed(1);
                
                that.setData({
                  compressedPath: res.tempFilePath,
                  compressedSize: compressedSizeKB.toFixed(2) + ' KB',
                  saving: savingPercentage + '%',
                  progress: 100,
                  isCompressing: false
                });
                
                wx.hideLoading();
                wx.showToast({ title: '压缩成功', icon: 'success' });
              } else {
                // 压缩效果不佳，尝试下一个策略
                console.log(`策略 ${strategy.label} 压缩效果不佳，尝试下一个`);
                currentStrategy++;
                tryNextStrategy();
              }
            },
            fail(err) {
              console.error(`策略 ${strategy.label} 获取文件信息失败:`, err);
              currentStrategy++;
              tryNextStrategy();
            }
          });
        },
        fail(err) {
          console.error(`策略 ${strategy.label} 压缩失败:`, err);
          currentStrategy++;
          tryNextStrategy();
        }
      });
    }
    
    tryNextStrategy();
  },

  setFormat: function(e) {
    this.setData({ format: e.detail.value });
  },

  // 统一错误处理方法
  handleCompressError: function(message) {
    this.setData({ isCompressing: false });
    wx.hideLoading();
    wx.showToast({ 
      title: message, 
      icon: 'none',
      duration: 3000
    });
  },

  cancelCompress: function() {
    if (this.data.isCompressing) {
      this.handleCompressError('已取消压缩');
    }
  },

  downloadImage: function() {
    if (!this.data.compressedPath) {
      wx.showToast({ title: '请先压缩图片', icon: 'none' });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.compressedPath,
      success() {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail(err) {
        console.error('保存图片失败:', err);
        // 用户拒绝授权也会走fail
        if (err.errMsg && err.errMsg.includes('auth')) {
            wx.showToast({ title: '请授权相册权限', icon: 'none' });
        } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
    });
  },

  setQuality: function(e) {
    this.setData({ quality: parseInt(e.detail.value, 10) }); // 确保是数字
  },

  toggleResize: function(e) {
    // 注意：switch组件的值是 e.detail.value (true/false)
    // checkbox-group的值是 e.detail.value (数组)
    // 根据你的wxml调整，这里假设是switch
    this.setData({ showResize: e.detail.value });
  }
});



