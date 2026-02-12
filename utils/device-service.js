/**
 * 设备信息服务模块
 * 封装设备信息获取相关逻辑
 */

class DeviceService {
  static _cache = {
    benchmarkInfo: null,
    gpuInfo: null,
    deviceInfo: null,
    lastUpdate: 0
  };

  /**
   * 获取设备基准信息（带缓存）
   * @returns {Promise<Object>} 设备基准信息对象
   */
  static async getDeviceBenchmarkInfo() {
    // 检查缓存（5分钟有效）
    if (this._cache.benchmarkInfo && (Date.now() - this._cache.lastUpdate) < 300000) {
      return this._cache.benchmarkInfo;
    }

    return new Promise((resolve) => {
      // 检查API是否可用
      if (wx.getDeviceBenchmarkInfo) {
        wx.getDeviceBenchmarkInfo({
          success: (res) => {
            const benchmarkInfo = {
              benchmarkLevel: res.benchmarkLevel || -1,
              modelLevel: res.modelLevel || 0,
              cpuLevel: res.cpuLevel || 0,
              gpuLevel: res.gpuLevel || 0,
              memoryLevel: res.memoryLevel || 0,
              storageLevel: res.storageLevel || 0,
              performanceScore: this._calculatePerformanceScore(res),
              deviceCategory: this._getDeviceCategory(res.benchmarkLevel || -1)
            };
            
            // 更新缓存
            this._cache.benchmarkInfo = benchmarkInfo;
            this._cache.lastUpdate = Date.now();
            
            resolve(benchmarkInfo);
          },
          fail: () => {
            const fallbackInfo = {
              benchmarkLevel: -1,
              modelLevel: 0,
              cpuLevel: 0,
              gpuLevel: 0,
              memoryLevel: 0,
              storageLevel: 0,
              performanceScore: 0,
              deviceCategory: 'unknown'
            };
            
            this._cache.benchmarkInfo = fallbackInfo;
            this._cache.lastUpdate = Date.now();
            
            resolve(fallbackInfo);
          }
        });
      } else {
        // 低版本兼容处理
        const fallbackInfo = {
          benchmarkLevel: -1,
          modelLevel: 0,
          cpuLevel: 0,
          gpuLevel: 0,
          memoryLevel: 0,
          storageLevel: 0,
          performanceScore: 0,
          deviceCategory: 'unknown'
        };
        
        this._cache.benchmarkInfo = fallbackInfo;
        this._cache.lastUpdate = Date.now();
        
        resolve(fallbackInfo);
      }
    });
  }

  /**
   * 获取详细GPU信息
   * @returns {Promise<Object>} GPU信息对象
   */
  static async getDetailedGPUInfo() {
    // 检查缓存
    if (this._cache.gpuInfo && (Date.now() - this._cache.lastUpdate) < 300000) {
      return this._cache.gpuInfo;
    }

    try {
      const benchmarkInfo = await this.getDeviceBenchmarkInfo();
      const systemInfo = await this._getSystemInfo();
      
      const gpuInfo = {
        gpuLevel: benchmarkInfo.gpuLevel || 0,
        benchmarkLevel: benchmarkInfo.benchmarkLevel || -1,
        renderer: this._detectGPURenderer(systemInfo),
        maxTextureSize: this._estimateMaxTextureSize(benchmarkInfo.gpuLevel),
        shaderLevel: this._estimateShaderLevel(benchmarkInfo.gpuLevel),
        memoryBandwidth: this._estimateMemoryBandwidth(benchmarkInfo.gpuLevel),
        fillRate: this._estimateFillRate(benchmarkInfo.gpuLevel),
        supportedFeatures: this._getSupportedFeatures(benchmarkInfo.gpuLevel),
        performanceTier: this._getGPUTier(benchmarkInfo.gpuLevel)
      };
      
      this._cache.gpuInfo = gpuInfo;
      return gpuInfo;
      
    } catch (error) {
      console.warn('获取GPU信息失败:', error);
      const fallbackGPUInfo = {
        gpuLevel: 0,
        benchmarkLevel: -1,
        renderer: 'unknown',
        maxTextureSize: 1024,
        shaderLevel: 1,
        memoryBandwidth: 1000,
        fillRate: 100,
        supportedFeatures: ['basic'],
        performanceTier: 'basic'
      };
      
      this._cache.gpuInfo = fallbackGPUInfo;
      return fallbackGPUInfo;
    }
  }

  /**
   * 获取设备性能等级预判
   * @returns {Promise<Object>} 性能等级信息
   */
  static async getPerformanceClassification() {
    try {
      const benchmarkInfo = await this.getDeviceBenchmarkInfo();
      const systemInfo = await this._getSystemInfo();
      
      const classification = {
        overall: this._classifyOverall(benchmarkInfo),
        cpu: this._classifyCPU(benchmarkInfo),
        gpu: this._classifyGPU(benchmarkInfo),
        memory: this._classifyMemory(benchmarkInfo, systemInfo),
        storage: this._classifyStorage(benchmarkInfo),
        gamingCapability: this._assessGamingCapability(benchmarkInfo),
        multitaskingCapability: this._assessMultitaskingCapability(benchmarkInfo),
        recommendations: this._generateRecommendations(benchmarkInfo, systemInfo)
      };
      
      return classification;
    } catch (error) {
      console.warn('获取性能等级预判失败:', error);
      return {
        overall: 'unknown',
        cpu: 'unknown',
        gpu: 'unknown',
        memory: 'unknown',
        storage: 'unknown',
        gamingCapability: 'unknown',
        multitaskingCapability: 'unknown',
        recommendations: []
      };
    }
  }

  /**
   * 清除缓存
   */
  static clearCache() {
    this._cache = {
      benchmarkInfo: null,
      gpuInfo: null,
      deviceInfo: null,
      lastUpdate: 0
    };
  }

  /**
   * 计算性能分数
   * @private
   */
  static _calculatePerformanceScore(benchmarkData) {
    const weights = {
      benchmarkLevel: 0.3,
      cpuLevel: 0.2,
      gpuLevel: 0.25,
      memoryLevel: 0.15,
      storageLevel: 0.1
    };
    
    let score = 0;
    if (benchmarkData.benchmarkLevel !== undefined && benchmarkData.benchmarkLevel > 0) {
      score += (benchmarkData.benchmarkLevel / 40) * weights.benchmarkLevel * 100;
    }
    if (benchmarkData.cpuLevel !== undefined) {
      score += (benchmarkData.cpuLevel / 10) * weights.cpuLevel * 100;
    }
    if (benchmarkData.gpuLevel !== undefined) {
      score += (benchmarkData.gpuLevel / 10) * weights.gpuLevel * 100;
    }
    if (benchmarkData.memoryLevel !== undefined) {
      score += (benchmarkData.memoryLevel / 10) * weights.memoryLevel * 100;
    }
    if (benchmarkData.storageLevel !== undefined) {
      score += (benchmarkData.storageLevel / 10) * weights.storageLevel * 100;
    }
    
    return Math.round(Math.min(100, score));
  }

  /**
   * 获取设备分类
   * @private
   */
  static _getDeviceCategory(benchmarkLevel) {
    if (benchmarkLevel >= 30) return 'flagship';
    if (benchmarkLevel >= 20) return 'high_end';
    if (benchmarkLevel >= 10) return 'mid_range';
    if (benchmarkLevel >= 0) return 'entry_level';
    return 'low_end';
  }

  /**
   * 检测GPU渲染器
   * @private
   */
  static _detectGPURenderer(systemInfo) {
    const platform = systemInfo.platform || 'unknown';
    const brand = systemInfo.brand || '';
    const model = systemInfo.model || '';
    
    // 基于品牌和型号推测GPU类型
    if (brand.toLowerCase().includes('apple') || platform === 'ios') {
      if (model.includes('Pro') || model.includes('Max')) return 'apple_gpu_pro';
      if (model.includes('Plus')) return 'apple_gpu_plus';
      return 'apple_gpu_standard';
    }
    
    if (brand.toLowerCase().includes('huawei')) return 'kirin_gpu';
    if (brand.toLowerCase().includes('xiaomi') || brand.toLowerCase().includes('redmi')) return 'adreno_gpu';
    if (brand.toLowerCase().includes('samsung')) return 'mali_gpu';
    
    return 'unknown_gpu';
  }

  /**
   * 估算最大纹理尺寸
   * @private
   */
  static _estimateMaxTextureSize(gpuLevel) {
    if (gpuLevel >= 8) return 4096;
    if (gpuLevel >= 6) return 2048;
    if (gpuLevel >= 4) return 1024;
    return 512;
  }

  /**
   * 估算着色器级别
   * @private
   */
  static _estimateShaderLevel(gpuLevel) {
    if (gpuLevel >= 8) return 3;
    if (gpuLevel >= 6) return 2;
    if (gpuLevel >= 4) return 1.5;
    return 1;
  }

  /**
   * 估算内存带宽
   * @private
   */
  static _estimateMemoryBandwidth(gpuLevel) {
    return Math.max(1000, gpuLevel * 2000);
  }

  /**
   * 估算填充率
   * @private
   */
  static _estimateFillRate(gpuLevel) {
    return Math.max(100, gpuLevel * 500);
  }

  /**
   * 获取支持的特性
   * @private
   */
  static _getSupportedFeatures(gpuLevel) {
    const features = ['basic'];
    
    if (gpuLevel >= 4) features.push('multitexture');
    if (gpuLevel >= 6) features.push('shader_2_0', 'vertex_shader');
    if (gpuLevel >= 8) features.push('shader_3_0', 'instanced_rendering');
    
    return features;
  }

  /**
   * 获取GPU层级
   * @private
   */
  static _getGPUTier(gpuLevel) {
    if (gpuLevel >= 8) return 'high';
    if (gpuLevel >= 6) return 'medium_high';
    if (gpuLevel >= 4) return 'medium';
    if (gpuLevel >= 2) return 'low_medium';
    return 'low';
  }

  /**
   * 分类整体性能
   * @private
   */
  static _classifyOverall(benchmarkInfo) {
    if (benchmarkInfo.performanceScore >= 80) return 'excellent';
    if (benchmarkInfo.performanceScore >= 60) return 'good';
    if (benchmarkInfo.performanceScore >= 40) return 'average';
    if (benchmarkInfo.performanceScore >= 20) return 'poor';
    return 'very_poor';
  }

  /**
   * 分类CPU性能
   * @private
   */
  static _classifyCPU(benchmarkInfo) {
    const cpuLevel = benchmarkInfo.cpuLevel || 0;
    if (cpuLevel >= 8) return 'high_end';
    if (cpuLevel >= 6) return 'upper_mid';
    if (cpuLevel >= 4) return 'mid_range';
    if (cpuLevel >= 2) return 'low_mid';
    return 'low_end';
  }

  /**
   * 分类GPU性能
   * @private
   */
  static _classifyGPU(benchmarkInfo) {
    const gpuLevel = benchmarkInfo.gpuLevel || 0;
    if (gpuLevel >= 8) return 'gaming_grade';
    if (gpuLevel >= 6) return 'high_performance';
    if (gpuLevel >= 4) return 'mainstream';
    if (gpuLevel >= 2) return 'basic';
    return 'minimum';
  }

  /**
   * 分类内存性能
   * @private
   */
  static _classifyMemory(benchmarkInfo, systemInfo) {
    const memoryLevel = benchmarkInfo.memoryLevel || 0;
    const ramSize = systemInfo.pixelRatio || 2; // 简化的内存估算
    
    if (memoryLevel >= 8 && ramSize >= 3) return 'excellent';
    if (memoryLevel >= 6 && ramSize >= 2) return 'good';
    if (memoryLevel >= 4 && ramSize >= 1) return 'average';
    return 'limited';
  }

  /**
   * 分类存储性能
   * @private
   */
  static _classifyStorage(benchmarkInfo) {
    const storageLevel = benchmarkInfo.storageLevel || 0;
    if (storageLevel >= 8) return 'ufs_3_0_plus';
    if (storageLevel >= 6) return 'ufs_3_0';
    if (storageLevel >= 4) return 'ufs_2_1';
    if (storageLevel >= 2) return 'emmc_5_1';
    return 'emmc_5_0';
  }

  /**
   * 评估游戏能力
   * @private
   */
  static _assessGamingCapability(benchmarkInfo) {
    const gpuLevel = benchmarkInfo.gpuLevel || 0;
    const cpuLevel = benchmarkInfo.cpuLevel || 0;
    const memoryLevel = benchmarkInfo.memoryLevel || 0;
    
    if (gpuLevel >= 8 && cpuLevel >= 8 && memoryLevel >= 8) return 'flagship_gaming';
    if (gpuLevel >= 6 && cpuLevel >= 6 && memoryLevel >= 6) return 'high_gaming';
    if (gpuLevel >= 4 && cpuLevel >= 4 && memoryLevel >= 4) return 'mainstream_gaming';
    if (gpuLevel >= 2 && cpuLevel >= 2) return 'casual_gaming';
    return 'not_recommended';
  }

  /**
   * 评估多任务能力
   * @private
   */
  static _assessMultitaskingCapability(benchmarkInfo) {
    const memoryLevel = benchmarkInfo.memoryLevel || 0;
    const cpuLevel = benchmarkInfo.cpuLevel || 0;
    
    if (memoryLevel >= 8 && cpuLevel >= 8) return 'excellent';
    if (memoryLevel >= 6 && cpuLevel >= 6) return 'good';
    if (memoryLevel >= 4 && cpuLevel >= 4) return 'average';
    if (memoryLevel >= 2 && cpuLevel >= 2) return 'limited';
    return 'poor';
  }

  /**
   * 生成推荐建议
   * @private
   */
  static _generateRecommendations(benchmarkInfo, systemInfo) {
    const recommendations = [];
    const deviceCategory = this._getDeviceCategory(benchmarkInfo.benchmarkLevel || -1);
    
    if (deviceCategory === 'low_end' || deviceCategory === 'unknown') {
      recommendations.push('建议关闭后台应用以提升性能');
      recommendations.push('使用轻量级应用以获得更好体验');
    }
    
    if (deviceCategory === 'entry_level') {
      recommendations.push('适合日常使用和轻度应用');
      recommendations.push('可考虑适度使用多任务功能');
    }
    
    if (deviceCategory === 'mid_range') {
      recommendations.push('可流畅运行大多数应用');
      recommendations.push('支持中等强度的多任务处理');
    }
    
    if (deviceCategory === 'high_end') {
      recommendations.push('可流畅运行大型应用和游戏');
      recommendations.push('支持重度多任务使用');
    }
    
    if (deviceCategory === 'flagship') {
      recommendations.push('可运行所有类型的应用和游戏');
      recommendations.push('支持极限多任务和高强度使用');
    }
    
    return recommendations;
  }

  /**
   * 获取电量信息
   * @returns {Promise<Object>} 电量信息对象
   */
  static async getBatteryInfo() {
    return new Promise((resolve) => {
      // 优先使用异步API
      if (wx.getBatteryInfo) {
        wx.getBatteryInfo({
          success: (res) => {
            resolve({
              level: res.level !== undefined ? res.level : -1,
              isCharging: res.isCharging || false,
              isLowPowerModeEnabled: res.isLowPowerModeEnabled || false
            });
          },
          fail: (error) => {
            console.warn('异步获取电量信息失败，尝试同步API:', error);
            // 如果异步失败，尝试同步API作为备用
            this._getBatteryInfoSync(resolve);
          }
        });
      } else {
        // 低版本兼容处理，直接使用同步API
        this._getBatteryInfoSync(resolve);
      }
    });
  }

  /**
   * 同步获取电量信息（备用方案）
   * @private
   */
  static _getBatteryInfoSync(resolve) {
    try {
      if (wx.getBatteryInfoSync) {
        const batteryInfo = wx.getBatteryInfoSync();
        resolve({
          level: batteryInfo.level !== undefined ? batteryInfo.level : -1,
          isCharging: batteryInfo.isCharging || false,
          isLowPowerModeEnabled: batteryInfo.isLowPowerModeEnabled || false
        });
      } else {
        // API不可用
        resolve({
          level: -1,
          isCharging: false,
          isLowPowerModeEnabled: false
        });
      }
    } catch (error) {
      console.warn('同步获取电量信息失败:', error);
      resolve({
        level: -1,
        isCharging: false,
        isLowPowerModeEnabled: false
      });
    }
  }

  /**
   * 获取完整设备信息
   * @returns {Promise<Object>} 设备信息对象
   */
  static async getDeviceInfo() {
    const systemInfo = await this._getSystemInfo();
    const networkInfo = await this._getNetworkInfo();
    const benchmarkInfo = await this.getDeviceBenchmarkInfo();
    const batteryInfo = await this.getBatteryInfo();
    
    return {
      ...systemInfo,
      networkType: networkInfo.networkType,
      ...benchmarkInfo,
      ...batteryInfo
    };
  }

  /**
   * 获取系统信息
   * @private
   */
  static async _getSystemInfo() {
    try {
      // 使用新的API替代已弃用的wx.getSystemInfo
      const appBaseInfo = wx.getAppBaseInfo();
      const deviceInfo = wx.getDeviceInfo();
      const windowInfo = wx.getWindowInfo();
      
      return {
        ...appBaseInfo,
        ...deviceInfo,
        ...windowInfo
      };
    } catch (error) {
      console.warn('获取系统信息失败，使用备用方案:', error);
      // 备用方案：返回基本系统信息
      return {
        platform: 'unknown',
        version: 'unknown',
        SDKVersion: 'unknown',
        windowWidth: 375,
        windowHeight: 667
      };
    }
  }

  /**
   * 获取权限信息
   * @private
   */
  static _getAuthInfo() {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => resolve({
          albumAuthorized: res.authSetting['scope.writePhotosAlbum'],
          cameraAuthorized: res.authSetting['scope.camera'],
          locationAuthorized: res.authSetting['scope.userLocation'],
          microphoneAuthorized: res.authSetting['scope.record']
        }),
        fail: () => resolve({
          albumAuthorized: false,
          cameraAuthorized: false,
          locationAuthorized: false,
          microphoneAuthorized: false
        })
      });
    });
  }

  /**
   * 获取网络信息
   * @private
   */
  static _getNetworkInfo() {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: resolve,
        fail: () => resolve({ networkType: '未知' })
      });
    });
  }

  /**
   * 获取IP地址
   * @returns {Promise<string>} IP地址
   */
  static async getIPAddress() {
    try {
      // 获取设备信息以检测平台类型
      const deviceInfo = wx.getDeviceInfo();
      
      // 如果是鸿蒙系统，使用专门的IP服务或简化处理
      if (deviceInfo.platform === 'ohos' || deviceInfo.system === 'HarmonyOS') {
        console.log('鸿蒙系统IP获取适配');
        // 鸿蒙系统可能需要特殊的处理方式
        return await this._getIPAddressForHarmonyOS();
      }
      
      // 尝试多个IP服务，提高可用性
      const ipServices = [
        {
          url: 'https://api.ipify.org?format=json',
          parser: (data) => data.ip
        },
        {
          url: 'https://ifconfig.me/ip',
          parser: (data) => data.trim()
        }
      ];

      for (const service of ipServices) {
        try {
          const res = await new Promise((resolve, reject) => {
            wx.request({
              url: service.url,
              timeout: 5000,
              success: resolve,
              fail: reject
            });
          });
          
          if (res.statusCode === 200 && res.data) {
            const ip = service.parser(res.data);
            if (ip && ip !== '获取失败') {
              return ip;
            }
          }
        } catch (serviceError) {
          console.warn(`IP服务 ${service.url} 不可用:`, serviceError);
          continue;
        }
      }
      
      return '获取失败';
    } catch (error) {
      console.warn('获取IP地址失败:', error);
      return '获取失败';
    }
  }

  /**
   * 获取IPv4地址
   * @returns {Promise<string>} IPv4地址
   */
  static async getIPv4() {
    try {
      // 多个IPv4服务，提高可用性
      const ipv4Services = [
        {
          url: 'https://api-ipv4.ip.sb/ip',
          parser: (data) => data.trim()
        },
        {
          url: 'https://ipv4.icanhazip.com',
          parser: (data) => data.trim()
        },
        {
          url: 'https://ifconfig.me/ip',
          parser: (data) => data.trim()
        },
        {
          url: 'https://api.ipify.org?format=json',
          parser: (data) => data.ip
        }
      ];

      for (const service of ipv4Services) {
        try {
          const res = await new Promise((resolve, reject) => {
            wx.request({
              url: service.url,
              timeout: 8000,
              success: resolve,
              fail: reject
            });
          });

          if (res.statusCode === 200 && res.data) {
            const ip = service.parser(res.data);
            // 验证是否为有效的IPv4地址：包含点号但不包含冒号
            if (ip && ip.length > 0 && ip.includes('.') && !ip.includes(':')) {
              console.log(`成功从 ${service.url} 获取IPv4:`, ip);
              return ip;
            } else {
              console.log(`${service.url} 返回的不是IPv4地址:`, ip);
            }
          }
        } catch (serviceError) {
          console.warn(`IPv4服务 ${service.url} 不可用:`, serviceError);
          continue;
        }
      }
      
      return '获取失败';
    } catch (error) {
      console.warn('获取IPv4地址失败:', error);
      return '获取失败';
    }
  }

  /**
   * 获取IPv6地址
   * @returns {Promise<string>} IPv6地址
   */
  static async getIPv6() {
    try {
      // 多个IPv6服务，提高可用性
      const ipv6Services = [
        {
          url: 'https://api-ipv6.ip.sb/ip',
          parser: (data) => data.trim()
        },
        {
          url: 'https://ipv6.icanhazip.com',
          parser: (data) => data.trim()
        },
        {
          url: 'https://ifconfig.co/v6',
          parser: (data) => data.trim()
        },
        {
          url: 'https://v6.ident.me',
          parser: (data) => data.trim()
        },
        {
          url: 'https://api6.ipify.org?format=json',
          parser: (data) => data.ip
        }
      ];

      for (const service of ipv6Services) {
        try {
          const res = await new Promise((resolve, reject) => {
            wx.request({
              url: service.url,
              timeout: 10000,
              success: resolve,
              fail: reject
            });
          });

          if (res.statusCode === 200 && res.data) {
            const ip = service.parser(res.data);
            // 验证是否为有效的IPv6地址：包含冒号但不包含点号
            if (ip && ip.length > 0 && ip.includes(':') && !ip.includes('.')) {
              console.log(`成功从 ${service.url} 获取IPv6:`, ip);
              return ip;
            } else {
              console.log(`${service.url} 返回的不是IPv6地址:`, ip);
            }
          }
        } catch (serviceError) {
          console.warn(`IPv6服务 ${service.url} 不可用:`, serviceError);
          continue;
        }
      }
      
      return '不支持';
    } catch (error) {
      console.warn('获取IPv6地址失败:', error);
      return '不支持';
    }
  }
  
  /**
   * 鸿蒙系统专用IP获取方法
   * @private
   * @returns {Promise<string>} IP地址
   */
  static async _getIPAddressForHarmonyOS() {
    try {
      // 鸿蒙系统可能对网络请求有特殊要求，使用更简单的服务
      const harmonyOSServices = [
        {
          url: 'https://httpbin.org/ip',
          parser: (data) => data.origin
        },
        {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          parser: (data) => {
            // 尝试从响应头或其他字段获取IP相关信息
            return 'HarmonyOS_IP_Unknown';
          }
        }
      ];
      
      for (const service of harmonyOSServices) {
        try {
          const res = await new Promise((resolve, reject) => {
            wx.request({
              url: service.url,
              timeout: 8000,  // 鸿蒙系统可能需要更长超时时间
              success: resolve,
              fail: reject
            });
          });
          
          if (res.statusCode === 200 && res.data) {
            const result = service.parser(res.data);
            if (result && result !== 'HarmonyOS_IP_Unknown') {
              return result;
            }
          }
        } catch (serviceError) {
          console.warn(`鸿蒙系统IP服务 ${service.url} 不可用:`, serviceError);
          continue;
        }
      }
      
      return 'HarmonyOS_IP_获取失败';
    } catch (error) {
      console.warn('鸿蒙系统获取IP地址失败:', error);
      return 'HarmonyOS_IP_获取失败';
    }
  }
}

module.exports = DeviceService;