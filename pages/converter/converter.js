const BaseConverter = {
  // 支持的进制列表
  baseOptions: [
    {label: "2", value: 2},
    {label: "8", value: 8},
    {label: "10", value: 10},
    {label: "16", value: 16}
  ],

  // 各进制的正则验证规则
  basePatterns: {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+(\.[0-9]+)?$/,
    16: /^[0-9A-Fa-f]+$/
  },

  // 验证输入是否符合指定进制
  validateInput: function(input, base) {
    if (!input) return {valid: false, message: "请输入要转换的数值"};
    if (!this.basePatterns[base].test(input)) {
      const baseLabel = this.baseOptions.find(b => b.value === base).label;
      return {valid: false, message: `请输入有效的${baseLabel}进制数字`};
    }
    return {valid: true};
  },

  // 核心转换方法
  convert: function(input, fromBase, toBase) {
    try {
      // 先转换为十进制
      let decimalValue;
      if (fromBase === 10) {
        decimalValue = parseFloat(input);
      } else {
        decimalValue = parseInt(input, fromBase);
      }

      // 验证转换结果是否有效
      if (isNaN(decimalValue)) {
        throw new Error("无效的输入值");
      }

      // 从十进制转换为目标进制
      if (toBase === 10) {
        return decimalValue.toString();
      } else if (toBase === 16) {
        return decimalValue.toString(16).toUpperCase();
      } else {
        return decimalValue.toString(toBase);
      }
    } catch (e) {
      throw new Error("转换过程中发生错误");
    }
  }
};

Page({
  data: {
    baseOptions: BaseConverter.baseOptions,
    fromBaseIndex: 2, // 默认十进制(索引2对应10)
    toBaseIndex: 2,   // 默认十进制(索引2对应10)
    inputValue: "",
    result: "",
    error: null,
    history: []       // 新增历史记录
  },

  onLoad: function() {
    console.log('进制转换器页面加载完成');
    console.log('初始数据:', this.data);
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
    const {baseOptions, fromBaseIndex, toBaseIndex, inputValue, history} = this.data;
    const fromBase = baseOptions[fromBaseIndex].value;
    const toBase = baseOptions[toBaseIndex].value;

    // 验证输入
    const validation = BaseConverter.validateInput(inputValue, fromBase);
    if (!validation.valid) {
      this.setData({error: validation.message, result: ""});
      return;
    }

    try {
      // 执行转换
      const result = BaseConverter.convert(inputValue, fromBase, toBase);
      
      // 更新结果和历史记录
      const newHistory = [
        {
          input: inputValue,
          fromBase: baseOptions[fromBaseIndex].label,
          toBase: baseOptions[toBaseIndex].label,
          result: result,
          time: new Date().toLocaleTimeString()
        },
        ...history.slice(0, 9) // 保留最近10条记录
      ];

      this.setData({
        result: result,
        error: null,
        history: newHistory
      });
    } catch (e) {
      this.setData({
        error: `无法完成${baseOptions[fromBaseIndex].label}进制到${baseOptions[toBaseIndex].label}进制的转换`,
        result: ""
      });
    }
  },
  
  
  onShareAppMessage: function() {
    return {
      title: '进制转换器',
      path: '/pages/converter/converter',
      imageUrl: '/images/tools.png'
    }
  },
  
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 进制转换器',
      imageUrl: '/images/tools.png'
    }
  }
})