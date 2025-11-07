const defaultAreaCodes = require('../../utils/area-codes.js');

// 加载地区编码数据
function loadFullAreaCodes() {
  return {
    ...defaultAreaCodes,
    getFullArea: this.getFullAreaInfo
  };
}

Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 身份证验证',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    loading: true,
    areaCodes: defaultAreaCodes,
    error: null
  },

  onLoad() {
    this.loadAreaCodes();
  },

  loadAreaCodes() {
    this.setData({
      loading: false,
      areaCodes: loadFullAreaCodes.call(this)
    });
  },

  getFullAreaInfo(code) {
    if (!code || code.length < 2) return '未知地区';
    
    const provinceCode = code.substring(0, 2) + '0000';
    const cityCode = code.substring(0, 4) + '00';
    
    const province = this.data.areaCodes[provinceCode.substring(0, 2)] || '';
    const city = this.data.areaCodes[cityCode] || '';
    const district = this.data.areaCodes[code] || '';
    
    if (province === city) {
      return `${province} ${district}`;
    }
    return `${province} ${city} ${district}`.trim();
  },

  validateIDs() {
    const inputValue = this.data.inputValue;
    if (!inputValue || inputValue.trim().length === 0) {
      wx.showToast({ title: '请输入身份证号', icon: 'none' });
      return;
    }

    // 分割多行输入，过滤空行
    const inputIds = inputValue.trim().split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);
    
    const results = inputIds.map(id => this.validateID(id));
    this.setData({ 
      inputIds,
      results 
    });
    
    // 显示验证结果统计
    const validCount = results.filter(r => r.isValid).length;
    const totalCount = results.length;
    if (validCount === totalCount) {
      wx.showToast({ title: `全部${totalCount}个身份证验证通过`, icon: 'success' });
    } else {
      wx.showToast({ 
        title: `${validCount}/${totalCount}个验证通过`, 
        icon: 'none',
        duration: 2000
      });
    }
  },

  validateID(id) {
    const result = {
      id,
      area: null,
      birthday: null,
      gender: null,
      isValid: false,
      message: ''
    };
    
    // 提取行政区划代码
    const areaCode = id.substring(0, 6);
    result.area = this.getFullAreaInfo(areaCode);
    
    // 验证长度
    if (id.length !== 15 && id.length !== 18) {
      result.message = '身份证号码长度应为15位或18位';
      return result;
    }
    
    // 如果是18位身份证
    if (id.length === 18) {
      // 验证出生日期
      const year = id.substring(6, 10);
      const month = id.substring(10, 12);
      const day = id.substring(12, 14);
      
      if (!this.isValidDate(year, month, day)) {
        result.message = '出生日期无效';
        return result;
      }
      
      result.birthday = `${year}-${month}-${day}`;
      
      // 验证校验码
      if (!this.validateCheckCode(id)) {
        result.message = '校验码错误';
        return result;
      }
      
      // 提取性别
      const genderCode = parseInt(id.substring(16, 17));
      result.gender = genderCode % 2 === 1 ? '男' : '女';
      result.isValid = true;
    }
    // 如果是15位身份证
    else if (id.length === 15) {
      // 提取出生日期（15位身份证年份是2位，需要补全）
      const year = '19' + id.substring(6, 8);
      const month = id.substring(8, 10);
      const day = id.substring(10, 12);
      
      if (!this.isValidDate(year, month, day)) {
        result.message = '出生日期无效';
        return result;
      }
      
      result.birthday = `${year}-${month}-${day}`;
      
      // 提取性别
      const genderCode = parseInt(id.substring(14, 15));
      result.gender = genderCode % 2 === 1 ? '男' : '女';
      result.isValid = true;
    }
    
    return result;
  },

  onInput(e) {
    const value = e.detail.value;
    this.setData({ 
      inputValue: value 
    });
  },

  onConfirm() {
    const value = this.data.inputValue.trim();
    if (!value) {
      wx.showToast({ title: '请输入身份证号', icon: 'none' });
      return;
    }
    this.setData({
      inputValue: value
    }, () => {
      this.validateIDs();
    });
  },

  isValidDate(year, month, day) {
    const date = new Date(`${year}-${month}-${day}`);
    return date && date.getMonth() + 1 === parseInt(month) && date.getDate() === parseInt(day);
  },

  validateCheckCode(id) {
    // 18位身份证校验码验证算法
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(id.charAt(i)) * weights[i];
    }
    
    const mod = sum % 11;
    return id.charAt(17).toUpperCase() === checkCodes[mod];
  },

  clearResults() {
    this.setData({ 
      inputIds: [],
      results: [] 
    });
  },

  maskID(id) {
    if (id.length <= 8) return id;
    return id.substring(0, 6) + '****' + id.substring(id.length - 4);
  },
  
  onShareAppMessage: function() {
    return {
      title: '身份证验证工具',
      path: '/pages/id-verify/id-verify',
      imageUrl: '/images/tools.png'
    }
  }
});