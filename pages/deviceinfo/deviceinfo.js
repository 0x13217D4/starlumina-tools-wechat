/**
 * 设备信息页面
 * 展示从微信API获取的完整设备信息
 */
Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 设备信息',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    deviceInfo: {},    // 设备信息数据
    displayInfo: {}    // 显示配置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.initEventChannel();
    this.fetchIPAddress();
  },

  /**
   * 获取IP地址
   */
  fetchIPAddress: function() {
    wx.request({
      url: 'https://test.ustc.edu.cn/backend/getIP.php',
      success: (res) => {
        if (res.data && res.data.processedString) {
          this.setData({
            'basicInfo.ipAddress': res.data.processedString
          });
        }
      },
      fail: (err) => {
        console.error('获取IP地址失败:', err);
        this.setData({
          'basicInfo.ipAddress': '获取失败'
        });
      }
    });
  },

  /**
   * 初始化事件通道，接收设备信息数据
   */
  initEventChannel: function() {
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel && eventChannel.on) {
      eventChannel.on('acceptDeviceInfo', this.handleDeviceInfo.bind(this));
    } else {
      // 直接获取设备信息
      wx.getDeviceInfo({
        success: (res) => {
          this.handleDeviceInfo(res);
        }
      });
    }
  },

  /**
   * 处理接收到的设备信息
   * @param {Object} data 原始设备信息
   */
  handleDeviceInfo: function(data) {
    const displayInfo = this.getDisplayConfig();
    const processedData = this.processDeviceData(data);
    
    // 分类设备信息
    const basicInfo = this.filterData(processedData, [
      'brand', 'model', 'system', 'version', 'platform', 'SDKVersion', 'ipAddress'
    ]);
    
    const screenInfo = this.filterData(processedData, [
      'pixelRatio', 'screenWidth', 'screenHeight', 
      'windowWidth', 'windowHeight', 'statusBarHeight'
    ]);
    
    const systemInfo = this.filterData(processedData, [
      'language', 'fontSizeSetting', 'benchmarkLevel'
    ]);
    const authInfo = this.filterData(processedData, [
      'albumAuthorized', 
      'cameraAuthorized', 
      'locationAuthorized',
      'microphoneAuthorized'
    ]);
    
    const featureInfo = this.filterData(processedData, [
      'locationEnabled', 'bluetoothEnabled', 'networkType'
    ]);
    
    this.setData({
      displayInfo: displayInfo,
      basicInfo: basicInfo,
      screenInfo: screenInfo,
      systemInfo: systemInfo,
      authInfo: authInfo,
      featureInfo: featureInfo
    });
  },
  
  /**
   * 从完整数据中筛选指定字段
   */
  filterData: function(data, keys) {
    const result = {};
    keys.forEach(key => {
      if (data[key] !== undefined) {
        result[key] = data[key];
      }
    });
    return result;
  },

  /**
   * 获取显示配置（字段名映射）
   */
  getDisplayConfig: function() {
    return {
      // 设备基本信息
      'brand': '设备品牌',
      'model': '设备型号',
      'system': '操作系统',
      'version': '微信版本',
      'platform': '运行平台',
      'SDKVersion': '基础库版本',
      'ipAddress': 'IP地址',
      
      // 屏幕信息
      'pixelRatio': '设备像素比',
      'screenWidth': '屏幕宽度(px)',
      'screenHeight': '屏幕高度(px)',
      'windowWidth': '窗口宽度(px)',
      'windowHeight': '窗口高度(px)',
      'statusBarHeight': '状态栏高度',
      
      // 系统设置
      'language': '系统语言',
      'fontSizeSetting': '字体大小设置',
      'benchmarkLevel': '性能等级',
      
      // 权限状态
      'albumAuthorized': '相册权限',
      'cameraAuthorized': '相机权限',
      'locationAuthorized': '位置权限',
      'microphoneAuthorized': '麦克风权限',
      
      // 设备功能
      'locationEnabled': '定位服务状态',
      'bluetoothEnabled': '蓝牙服务状态',
      'networkType': '设备网络状态'
    };
  },

  /**
   * 处理设备数据
   * @param {Object} data 原始设备数据
   */
  processDeviceData: function(data) {
    const processedData = {...data};
    this.processAuthStatus(processedData);
    this.processBenchmarkLevel(processedData);
    this.processFeatureStatus(processedData);
    return processedData;
  },

  /**
   * 处理设备功能状态显示
   */
  processFeatureStatus: function(data) {
    const featureStatus = {
      true: '已开启',
      false: '已关闭',
      undefined: '未知'
    };
    
    // 处理布尔值状态
    ['locationEnabled', 'bluetoothEnabled'].forEach(key => {
      if (key in data) {
        data[key] = featureStatus[data[key]] || data[key];
      }
    });

    // 获取网络类型
    if ('networkType' in data === false) {
      wx.getNetworkType({
        success: (res) => {
          this.setData({
            'featureInfo.networkType': res.networkType
          });
        },
        fail: () => {
          this.setData({
            'featureInfo.networkType': '未知'
          });
        }
      });
    }
  },

  /**
   * 处理性能等级显示
   */
  processBenchmarkLevel: function(data) {
    if ('benchmarkLevel' in data) {
      if (data.benchmarkLevel === -2 || data.benchmarkLevel === 0) {
        data.benchmarkLevel = '无法运行小游戏';
      } else if (data.benchmarkLevel === -1) {
        data.benchmarkLevel = '性能未知';
      } else if (data.benchmarkLevel >= 1) {
        data.benchmarkLevel = `性能等级 ${data.benchmarkLevel}`;
      }
    }
  },

  /**
   * 处理权限状态（转为中文显示）
   * @param {Object} data 设备数据
   */
  processAuthStatus: function(data) {
    const authStatus = {
      true: '已授权',
      false: '未授权',
      undefined: '未请求'
    };
    
    const authKeys = [
      'albumAuthorized', 
      'cameraAuthorized', 
      'locationAuthorized',
      'microphoneAuthorized', 
    ];
    
    authKeys.forEach(key => {
      if (key in data) {
        data[key] = authStatus[data[key]] || data[key];
      }
    });
  },

  /**
   * 点击权限项事件处理
   */
  onAuthItemTap: function(e) {
    const key = e.currentTarget.dataset.key;
    const value = this.data.authInfo[key];
    
    if (value === '未请求') {
      this.requestPermission(key);
    }
  },

  /**
   * 请求权限
   * @param {String} permissionKey 权限键名
   */
  requestPermission: function(permissionKey) {
    const scopeMap = {
      'albumAuthorized': 'scope.writePhotosAlbum',
      'cameraAuthorized': 'scope.camera',
      'locationAuthorized': 'scope.userLocation',
      'microphoneAuthorized': 'scope.record',
    };

    const scope = scopeMap[permissionKey];
    if (!scope) return;

    if (permissionKey === 'notificationAuthorized') {
      wx.showModal({
        title: '通知权限说明',
        content: '小程序通知权限需要在微信设置中手动开启',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }

    wx.authorize({
      scope: scope,
      success: () => {
        this.updateAuthStatus(permissionKey, true);
      },
      fail: () => {
        this.updateAuthStatus(permissionKey, false);
      }
    });
  },

  /**
   * 更新权限状态
   */
  updateAuthStatus: function(key, status) {
    const authStatus = {
      true: '已授权',
      false: '未授权'
    };
    
    const newAuthInfo = {...this.data.authInfo};
    newAuthInfo[key] = authStatus[status];
    
    this.setData({
      authInfo: newAuthInfo
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '设备信息详情',
      path: '/pages/deviceinfo/deviceinfo',
      imageUrl: '/images/tools.png'
    }
  }

})