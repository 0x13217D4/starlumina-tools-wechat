const airportCodes = require('../../utils/airport-codes.js').airportCodes;

Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 扫码工具'
    }
  },
  data: {
    isScanning: false,
    result: null,
    scanMode: 'camera', // 'camera' 或 'album'
    themeClass: '',
    wifiInfo: null, // 解析后的WIFI信息
    boardingPassInfo: null, // 解析后的登机牌信息
    resultType: 'text' // 结果类型: 'text', 'wifi', 'boardingPass'
  },
  
  // 解析WIFI二维码
  // WIFI二维码格式: WIFI:S:<SSID>;T:<加密类型>;P:<密码>;H:<是否隐藏>;
  parseWifiQRCode(result) {
    // 检查是否是WIFI二维码格式
    const wifiRegex = /^WIFI:/i;
    if (!wifiRegex.test(result)) {
      return null;
    }
    
    const wifiInfo = {
      ssid: '',
      encryption: '',
      password: '',
      hidden: false
    };
    
    // 解析各个字段
    const fields = result.substring(5).split(';'); // 去掉 "WIFI:" 前缀
    
    fields.forEach(field => {
      if (!field) return;
      
      const colonIndex = field.indexOf(':');
      if (colonIndex === -1) return;
      
      const key = field.substring(0, colonIndex).toUpperCase();
      const value = field.substring(colonIndex + 1);
      
      switch (key) {
        case 'S':
          // SSID可能包含转义字符
          wifiInfo.ssid = this.unescapeWifiValue(value);
          break;
        case 'T':
          wifiInfo.encryption = value.toUpperCase();
          break;
        case 'P':
          wifiInfo.password = this.unescapeWifiValue(value);
          break;
        case 'H':
          wifiInfo.hidden = value === 'true';
          break;
      }
    });
    
    return wifiInfo;
  },
  
  // 反转义WIFI字段值
  unescapeWifiValue(value) {
    if (!value) return '';
    return value
      .replace(/\\;/g, ';')
      .replace(/\\:/g, ':')
      .replace(/\\\\/g, '\\');
  },
  
  // 加密类型转中文
  getEncryptionName(type) {
    const encryptionMap = {
      'WPA': 'WPA/WPA2',
      'WPA2': 'WPA2',
      'WPA3': 'WPA3',
      'WEP': 'WEP',
      'NOPASS': '无密码',
      '': '未知'
    };
    return encryptionMap[type] || type || '未知';
  },
  
  // 解析PDF417登机牌 (IATA BCBP格式)
  // IATA Resolution 792 标准
  parseBoardingPass(result) {
    if (!result || result.length < 45) {
      return null;
    }
    
    // 检查是否是 IATA BCBP 格式 (以 'M' 开头)
    if (result[0] !== 'M') {
      // 尝试解析其他格式（如中国航司的简化格式）
      return this.parseChineseBoardingPass(result);
    }
    
    try {
      const boardingPass = {
        passengerName: '',
        flightNumber: '',
        departureCity: '',
        arrivalCity: '',
        airlineCode: '',
        flightDate: '',
        seatNumber: '',
        classCode: '',
        boardingTime: ''
      };
      
      // === IATA BCBP 固定字段位置解析 ===
      // 参考: IATA Resolution 792
      
      let pos = 0;
      
      // 格式代码 (1位): 'M'
      const formatCode = result[pos];
      pos += 1;
      
      // 版本号 (1位): 通常为 '1'
      const version = result[pos];
      pos += 1;
      
      // 姓名字段 (20位，左对齐，空格填充)
      // 格式: 姓<名< (用 < 分隔姓和名)
      if (pos + 20 <= result.length) {
        const nameField = result.substring(pos, pos + 20);
        boardingPass.passengerName = this.parsePassengerName(nameField);
      }
      pos += 20;
      
      // 电子客票标识 (1位): 'E' 表示电子客票
      const eTicketIndicator = result[pos];
      pos += 1;
      
      // 操作系统的PNR代码 (7位): 预订记录编号
      // pnrCode = result.substring(pos, pos + 7);
      pos += 7;
      
      // 出发城市 (3位): IATA机场代码
      if (pos + 3 <= result.length) {
        boardingPass.departureCity = result.substring(pos, pos + 3);
      }
      pos += 3;
      
      // 到达城市 (3位): IATA机场代码
      if (pos + 3 <= result.length) {
        boardingPass.arrivalCity = result.substring(pos, pos + 3);
      }
      pos += 3;
      
      // 航空公司代码 (3位): IATA航空公司代码
      if (pos + 3 <= result.length) {
        boardingPass.airlineCode = result.substring(pos, pos + 3).trim();
      }
      pos += 3;
      
      // 航班号 (5位): 数字，左对齐
      let flightNum = '';
      if (pos + 5 <= result.length) {
        flightNum = result.substring(pos, pos + 5).trim();
      }
      pos += 5;
      
      if (boardingPass.airlineCode && flightNum) {
        boardingPass.flightNumber = boardingPass.airlineCode + flightNum;
      }
      
      // 航班日期 (3位): Julian日期 (一年中的第几天)
      // 第一位表示年份偏移，后两位表示日期
      if (pos + 3 <= result.length) {
        const dateField = result.substring(pos, pos + 3);
        boardingPass.flightDate = this.parseJulianDate(dateField);
      }
      pos += 3;
      
      // 舱位代码 (1位): F/A=头等舱, J/C/D=商务舱, Y/B/M/H=经济舱等
      if (pos < result.length) {
        boardingPass.classCode = result[pos];
      }
      pos += 1;
      
      // 座位号 (4位): 如 "012A"
      if (pos + 4 <= result.length) {
        const seatField = result.substring(pos, pos + 4);
        boardingPass.seatNumber = this.parseSeatNumber(seatField);
      }
      pos += 4;
      
      // 尝试从后续字段提取更多信息
      // 登机时间可能在条件字段中
      const boardingTime = this.extractBoardingTime(result, pos);
      if (boardingTime) {
        boardingPass.boardingTime = boardingTime;
      }
      
      // 验证是否有有效数据
      if (boardingPass.flightNumber || boardingPass.departureCity) {
        return boardingPass;
      }
      
      return null;
    } catch (e) {
      console.error('解析IATA BCBP登机牌失败:', e);
      return null;
    }
  },
  
  // 解析乘客姓名 (IATA BCBP格式)
  parsePassengerName(nameField) {
    if (!nameField) return '';
    
    // 去除尾部空格
    nameField = nameField.trimRight();
    
    // 姓名格式支持两种分隔符:
    // 1. IATA标准: 姓<名< (用 < 分隔)
    // 2. 中国航司: 姓/名 (用 / 分隔)
    
    let parts;
    if (nameField.includes('<')) {
      // IATA 标准格式
      parts = nameField.split('<');
      if (parts.length === 0) return nameField;
      
      const lastName = parts[0] || '';
      const firstName = parts.slice(1).join('').trim();
      
      if (firstName) {
        return `${lastName}/${firstName}`;
      }
      return lastName;
    } else if (nameField.includes('/')) {
      // 中国航司格式: 姓/名
      parts = nameField.split('/');
      if (parts.length < 2) return nameField;
      
      const lastName = parts[0] || '';
      const firstName = parts.slice(1).join('').trim();
      
      if (firstName) {
        return `${lastName}/${firstName}`;
      }
      return lastName;
    }
    
    // 无分隔符，直接返回
    return nameField;
  },
  
  // 解析Julian日期
  parseJulianDate(dateField) {
    if (!dateField || dateField.length !== 3) return '';
    
    // IATA BCBP 日期格式：3位数字
    // 第一位：年份的最后一位数字
    // 后两位：一年中的第几天 (Julian Day, 001-366)
    const yearDigit = parseInt(dateField[0], 10);
    const dayOfYear = parseInt(dateField.substring(1), 10);
    
    if (isNaN(dayOfYear) || dayOfYear < 1 || dayOfYear > 366) {
      return '';
    }
    
    // 使用当前年份判断平年/闰年
    // 登机牌日期通常是近期航班，用当前年份计算日期即可
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 判断当前年份是否为闰年
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
    
    // 每个月的天数（平年）
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 如果是闰年，2月有29天
    if (isLeapYear) {
      monthDays[1] = 29;
    }
    
    // 计算月份和日期
    let remainingDays = dayOfYear;
    let month = 0;
    
    for (let i = 0; i < 12; i++) {
      if (remainingDays <= monthDays[i]) {
        month = i + 1;
        break;
      }
      remainingDays -= monthDays[i];
    }
    
    const day = remainingDays;
    
    return `${month}月${day}日`;
  },
  
  // 解析座位号
  parseSeatNumber(seatField) {
    if (!seatField || seatField.length < 2) return '';
    
    // 去除前导零，保留行号和字母
    const seat = seatField.trim();
    const match = seat.match(/(\d{1,3})([A-Z])/i);
    
    if (match) {
      return match[1] + match[2].toUpperCase();
    }
    
    return seat;
  },
  
  // 提取登机时间
  extractBoardingTime(result, startPos) {
    // 登机时间通常在条件字段中，格式为 4位时间 (如 "1430")
    // 尝试在后续数据中查找
    if (startPos + 4 > result.length) return '';
    
    // 查找可能的时间格式 (连续4位数字)
    const remaining = result.substring(startPos);
    const timeMatch = remaining.match(/(\d{4})/);
    
    if (timeMatch) {
      const time = timeMatch[1];
      const hour = parseInt(time.substring(0, 2), 10);
      const minute = time.substring(2);
      
      if (hour >= 0 && hour <= 23) {
        return `${hour}:${minute}`;
      }
    }
    
    return '';
  },
  
  // 解析中国航司的简化二维码格式
  parseChineseBoardingPass(result) {
    if (!result) return null;
    
    try {
      const boardingPass = {
        passengerName: '',
        flightNumber: '',
        departureCity: '',
        arrivalCity: '',
        airlineCode: '',
        flightDate: '',
        seatNumber: '',
        classCode: '',
        boardingTime: ''
      };
      
      // 中国航司二维码可能包含的关键词
      const patterns = {
        // 航班号: 2-3个字母 + 3-4个数字
        flight: /([A-Z]{2,3})\s*(\d{3,4})/i,
        // 出发到达城市: 3个字母 到 3个字母
        route: /([A-Z]{3})\s*[-→]\s*([A-Z]{3})/i,
        // 日期: 年月日格式
        date: /(\d{4})[-年](\d{1,2})[-月](\d{1,2})日?/,
        // 座位号: 数字+字母
        seat: /座位[号:：]?\s*(\d{1,3}[A-Z])/i,
        // 乘客姓名
        name: /姓名[：:]?\s*([^\s\n]{2,20})/,
        // 舱位
        class: /舱位[：:]?\s*([A-Z])/i
      };
      
      // 尝试匹配航班号
      const flightMatch = result.match(patterns.flight);
      if (flightMatch) {
        boardingPass.airlineCode = flightMatch[1].toUpperCase();
        boardingPass.flightNumber = boardingPass.airlineCode + flightMatch[2];
      }
      
      // 尝试匹配航线
      const routeMatch = result.match(patterns.route);
      if (routeMatch) {
        boardingPass.departureCity = routeMatch[1].toUpperCase();
        boardingPass.arrivalCity = routeMatch[2].toUpperCase();
      }
      
      // 尝试匹配日期
      const dateMatch = result.match(patterns.date);
      if (dateMatch) {
        const month = parseInt(dateMatch[2], 10);
        const day = parseInt(dateMatch[3], 10);
        boardingPass.flightDate = `${month}月${day}日`;
      }
      
      // 尝试匹配座位
      const seatMatch = result.match(patterns.seat);
      if (seatMatch) {
        boardingPass.seatNumber = seatMatch[1].toUpperCase();
      }
      
      // 尝试匹配姓名
      const nameMatch = result.match(patterns.name);
      if (nameMatch) {
        boardingPass.passengerName = nameMatch[1];
      }
      
      // 尝试匹配舱位
      const classMatch = result.match(patterns.class);
      if (classMatch) {
        boardingPass.classCode = classMatch[1].toUpperCase();
      }
      
      // 如果找到了航班号或航线信息，认为解析成功
      if (boardingPass.flightNumber || boardingPass.departureCity) {
        return boardingPass;
      }
      
      return null;
    } catch (e) {
      console.error('解析中国登机牌格式失败:', e);
      return null;
    }
  },
  
  // 舱位代码转中文
  getClassCodeName(code) {
    const classMap = {
      'F': '头等舱',
      'A': '头等舱',
      'J': '商务舱',
      'C': '商务舱',
      'D': '商务舱',
      'W': '超级经济舱',
      'Y': '经济舱',
      'B': '经济舱',
      'M': '经济舱',
      'H': '经济舱',
      'K': '经济舱',
      'L': '经济舱',
      'Q': '经济舱',
      'T': '经济舱',
      'V': '经济舱',
      'X': '经济舱'
    };
    return classMap[code] || code || '未知';
  },
  
  // 处理扫描结果
  handleScanResult(result) {
    // 先尝试解析 WIFI 二维码
    const wifiInfo = this.parseWifiQRCode(result);
      
    if (wifiInfo && wifiInfo.ssid) {
      // 是 WIFI 二维码
      this.setData({
        result: result,
        resultType: 'wifi',
        wifiInfo: {
          ...wifiInfo,
          encryptionName: this.getEncryptionName(wifiInfo.encryption)
        },
        boardingPassInfo: null,
        isScanning: false
      });
      return;
    }
      
    // 尝试解析登机牌 PDF417
    const boardingPassInfo = this.parseBoardingPass(result);
      
    if (boardingPassInfo) {
      // 是登机牌 - 将机场代码转换为中文名称
      const departureCityName = this.getAirportName(boardingPassInfo.departureCity);
      const arrivalCityName = this.getAirportName(boardingPassInfo.arrivalCity);
        
      this.setData({
        result: result,
        resultType: 'boardingPass',
        boardingPassInfo: {
          ...boardingPassInfo,
          className: this.getClassCodeName(boardingPassInfo.classCode),
          departureCityName: departureCityName,
          arrivalCityName: arrivalCityName
        },
        wifiInfo: null,
        isScanning: false
      });
      return;
    }
      
    // 普通文本
    this.setData({
      result: result,
      resultType: 'text',
      wifiInfo: null,
      boardingPassInfo: null,
      isScanning: false
    });
  },
    
  // 根据机场代码获取中文名称
  getAirportName(code) {
    if (!code) return '';
    const upperCode = code.toUpperCase().trim();
    return airportCodes[upperCode] || code;
  },

  startScan() {
    if (this.data.isScanning) return;
    
    this.setData({ isScanning: true });
    
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode', 'qrCode', 'wxCode', 'datamatrix', 'pdf417'],
      success: (res) => {
        this.handleScanResult(res.result);
      },
      fail: (err) => {
        console.error('扫描失败:', err);
        wx.showToast({
          title: '扫描取消或失败',
          icon: 'none'
        });
        this.setData({ isScanning: false });
      }
    });
  },

  selectFromAlbum() {
    if (this.data.isScanning) return;
    
    this.setData({ isScanning: true });
    
    // 直接调用扫码接口，设置 onlyFromCamera: false 支持从相册选择
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode', 'qrCode', 'wxCode', 'datamatrix', 'pdf417'],
      success: (res) => {
        this.handleScanResult(res.result);
        wx.showToast({
          title: '识别成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('识别失败:', err);
        wx.showToast({
          title: '识别取消或失败',
          icon: 'none'
        });
        this.setData({ isScanning: false });
      }
    });
  },

  switchScanMode() {
    const newMode = this.data.scanMode === 'camera' ? 'album' : 'camera';
    this.setData({ scanMode: newMode });
  },

  copyResult() {
    if (!this.data.result) return;
    
    // 对要复制的数据进行安全验证
    const sanitizedResult = this.sanitizeUserData(this.data.result);
    
    wx.setClipboardData({
      data: sanitizedResult,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板'
        });
      }
    });
  },
  
  // 连接WiFi
  connectWifi() {
    if (!this.data.wifiInfo || !this.data.wifiInfo.ssid) return;
    
    const ssid = this.data.wifiInfo.ssid;
    const password = this.data.wifiInfo.password || '';
    
    // 先初始化WiFi
    wx.startWifi({
      success: () => {
        // 初始化成功后连接WiFi
        wx.connectWifi({
          SSID: ssid,
          password: password,
          success: () => {
            wx.showToast({
              title: 'WiFi连接成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            console.error('WiFi连接失败:', err);
            const errorMsg = this.getWifiErrorMEssage(err.errCode);
            wx.showModal({
              title: '连接失败',
              content: errorMsg,
              showCancel: false
            });
          }
        });
      },
      fail: (err) => {
        console.error('WiFi初始化失败:', err);
        wx.showToast({
          title: 'WiFi初始化失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 获取WiFi错误信息
  getWifiErrorMEssage(errCode) {
    const errorMap = {
      12000: '未初始化WiFi，请重试',
      12001: '当前系统不支持连接WiFi',
      12002: 'WiFi密码错误',
      12003: '连接超时，请重试',
      12004: '重复连接请求',
      12005: '请先打开WiFi开关',
      12006: '请先打开GPS定位开关',
      12007: '用户拒绝授权连接WiFi',
      12008: '无效的WiFi名称',
      12009: '系统配置拒绝连接WiFi',
      12010: '系统错误，请重试',
      12011: '应用在后台无法连接WiFi',
      12013: 'WiFi配置过期，建议忘记WiFi后重试',
      12014: '无效的WEP/WPA密码'
    };
    return errorMap[errCode] || '连接失败，请重试';
  },
  
  /**
   * 清理用户数据，防止XSS等安全问题
   * @param {string} input - 输入数据
   * @returns {string} 清理后的安全数据
   */
  sanitizeUserData(input) {
    if (typeof input !== 'string') {
      return String(input || '');
    }
    
    // 移除潜在的危险字符序列
    // 防止包含javascript:、data:等协议的链接
    if (/^(javascript:|data:|vbscript:)/i.test(input.trim())) {
      console.warn('检测到潜在的危险协议，已阻止:', input);
      return '安全的文本内容';
    }
    
    // 返回清理后的字符串
    return input.substring(0, 1000); // 限制长度防止滥用
  },
  
  onShareAppMessage: function() {
    return {
      title: '扫码工具',
      path: '/pages/scan/scan'
    }
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
  }
})