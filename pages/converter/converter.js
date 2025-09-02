Page({
  data: {
    baseOptions: [
      {label: "2", value: 2},
      {label: "8", value: 8},
      {label: "10", value: 10},
      {label: "16", value: 16}
    ],
    fromBaseIndex: 2, // 默认十进制(索引2对应10)
    toBaseIndex: 2,   // 默认十进制(索引2对应10)
    inputValue: "",
    result: "",
    error: null
  },

  onFromBaseChange: function(e) {
    this.setData({
      fromBaseIndex: e.detail.value,
      error: null
    });
  },

  onToBaseChange: function(e) {
    this.setData({
      toBaseIndex: e.detail.value,
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
    const {baseOptions, fromBaseIndex, toBaseIndex, inputValue} = this.data;
    const fromBase = baseOptions[fromBaseIndex].value;
    const toBase = baseOptions[toBaseIndex].value;
    const basePatterns = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+(\.[0-9]+)?$/,
      16: /^[0-9A-Fa-f]+$/
    };

    if (!inputValue) {
      this.setData({error: "请输入要转换的数值"});
      return;
    }

    // 验证输入是否符合当前进制规则
    if (!basePatterns[fromBase].test(inputValue)) {
      this.setData({
        error: `请输入有效的${baseOptions[fromBaseIndex].label}进制数字`,
        result: ""
      });
      return;
    }

    try {
      // 先转换为十进制
      let decimalValue;
      if (fromBase === 10) {
        decimalValue = parseFloat(inputValue);
      } else {
        decimalValue = parseInt(inputValue, fromBase);
      }

      // 验证转换结果是否有效
      if (isNaN(decimalValue)) {
        throw new Error("无效的输入值");
      }

      // 从十进制转换为目标进制
      let result;
      if (toBase === 10) {
        result = decimalValue.toString();
      } else if (toBase === 16) {
        result = decimalValue.toString(16).toUpperCase();
      } else {
        result = decimalValue.toString(toBase);
      }

      this.setData({
        result: result,
        error: null
      });
    } catch (e) {
      this.setData({
        error: `无法完成${baseOptions[fromBaseIndex].label}进制到${baseOptions[toBaseIndex].label}进制的转换`,
        result: ""
      });
      }
    }
  },
  
  
  onShareAppMessage,function() {
    return {
      title: '进制转换器',
      path: '/pages/deviceinfo/deviceinfo',
      imageUrl: '/images/tools.png'
    }
  },
  
  onShareTimeline,function() {
    return {
      title: '星芒集盒 - 进制转换器',
      imageUrl: '/images/tools.png'
    }
  }
)