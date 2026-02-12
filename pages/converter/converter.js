Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 进制转换器',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    themeClass: '',
    baseOptions: [
      { label: '二', value: 2 },
      { label: '八', value: 8 },
      { label: '十', value: 10 },
      { label: '十六', value: 16 }
    ],
    fromBaseIndex: 2, // 默认十进制
    toBaseIndex: 3,   // 默认十六进制
    inputValue: '',
    result: '',
    error: null,
    history: []
  },

  onLoad: function() {
    this.loadThemeMode();
  },

  onShow() {
    this.loadThemeMode();
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme);
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

  onFromBaseChange: function(e) {
    this.setData({
      fromBaseIndex: parseInt(e.detail.value),
      error: null
    });
  },

  onToBaseChange: function(e) {
    this.setData({
      toBaseIndex: parseInt(e.detail.value),
      error: null
    });
  },

  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value,
      error: null
    });
  },

  convert: function() {
    const { inputValue, fromBaseIndex, toBaseIndex, baseOptions } = this.data;
    const fromBase = baseOptions[fromBaseIndex].value;
    const toBase = baseOptions[toBaseIndex].value;

    if (!inputValue.trim()) {
      this.setData({ error: "请输入要转换的数值" });
      return;
    }

    try {
      // 验证输入是否为有效数字
      const parsedValue = parseInt(inputValue, fromBase);
      if (isNaN(parsedValue)) {
        this.setData({ error: "输入的数值格式不正确" });
        return;
      }

      // 转换为目标进制
      let result;
      if (toBase === 16) {
        result = parsedValue.toString(toBase).toUpperCase();
      } else {
        result = parsedValue.toString(toBase);
      }

      this.setData({
        result: result,
        error: null
      });

      // 添加到历史记录
      const historyItem = {
        input: inputValue,
        fromBase: baseOptions[fromBaseIndex].label,
        result: result,
        toBase: baseOptions[toBaseIndex].label,
        time: new Date().toLocaleTimeString()
      };

      const newHistory = [historyItem, ...this.data.history.slice(0, 9)]; // 保留最近10条记录
      this.setData({ history: newHistory });

    } catch (e) {
      this.setData({
        error: "转换失败，请检查输入",
        result: ""
      });
    }
  },

  clearHistory: function() {
    this.setData({ history: [] });
  },
  
  onShareAppMessage: function() {
    return {
      title: '单位转换工具',
      path: '/pages/unit-converter/unit-converter',
      imageUrl: '/images/logo.jpg'
    }
  }
});
