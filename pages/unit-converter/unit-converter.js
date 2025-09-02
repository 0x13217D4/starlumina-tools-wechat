Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 单位转换器',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
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
          {name: "英里", value: 1609.344}
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
    this.updateUnitLists();
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
      path: '/pages/unit-converter/unit-converter',
      imageUrl: '/images/logo.jpg'
    }
  }
});