/**
 * 设备性能测试页面
 * 简化版：降低测试压力，移除分数限制，完全基于操作数给分
 */
const PerformanceCalculation = require('./performance-calculation.js');

/**
 * 基础性能测试类
 */
class PerformanceTest {
  constructor(name, duration = 5000) {
    this.name = name;
    this.duration = duration;
    this.startTime = null;
    this.result = 0;
    this.running = false;
    this.operations = 0;
  }

  async run(onProgress) {
    this.running = true;
    this.startTime = Date.now();
    this.result = 0;
    this.operations = 0;

    while (this.running && (Date.now() - this.startTime) < this.duration) {
      await this.executeTest();
      if (onProgress) {
        onProgress(this.getProgress());
      }
    }

    this.running = false;
    return this.calculateScore();
  }

  stop() {
    this.running = false;
  }

  getProgress() {
    if (!this.startTime) return 0;
    return Math.min(100, ((Date.now() - this.startTime) / this.duration) * 100);
  }

  executeTest() {
    // 子类实现具体测试逻辑
    return Promise.resolve();
  }

  calculateScore() {
    // 子类实现分数计算
    return this.result;
  }
}

// 修复后的 Page 定义
const performanceTestPage = {
  data: {
    basicInfo: {
      brand: '获取中...',
      model: '获取中...',
      system: '获取中...',
      platform: '获取中...'
    },
    
    performanceScores: {
      cpu: null,
      gpu: null,
      memory: null,
      storage: null,
      overall: null
    },
    
    testing: false,
    currentTest: '',
    progress: 0,
    
    levelDescription: '',
    levelColor: ''
  },

  onLoad() {
    this.loadBasicInfo();
  },

  loadBasicInfo() {
    // 使用新的API替代已弃用的wx.getSystemInfo
    const deviceInfo = wx.getDeviceInfo();
    const systemSetting = wx.getSystemSetting();
    
    // 根据平台优化显示信息
    let platformDisplay = deviceInfo.platform;
    let systemDisplay = `${deviceInfo.platform} ${deviceInfo.system}`;
    
    if (deviceInfo.platform === 'ohos') {  // 鸿蒙系统
      platformDisplay = 'HarmonyOS';
      systemDisplay = `HarmonyOS ${deviceInfo.system.replace('OpenHarmonyOS ', '')}`;
    } else if (deviceInfo.system === 'HarmonyOS') {  // 开发者工具中模拟鸿蒙
      platformDisplay = 'HarmonyOS (DevTools)';
      systemDisplay = `HarmonyOS (Simulated)`;
    }
    
    this.setData({
      basicInfo: {
        brand: deviceInfo.brand || '获取中...',
        model: deviceInfo.model || '获取中...',
        system: systemDisplay || '获取中...',
        platform: platformDisplay || '获取中...'
      }
    });
  },

  startPerformanceTest() {
    if (this.data.testing) return;
    
    this.setData({
      testing: true,
      performanceScores: {
        cpu: null,
        gpu: null,
        memory: null,
        storage: null,
        overall: null
      }
    });

    // 延迟执行测试，让setData先完成视图更新，避免UI卡顿
    setTimeout(() => {
      this.runTestsWithProgress();
    }, 50);
  },

  updateProgress(testName, progress) {
    const newProgress = Math.max(this.data.progress, Math.round(progress));
    this.setData({
      currentTest: testName,
      progress: newProgress
    });
  },

  async runTestsWithProgress() {
    const tests = [
      { name: 'CPU测试', test: () => this.createCPUTest(), key: 'cpu' },
      { name: 'GPU测试', test: () => this.createGPUTest(), key: 'gpu' },
      { name: '内存测试', test: () => this.createMemoryTest(), key: 'memory' },
      { name: '存储测试', test: () => this.createStorageTest(), key: 'storage' }
    ];

    const progressPerTest = 100 / tests.length;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const testStartProgress = i * progressPerTest;
      
      if (!this.data.testing) break;
      
      const onTestProgress = (testProgress) => {
        if (!this.data.testing) return;
        const currentOverallProgress = testStartProgress + (testProgress * progressPerTest / 100);
        this.updateProgress(test.name, currentOverallProgress);
      };

      try {
        const testInstance = test.test();
        
        const score = await testInstance.run(onTestProgress);
        console.log(`${test.name} 得分:`, score);
        
        if (this.data.testing) {
          this.setData({
            [`performanceScores.${test.key}`]: score
          });
          this.updateProgress(tests[i + 1]?.name || '测试完成', (i + 1) * progressPerTest);
        }
      } catch (error) {
        console.error(`${test.name}执行错误:`, error);
        if (this.data.testing) {
          this.setData({
            [`performanceScores.${test.key}`]: 0
          });
          wx.showToast({
            title: `${test.name}异常`,
            icon: 'none',
            duration: 2000
          });
        }
      }
    }

    if (this.data.testing) {
      this.calculateOverallScore();
    }
  },

  createCPUTest() {
    const cpuTest = new PerformanceTest('CPU测试', 5000);
    
    cpuTest.executeTest = () => {
      return new Promise((resolve) => {
        // 固定参数，降低测试压力
        const matrixSize = 8;
        const arraySize = 10000;
        
        // 矩阵运算
        const matrix = Array(matrixSize).fill(0).map(() => 
          Array(matrixSize).fill(0).map(() => Math.random() * 100)
        );
        
        const result = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(0));
        for (let i = 0; i < matrixSize; i++) {
          for (let j = 0; j < matrixSize; j++) {
            for (let k = 0; k < matrixSize; k++) {
              result[i][j] += matrix[i][k] * matrix[k][j];
            }
          }
        }
        
        // 数组排序
        const array = new Array(arraySize).fill(0).map(() => Math.random() * 100000);
        array.sort((a, b) => a - b);
        
        cpuTest.operations++;
        
        resolve();
      });
    };

    cpuTest.calculateScore = () => {
      return PerformanceCalculation.calculatePerformanceScore('cpu', cpuTest.operations);
    };

    return cpuTest;
  },

  createMemoryTest() {
    const memoryTest = new PerformanceTest('内存测试', 5000);
    
    memoryTest.executeTest = () => {
      return new Promise((resolve) => {
        const arraySize = 8000;
        
        try {
          // 大数组分配和排序
          const array = new Array(arraySize).fill(0).map(() => ({
            value: Math.random() * 1000000,
            key: Math.random().toString(36),
            timestamp: Date.now()
          }));
          
          array.sort((a, b) => a.value - b.value);
          
          // 数据结构操作
          const map = new Map();
          for (let i = 0; i < 3000; i++) {
            map.set(`key_${i}`, { id: i, data: new Array(50).fill(0).map(() => Math.random()) });
          }
          
          memoryTest.operations += arraySize + map.size;
        } catch (e) {
          console.error('内存测试错误:', e);
        }
        
        resolve();
      });
    };

    memoryTest.calculateScore = () => {
      return PerformanceCalculation.calculatePerformanceScore('memory', memoryTest.operations);
    };

    return memoryTest;
  },

  createStorageTest() {
    const storageTest = new PerformanceTest('存储测试', 5000);
    
    storageTest.executeTest = () => {
      return new Promise((resolve) => {
        const testData = {
          data: 'x'.repeat(512),
          timestamp: Date.now()
        };
        
        const executeRound = () => {
          return new Promise((resolve) => {
            const testKey = `perf_test_${storageTest.operations}_${Date.now()}`;
            
            wx.setStorage({
              key: testKey,
              data: testData,
              success: () => {
                wx.getStorage({
                  key: testKey,
                  success: () => {
                    wx.removeStorage({
                      key: testKey,
                      success: () => {
                        storageTest.operations++;
                        resolve();
                      },
                      fail: () => {
                        storageTest.operations++;
                        resolve();
                      }
                    });
                  },
                  fail: () => {
                    storageTest.operations++;
                    resolve();
                  }
                });
              },
              fail: () => {
                storageTest.operations++;
                resolve();
              }
            });
          });
        };
        
        // 执行多轮测试
        let rounds = 0;
        const maxRounds = 100;
        
        const runRound = () => {
          if (!storageTest.running || rounds >= maxRounds) {
            resolve();
            return;
          }
          
          executeRound().then(() => {
            rounds++;
            runRound();
          });
        };
        
        runRound();
      });
    };

    storageTest.calculateScore = () => {
      return PerformanceCalculation.calculatePerformanceScore('storage', storageTest.operations);
    };

    return storageTest;
  },

  createGPUTest() {
    const gpuTest = new PerformanceTest('GPU测试', 5000);
    
    gpuTest.executeTest = () => {
      return new Promise((resolve) => {
        const vertexCount = 3000;
        const fragmentCount = 150000;
        
        // 多边形渲染测试
        const vertices = [];
        for (let i = 0; i < vertexCount; i++) {
          vertices.push({
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            z: Math.random() * 1000
          });
        }
        
        // 顶点变换
        vertices.forEach(v => {
          const angle = Date.now() * 0.001;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const newX = v.x * cos - v.y * sin;
          const newY = v.x * sin + v.y * cos;
          v.x = newX;
          v.y = newY;
        });
        
        // 片段着色器计算
        const fragments = new Array(fragmentCount).fill(0).map(() => ({
          position: [Math.random(), Math.random()]
        }));
        
        fragments.forEach(frag => {
          const r = frag.position[0] * 255;
          const g = frag.position[1] * 255;
          const b = (r + g) / 2;
        });
        
        gpuTest.operations++;
        
        resolve();
      });
    };

    gpuTest.calculateScore = () => {
      return PerformanceCalculation.calculatePerformanceScore('gpu', gpuTest.operations);
    };

    return gpuTest;
  },

  calculateOverallScore() {
    const scores = this.data.performanceScores;
    
    // 直接计算加权总分，不限制范围
    const weights = { cpu: 0.35, gpu: 0.35, memory: 0.2, storage: 0.1 };
    const total = Math.round(
      scores.cpu * weights.cpu +
      scores.gpu * weights.gpu +
      scores.memory * weights.memory +
      scores.storage * weights.storage
    );
    
    const performanceGrade = PerformanceCalculation.getPerformanceGrade(scores);
    
    this.setData({
      'performanceScores.overall': total,
      levelDescription: performanceGrade.description,
      levelColor: performanceGrade.color,
      testing: false,
      currentTest: '测试完成',
      progress: 100
    });

    wx.showToast({
      title: '测试完成！',
      icon: 'success',
      duration: 2000
    });

    console.log('性能测试结果:', {
      total: total,
      scores: scores,
      performanceGrade: performanceGrade
    });
  },

  onShareAppMessage() {
    return {
      title: '设备性能测试 - 星芒集盒',
      path: '/pages/performance-test/performance-test',
      imageUrl: '/images/logo.jpg'
    };
  },

  onShareTimeline() {
    return {
      title: '设备性能测试 - 星芒集盒',
      imageUrl: '/images/logo.jpg'
    };
  }
};

// 注册页面
Page({
  ...performanceTestPage,
  
  onShow() {
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
  },

  loadThemeMode() {
    const themeMode = wx.getStorageSync('themeMode') || 'system'
    if (themeMode === 'system') {
      const systemSetting = wx.getSystemSetting()
      this.updateThemeClass(systemSetting.theme || 'light')
    } else {
      this.updateThemeClass(themeMode)
    }
  },

  updateThemeClass(theme) {
    let themeClass = ''
    if (theme === 'dark') {
      themeClass = 'dark'
    } else {
      themeClass = ''
    }
    this.setData({ themeClass })
  }
});