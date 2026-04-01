Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 单位转换器'
    }
  },
  data: {
    themeClass: '',
    unitTypes: [
      {
        name: "长度",
        units: [
          {name: "毫米", value: 0.001},
          {name: "厘米", value: 0.01},
          {name: "米", value: 1},
          {name: "千米", value: 1000},
          {name: "英寸", value: 0.0254},
          {name: "英尺", value: 0.3048},
          {name: "英里", value: 1609.344},
          {name: "海里", value: 1852}
        ]
      },
      {
        name: "重量",
        units: [
          {name: "毫克", value: 0.001},
          {name: "克", value: 1},
          {name: "千克", value: 1000},
          {name: "吨", value: 1000000},
          {name: "盎司", value: 28.3495},
          {name: "磅", value: 453.592}
        ]
      },
      {
        name: "温度",
        units: [
          {name: "摄氏度", value: "celsius"},
          {name: "华氏度", value: "fahrenheit"},
          {name: "开尔文", value: "kelvin"}
        ]
      },
      {
        name: "功率",
        units: [
          {name: "瓦特", value: 1},
          {name: "千瓦", value: 1000},
          {name: "兆瓦", value: 1000000},
          {name: "马力", value: 735.49875},
          {name: "英制马力", value: 745.6998715822702},
          {name: "卡/秒", value: 4.1868}
        ]
      },
      {
        name: "压力",
        units: [
          {name: "帕斯卡", value: 1},
          {name: "千帕", value: 1000},
          {name: "兆帕", value: 1000000},
          {name: "巴", value: 100000},
          {name: "标准大气压", value: 101325},
          {name: "毫米汞柱", value: 133.322},
          {name: "磅力/平方英寸", value: 6894.757}
        ]
      },
      {
        name: "体积",
        units: [
          {name: "毫升", value: 0.001},
          {name: "升", value: 1},
          {name: "立方米", value: 1000},
          {name: "加仑(美制)", value: 3.785411784},
          {name: "加仑(英制)", value: 4.54609},
          {name: "品脱", value: 0.473176473},
          {name: "夸脱", value: 0.946352946}
        ]
      },
      {
        name: "面积",
        units: [
          {name: "平方毫米", value: 0.000001},
          {name: "平方厘米", value: 0.0001},
          {name: "平方米", value: 1},
          {name: "公顷", value: 10000},
          {name: "平方公里", value: 1000000},
          {name: "平方英寸", value: 0.00064516},
          {name: "平方英尺", value: 0.09290304},
          {name: "平方英里", value: 2589988.110336}
        ]
      },
      {
        name: "速度",
        units: [
          {name: "米/秒", value: 1},
          {name: "千米/小时", value: 0.2777777777777778},
          {name: "英里/小时", value: 0.44704},
          {name: "节(海里/小时)", value: 0.5144444444444444},
          {name: "英尺/秒", value: 0.3048}
        ]
      },
      {
        name: "时间",
        units: [
          {name: "毫秒", value: 0.001},
          {name: "秒", value: 1},
          {name: "分钟", value: 60},
          {name: "小时", value: 3600},
          {name: "天", value: 86400},
          {name: "周", value: 604800},
          {name: "月", value: 2592000},
          {name: "年", value: 31536000}
        ]
      },
      {
        name: "数据存储",
        units: [
          {name: "位", value: 0.125},
          {name: "字节", value: 1},
          {name: "千字节(KB)", value: 1024},
          {name: "兆字节(MB)", value: 1048576},
          {name: "吉字节(GB)", value: 1073741824},
          {name: "太字节(TB)", value: 1099511627776},
          {name: "拍字节(PB)", value: 1125899906842624}
        ]
      }
    ],
    unitTypeIndex: 0,
    fromUnitIndex: 0,
    toUnitIndex: 1,
    inputValue: "",
    result: "",
    error: null
  },

  onLoad: function() {
    this.loadThemeMode();
    this.updateUnitLists();
  },

  onShow() {
    this.loadThemeMode();
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme);
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

  onUnitTypeChange: function(e) {
    this.setData({
      unitTypeIndex: e.detail.value,
      fromUnitIndex: 0,
      toUnitIndex: 1,
      error: null
    }, this.updateUnitLists);
  },

  onFromUnitChange: function(e) {
    this.setData({
      fromUnitIndex: e.detail.value,
      error: null
    });
  },

  onToUnitChange: function(e) {
    this.setData({
      toUnitIndex: e.detail.value,
      error: null
    });
  },

  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value,
      error: null
    });
  },

  updateUnitLists: function() {
    const currentType = this.data.unitTypes[this.data.unitTypeIndex];
    this.setData({
      fromUnits: currentType.units,
      toUnits: currentType.units
    });
  },

  convert: function() {
    const {inputValue, unitTypeIndex, fromUnitIndex, toUnitIndex, unitTypes} = this.data;
    const currentType = unitTypes[unitTypeIndex];
    const fromUnit = currentType.units[fromUnitIndex];
    const toUnit = currentType.units[toUnitIndex];

    if (!inputValue) {
      this.setData({error: "请输入要转换的数值"});
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      this.setData({error: "请输入有效的数字"});
      return;
    }

    try {
      let result;
      if (currentType.name === "温度") {
        result = this.convertTemperature(value, fromUnit.value, toUnit.value);
      } else {
        // 其他单位转换为米制单位，再转换为目标单位
        const baseValue = value * fromUnit.value;
        result = baseValue / toUnit.value;
      }

      this.setData({
        result: result.toFixed(4).replace(/\.?0+$/, ""),
        error: null
      });
    } catch (e) {
      this.setData({
        error: "转换失败，请检查输入",
        result: ""
      });
    }
  },

  convertTemperature: function(value, from, to) {
    // 先转换为摄氏度
    let celsius;
    if (from === "celsius") {
      celsius = value;
    } else if (from === "fahrenheit") {
      celsius = (value - 32) * 5 / 9;
    } else if (from === "kelvin") {
      celsius = value - 273.15;
    }

    // 从摄氏度转换为目标单位
    if (to === "celsius") {
      return celsius;
    } else if (to === "fahrenheit") {
      return celsius * 9 / 5 + 32;
    } else if (to === "kelvin") {
      return celsius + 273.15;
    }
  },
  
  onShareAppMessage: function() {
    return {
      title: '单位转换工具',
      path: '/pages/unit-converter/unit-converter'
    }
  }
});
