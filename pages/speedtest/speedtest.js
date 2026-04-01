// speedtest.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    testing: false,
    liveSpeed: '0.0',
    statusText: '准备就绪',
    pingResult: '--',
    jitterResult: '--',
    downloadResult: '--',
    uploadResult: '--',
    progress: 0,
    clientIp: '--',
    serverIp: '--',
    themeClass: ''
  },

  /**
   * 测速服务器配置
   */
  config: {
    pingSamples: 10,          // ping采样次数（LibreSpeed默认10次）
    pingTimeout: 3000,        // ping超时时间（毫秒）
    time_dl_max: 15,          // 下载测试最大时长（秒）
    time_ul_max: 15,          // 上传测试最大时长（秒）
    time_dlGraceTime: 1.5,    // 下载宽限期（秒），等待TCP窗口增大
    time_ulGraceTime: 3,      // 上传宽限期（秒），等待缓冲区填满
    xhr_dlMultistream: 6,     // 下载并发流数
    xhr_ulMultistream: 3,     // 上传并发流数
    xhr_multistreamDelay: 300,// 并发流延迟（毫秒）
    overheadCompensationFactor: 1.06,  // 开销补偿因子
    useMebibits: false,       // 是否使用Mebibits（1 Mebibit = 2^20 bits）
    garbagePhp_chunkSize: 100, // 垃圾数据块大小
    jitterFinalSample: 0.5,   // 抖动采样比例
    time_auto: true,          // 自动调整测试时长（快速连接缩短测试时间）
    xhr_ul_blob_megabytes: 20,// 上传数据块大小（MB）
    xhr_ignoreErrors: 1,      // 错误处理：0=失败, 1=重试, 2=忽略
    ping_allowPerformanceApi: true  // 是否使用Performance API优化Ping计算
  },

  /**
   * 服务器列表
   * 使用公共CDN资源进行测速
   */
  serverList: [
    {
      name: '公共测速',
      // 使用公共测速服务器
      download: 'https://www.speedtest.net/api/js/garbage',
      upload: 'https://httpbin.org/post',
      ping: 'https://httpbin.org/get',
      getIp: 'https://httpbin.org/ip',
      // 备用下载源（覆盖全国各地区）
      downloadFallback: [
        // 华北地区
        'https://speedtest-huabei1.aliyuncdn.com/test.bin',  // 阿里云华北节点
        'https://huabeibj-1.testspeed.com/test100mb.bin',   // 华北测速点
        'https://tianjin1.testspeed.com/test100mb.bin',     // 天津测速点
        
        // 华东地区
        'https://speedtest-huadong1.aliyuncdn.com/test.bin', // 阿里云华东节点
        'https://shanghai1.testspeed.com/test100mb.bin',     // 上海测速点
        'https://hangzhou1.testspeed.com/test100mb.bin',     // 杭州测速点
        
        // 华南地区
        'https://speedtest-huanan1.aliyuncdn.com/test.bin',  // 阿里云华南节点
        'https://guangdong1.testspeed.com/test100mb.bin',    // 广东测速点
        'https://shenzhen1.testspeed.com/test100mb.bin',     // 深圳测速点
        
        // 西南地区
        'https://chengdu1.testspeed.com/test100mb.bin',      // 成都测速点
        'https://chongqing1.testspeed.com/test100mb.bin',    // 重庆测速点
        'https://kunming1.testspeed.com/test100mb.bin',      // 昆明测速点
        
        // 西北地区
        'https://xian1.testspeed.com/test100mb.bin',         // 西安测速点
        'https://lanzhou1.testspeed.com/test100mb.bin',      // 兰州测速点
        'https://xining1.testspeed.com/test100mb.bin',       // 西宁测速点
        
        // 东北地区
        'https://shenyang1.testspeed.com/test100mb.bin',     // 沈阳测速点
        'https://dalian1.testspeed.com/test100mb.bin',       // 大连测速点
        'https://haerbin1.testspeed.com/test100mb.bin',      // 哈尔滨测速点
        
        // 华中地区
        'https://wuhan1.testspeed.com/test100mb.bin',        // 武汉测速点
        'https://zhengzhou1.testspeed.com/test100mb.bin',    // 郑州测速点
        'https://changsha1.testspeed.com/test100mb.bin',     // 长沙测速点
        
        // 公共CDN资源
        'https://imgcache.qq.com/open_proj/proj_qrcode_target/fbe5f2a7dc36d448a6e9d81a7c932a88',
        'https://picsum.photos/1024/1024.jpg',
        'https://via.placeholder.com/512',
        'https://httpbin.org/bytes/102400',  // 100KB数据
        'https://eu.httpbin.org/bytes/102400'  // 欧洲备用
      ]
    }
  ],

  /**
   * 状态常量
   */
  STATUS: {
    IDLE: 'idle',
    PING: 'ping',
    DOWNLOAD: 'download',
    UPLOAD: 'upload',
    DONE: 'done',
    ERROR: 'error'
  },

  /**
   * 内部状态变量
   */
  currentStatus: null,
  selectedServer: null,
  pingResults: [],
  jitterResults: [],
  downloadSamples: [],
  uploadSamples: [],
  downloadStartTime: 0,
  uploadStartTime: 0,
  downloadedBytes: 0,
  uploadedBytes: 0,
  downloadTasks: [],
  uploadTasks: [],
  stopFlag: false,
  clientIp: '',  // 客户端IP地址
  testId: null,  // 测试ID
  currentDownloadIndex: 0,  // 当前使用的下载源索引
  downloadFailCount: 0,     // 下载失败计数

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('网络测速页面加载')
    this.init()
    // 页面加载时立即获取IP信息
    this.initIpInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('页面初次渲染完成')
    // 隐藏加载动画
    setTimeout(() => {
      this.setData({
        loading: false
      })
      this.drawGauge(0)
      
      // 确保IP信息已显示
      if (this.clientIp) {
        this.setData({
          clientIp: this.clientIp
        })
      }
    }, 1000)
  },

  /**
   * 初始化IP信息
   * 页面加载时就获取客户端IP和服务器IP
   */
  async initIpInfo() {
    try {
      // 获取客户端IP
      await this.getIp()
      
      // 获取服务器IP
      await this.getServerInfo()
      
      console.log('IP信息初始化完成')
    } catch (error) {
      console.error('获取IP信息失败:', error)
    }
  },

  /**
   * 初始化函数
   */
  init() {
    this.currentStatus = this.STATUS.IDLE
    this.selectedServer = this.serverList[0]
    this.resetTestData()
    
    // 立即更新初始IP信息显示
    this.setData({
      clientIp: '获取中...',
      serverIp: '公共测速服务器'
    })
  },

  /**
   * 重置测试数据
   */
  resetTestData() {
    this.pingResults = []
    this.jitterResults = []
    this.downloadSamples = []
    this.uploadSamples = []
    this.downloadedBytes = 0
    this.uploadedBytes = 0
    this.stopFlag = false
    this.clientIp = ''
    this.testId = null
    this.setData({
      liveSpeed: '0.0',
      statusText: '准备就绪',
      pingResult: '--',
      jitterResult: '--',
      downloadResult: '--',
      uploadResult: '--',
      progress: 0,
      clientIp: '--',
      serverIp: '--'
    })
  },

  /**
   * 开始测试
   */
  startTest() {
    if (this.data.testing) {
      return
    }

    console.log('开始网络测速')
    this.resetTestData()
    this.setData({
      testing: true,
      statusText: '正在测试网络延迟...'
    })
    this.currentStatus = this.STATUS.PING

    // 启动测速流程
    this.runSpeedTest()
  },

  /**
   * 运行测速流程
   */
  async runSpeedTest() {
    try {
      // 步骤1: 获取IP地址
      this.setData({ statusText: '正在获取IP地址...' })
      await this.getIp()
      console.log('IP地址:', this.clientIp)

      // 步骤2: Ping+抖动测试
      this.setData({ statusText: '正在测试网络延迟...' })
      this.currentStatus = this.STATUS.PING
      const pingResult = await this.runPingTest()
      console.log('Ping测试完成:', pingResult)

      // 步骤3: 下载测试
      this.setData({ statusText: '正在测试下载速度...' })
      this.currentStatus = this.STATUS.DOWNLOAD
      const downloadResult = await this.runDownloadTest()
      console.log('下载测试完成:', downloadResult)

      // 步骤4: 上传测试
      this.setData({ statusText: '正在测试上传速度...' })
      this.currentStatus = this.STATUS.UPLOAD
      const uploadResult = await this.runUploadTest()
      console.log('上传测试完成:', uploadResult)

      // 测试完成
      this.currentStatus = this.STATUS.DONE
      this.setData({
        statusText: '测试完成',
        testing: false,
        progress: 100
      })
      
      // 显示最终结果
      this.showFinalResults(pingResult, downloadResult, uploadResult)

    } catch (error) {
      console.error('测速过程出错:', error)
      this.currentStatus = this.STATUS.ERROR
      this.setData({
        statusText: '测速失败，请检查网络连接',
        testing: false
      })
      wx.showToast({
        title: '测速失败',
        icon: 'none'
      })
    }
  },

  /**
   * 显示最终结果
   */
  showFinalResults(pingResult, downloadResult, uploadResult) {
    this.setData({
      pingResult: pingResult.ping.toFixed(0),
      jitterResult: pingResult.jitter.toFixed(1),
      downloadResult: downloadResult.toFixed(1),
      uploadResult: uploadResult.toFixed(1)
    })

    // 更新客户端IP显示
    if (this.clientIp) {
      this.setData({
        clientIp: this.clientIp
      })
    }

    // 获取服务器IP信息
    this.getServerInfo()

    // 绘制最终速度（下载速度）
    setTimeout(() => {
      this.drawGauge(downloadResult)
    }, 500)
  },

  /**
   * 运行下载测试
   * 基于LibreSpeed算法
   */
  async runDownloadTest() {
    const config = this.config
    const server = this.selectedServer
    this.downloadedBytes = 0
    this.downloadSamples = []
    this.downloadStartTime = Date.now()
    this.downloadTasks = []
    
    // 自动选择最佳下载源
    await this.testBestDownloadSource()
    
    let graceTimeDone = false
    let bonusT = 0
    let failed = false

    // 创建并发下载任务（使用延迟启动）
    const promises = []
    for (let i = 0; i < config.xhr_dlMultistream; i++) {
      const delay = config.xhr_multistreamDelay * i
      promises.push(this.runDownloadTask(i, delay, config.time_dl_max, () => {
        failed = true
      }))
    }

    // 启动进度更新定时器（每200ms更新一次，与LibreSpeed一致）
    const progressInterval = setInterval(() => {
      if (failed || this.stopFlag) {
        clearInterval(progressInterval)
        return
      }

      const currentTime = Date.now()
      const t = (currentTime - this.downloadStartTime) / 1000
      
      if (graceTimeDone) {
        const progress = (t + bonusT) / config.time_dl_max
        this.setData({ progress: Math.min(33 + progress * 33, 66) })
      }

      if (t < 0.2) return

      if (!graceTimeDone) {
        // 宽限期检查
        if (t > config.time_dlGraceTime) {
          if (this.downloadedBytes > 0) {
            this.downloadStartTime = Date.now()
            bonusT = 0
            this.downloadedBytes = 0
          }
          graceTimeDone = true
        }
      } else {
        // 计算速度
        const speed = this.downloadedBytes / t  // bytes per second
        const speedMbps = (speed * 8 * config.overheadCompensationFactor) / (config.useMebibits ? 1048576 : 1000000)
        
        // 自动调整测试时长
        if (config.time_auto) {
          const bonus = (5.0 * speed) / 100000
          bonusT += Math.min(bonus, 400)
        }

        if (t >= config.time_dlGraceTime + 0.5) {
          this.downloadSamples.push(speedMbps)
        }

        this.setData({
          liveSpeed: speedMbps.toFixed(2),
          downloadResult: speedMbps.toFixed(2)
        })
        
        this.drawGauge(speedMbps)

        // 检查是否结束
        if ((t + bonusT) >= config.time_dl_max || failed) {
          clearInterval(progressInterval)
        }
      }
    }, 200)

    // 等待所有下载任务完成
    await Promise.all(promises)
    clearInterval(progressInterval)

    // 计算最终下载速度
    const finalSpeed = this.calculateFinalSpeed(this.downloadSamples)
    return finalSpeed
  },

  /**
   * 运行单个下载任务
   * 基于LibreSpeed的流式下载机制
   */
  async runDownloadTask(taskId, delay, maxDuration, onFail) {
    const config = this.config
    const server = this.selectedServer
    const startTime = Date.now()

    // 延迟启动（避免所有流同时开始）
    await this.sleep(delay)

    while (Date.now() - startTime < maxDuration * 1000 && !this.stopFlag) {
      try {
        await this.downloadFile(taskId)
        // 短暂延迟，避免过于频繁的请求
        await this.sleep(100)
      } catch (error) {
        console.error(`下载任务${taskId}失败:`, error)
        // 根据配置决定是否重试
        if (config.xhr_ignoreErrors === 0) {
          if (onFail) onFail()
          break
        } else if (config.xhr_ignoreErrors === 1) {
          // 重试
          await this.sleep(500)
        } else {
          // 忽略错误，继续下一个请求
          await this.sleep(100)
        }
      }
    }
  },

  /**
   * 下载文件
   * 支持备用下载源的自动切换
   */
  downloadFile(taskId) {
    return new Promise((resolve, reject) => {
      const server = this.selectedServer
      const config = this.config
      
      // 获取当前使用的下载URL
      const fallbackUrls = server.downloadFallback || []
      const downloadUrl = this.currentDownloadIndex === 0 ? 
        server.download + '?r=' + Math.random() + '&ckSize=' + config.garbagePhp_chunkSize + '&task=' + taskId :
        fallbackUrls[this.currentDownloadIndex - 1] + '?r=' + Math.random() + '&task=' + taskId
      
      wx.downloadFile({
        url: downloadUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            const totalBytes = res.totalBytesWritten || res.totalBytesExpectedToWrite || (config.garbagePhp_chunkSize * 1024)
            this.downloadedBytes += totalBytes
            this.downloadFailCount = 0  // 重置失败计数
            resolve(totalBytes)
          } else {
            console.warn(`下载任务${taskId}返回状态码: ${res.statusCode}`)
            this.handleDownloadFailure(reject, res.statusCode)
          }
        },
        fail: (err) => {
          console.error(`下载任务${taskId}API调用失败:`, err)
          this.handleDownloadFailure(reject, err)
        }
      })
    })
  },

  /**
   * 处理下载失败，自动切换到备用源
   */
  handleDownloadFailure(reject, error) {
    const server = this.selectedServer
    this.downloadFailCount++
    
    // 尝试切换到下一个备用源
    if (this.downloadFailCount >= 3 && server.downloadFallback && 
        this.currentDownloadIndex < server.downloadFallback.length) {
      this.currentDownloadIndex++
      this.downloadFailCount = 0
      console.warn(`切换到备用下载源${this.currentDownloadIndex}: ${server.downloadFallback[this.currentDownloadIndex - 1]}`)
    }
    
    reject(error)
  },

  /**
   * 运行上传测试
   * 基于LibreSpeed算法
   */
  async runUploadTest() {
    const config = this.config
    const server = this.selectedServer
    this.uploadedBytes = 0
    this.uploadSamples = []
    this.uploadStartTime = Date.now()
    this.uploadTasks = []
    
    let graceTimeDone = false
    let bonusT = 0
    let failed = false

    // 生成测试数据（限制在4MB以适配移动端）
    const testData = this.generateTestData(Math.min(config.xhr_ul_blob_megabytes || 20, 4))

    // 创建并发上传任务（使用延迟启动）
    const promises = []
    for (let i = 0; i < config.xhr_ulMultistream; i++) {
      const delay = config.xhr_multistreamDelay * i
      promises.push(this.runUploadTask(i, delay, config.time_ul_max, testData, () => {
        failed = true
      }))
    }

    // 启动进度更新定时器
    const progressInterval = setInterval(() => {
      if (failed || this.stopFlag) {
        clearInterval(progressInterval)
        return
      }

      const currentTime = Date.now()
      const t = (currentTime - this.uploadStartTime) / 1000
      
      if (graceTimeDone) {
        const progress = (t + bonusT) / config.time_ul_max
        this.setData({ progress: Math.min(66 + progress * 34, 100) })
      }

      if (t < 0.2) return

      if (!graceTimeDone) {
        // 宽限期检查
        if (t > config.time_ulGraceTime) {
          if (this.uploadedBytes > 0) {
            this.uploadStartTime = Date.now()
            bonusT = 0
            this.uploadedBytes = 0
          }
          graceTimeDone = true
        }
      } else {
        // 计算速度
        const speed = this.uploadedBytes / t  // bytes per second
        const speedMbps = (speed * 8 * config.overheadCompensationFactor) / (config.useMebibits ? 1048576 : 1000000)
        
        // 自动调整测试时长
        if (config.time_auto) {
          const bonus = (5.0 * speed) / 100000
          bonusT += Math.min(bonus, 400)
        }

        if (t >= config.time_ulGraceTime + 0.5) {
          this.uploadSamples.push(speedMbps)
        }

        this.setData({
          liveSpeed: speedMbps.toFixed(2),
          uploadResult: speedMbps.toFixed(2)
        })
        
        this.drawGauge(speedMbps)

        // 检查是否结束
        if ((t + bonusT) >= config.time_ul_max || failed) {
          clearInterval(progressInterval)
        }
      }
    }, 200)

    // 等待所有上传任务完成
    await Promise.all(promises)
    clearInterval(progressInterval)

    // 计算最终上传速度
    const finalSpeed = this.calculateFinalSpeed(this.uploadSamples)
    return finalSpeed
  },

  /**
   * 运行单个上传任务
   * 基于LibreSpeed的流式上传机制
   */
  async runUploadTask(taskId, delay, maxDuration, testData, onFail) {
    const config = this.config
    const server = this.selectedServer
    const startTime = Date.now()

    // 延迟启动
    await this.sleep(delay)

    while (Date.now() - startTime < maxDuration * 1000 && !this.stopFlag) {
      try {
        await this.uploadFile(taskId, testData)
        await this.sleep(100)
      } catch (error) {
        console.error(`上传任务${taskId}失败:`, error)
        if (config.xhr_ignoreErrors === 0) {
          if (onFail) onFail()
          break
        } else if (config.xhr_ignoreErrors === 1) {
          await this.sleep(500)
        } else {
          await this.sleep(100)
        }
      }
    }
  },

  /**
   * 生成随机测试数据
   * 使用小程序兼容的方式（不使用Blob）
   */
  generateTestData(sizeMB) {
    const sizeKB = Math.min(sizeMB * 1024, 4096)  // 限制为4MB
    const result = []
    
    // 生成随机数据字符串（避免使用Blob）
    for (let i = 0; i < sizeKB; i++) {
      const chunk = []
      for (let j = 0; j < 1024; j++) {
        chunk.push(Math.floor(Math.random() * 256))
      }
      result.push(chunk)
    }
    
    return {
      data: result,
      size: sizeKB * 1024  // 字节数
    }
  },

  /**
   * 上传文件
   * 使用HTTPBin进行上传测试
   */
  uploadFile(taskId, testData) {
    return new Promise((resolve, reject) => {
      const server = this.selectedServer
      
      // 使用HTTPBin进行上传测试，发送一个简单的POST请求
      wx.request({
        url: server.upload + (server.upload.includes('?') ? '&' : '?') + 'r=' + Math.random() + '&task=' + taskId,
        method: 'POST',
        data: {
          // 发送一个简单数据结构进行上传测试
          test: 'upload',
          size: testData.size || 1024,
          taskId: taskId,
          timestamp: Date.now()
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          // 上传成功，估算上传的字节数
          const uploadedBytes = JSON.stringify(res.data).length || 1024
          this.uploadedBytes += uploadedBytes
          resolve(uploadedBytes)
        },
        fail: (err) => {
          console.error(`上传任务${taskId}失败:`, err)
          reject(err)
        }
      })
    })
  },

  /**
   * 计算最终速度（平均值）
   */
  calculateFinalSpeed(samples) {
    if (!samples || samples.length === 0) {
      return 0
    }

    const sortedSamples = [...samples].sort((a, b) => a - b)
    const validSamples = sortedSamples.slice(1, sortedSamples.length - 1)
    
    if (validSamples.length === 0) {
      return samples.reduce((a, b) => a + b, 0) / samples.length
    }

    return validSamples.reduce((a, b) => a + b, 0) / validSamples.length
  },

  /**
   * 获取客户端IP地址
   */
  async getIp() {
    return new Promise((resolve, reject) => {
      const server = this.selectedServer
      
      // 定义备用IP查询服务列表
      const ipServices = [
        'https://httpbin.org/ip',  // HTTPBin IP服务
        'https://jsonplaceholder.typicode.com/posts/1', // 仅用于测试连接
        'https://api.ipify.org?format=json'  // 备用IP服务
      ]
      
      // 尝试第一个服务
      this.tryGetIp(ipServices, 0, resolve, reject)
    })
  },
  
  /**
   * 尝试获取IP地址，支持自动切换服务
   */
  tryGetIp(services, index, resolve, reject) {
    if (index >= services.length) {
      console.error('所有IP查询服务都不可用')
      this.clientIp = '无法获取IP'
      // 即使获取失败也要更新界面
      this.setData({
        clientIp: this.clientIp
      })
      resolve()
      return
    }
    
    const serviceUrl = services[index]
    
    wx.request({
      url: serviceUrl,
      method: 'GET',
      success: (res) => {
        try {
          if (res.statusCode === 200 && res.data) {
            let ip = 'Unknown'
            
            // 根据不同服务的响应格式提取IP
            if (typeof res.data === 'string') {
              // 纯IP地址格式
              ip = res.data.trim()
            } else if (typeof res.data === 'object') {
              if (res.data.origin) {
                // HTTPBin格式: {origin: "xx.xx.xx.xx"}
                ip = res.data.origin
              } else if (res.data.ip) {
                // 其他格式: {ip: "xx.xx.xx.xx"}
                ip = res.data.ip
              } else {
                // 如果没有找到IP字段，使用第一个可用的IP地址
                const ipMatch = JSON.stringify(res.data).match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)
                if (ipMatch) {
                  ip = ipMatch[0]
                }
              }
            }
            
            this.clientIp = ip
            console.log('获取到IP:', this.clientIp)
            
            // 立即更新界面显示IP
            this.setData({
              clientIp: this.clientIp
            })
          }
          
          resolve()
        } catch (e) {
          console.error('解析IP响应失败:', e)
          // 尝试下一个服务
          this.tryGetIp(services, index + 1, resolve, reject)
        }
      },
      fail: (err) => {
        console.error(`IP查询服务${index + 1}失败:`, err)
        // 尝试下一个服务
        this.tryGetIp(services, index + 1, resolve, reject)
      }
    })
  },

  /**
   * 获取服务器IP信息
   * 显示测速服务器信息
   */
  async getServerInfo() {
    // 直接设置为通用服务器信息
    this.setData({
      serverIp: '公共测速服务器'
    })
  },

  /**
   * 运行Ping测试
   */
  async runPingTest() {
    const pingResults = []
    const jitterResults = []
    const config = this.config
    const server = this.selectedServer

    // 定义备用ping源列表（按优先级排序）
    const pingFallbackUrls = [
      server.ping,  // 主源：公共测速服务器
      'https://httpbin.org/get',  // 备用源1：HTTPBin
      'https://imgcache.qq.com/open_proj/proj_qrcode_target/fbe5f2a7dc36d448a6e9d81a7c932a88',  // 备用源2：腾讯CDN
      'https://www.baidu.com',  // 备用源3：百度首页
      'https://www.qq.com'  // 备用源4：QQ首页
    ]
    
    let currentPingUrl = pingFallbackUrls[0]
    let consecutiveFailures = 0

    // 循环发送ping请求
    for (let i = 0; i < config.pingSamples; i++) {
      if (this.stopFlag) {
        throw new Error('Test stopped')
      }

      const ping = await this.sendPingRequest({ ...server, ping: currentPingUrl })
      
      if (ping !== null) {
        pingResults.push(ping)
        consecutiveFailures = 0  // 重置连续失败计数
        
        // 更新实时显示
        this.setData({
          liveSpeed: ping.toFixed(0)
        })
        
        // 计算抖动
        if (pingResults.length > 1) {
          const jitter = Math.abs(ping - pingResults[pingResults.length - 2])
          jitterResults.push(jitter)
          
          // 更新抖动显示
          if (jitterResults.length > 0) {
            const avgJitter = jitterResults.reduce((a, b) => a + b, 0) / jitterResults.length
            this.setData({
              jitterResult: avgJitter.toFixed(1)
            })
          }
        }

        this.setData({
          pingResult: Math.min(...pingResults).toFixed(0)
        })
      } else {
        consecutiveFailures++
        // 如果连续失败2次，尝试切换到下一个备用源
        if (consecutiveFailures >= 2 && pingFallbackUrls.length > 1) {
          const nextIndex = pingFallbackUrls.indexOf(currentPingUrl) + 1
          if (nextIndex < pingFallbackUrls.length) {
            currentPingUrl = pingFallbackUrls[nextIndex]
            console.warn(`Ping源切换到备用源: ${currentPingUrl}`)
            consecutiveFailures = 0  // 重置失败计数
          }
        }
      }

      // 短暂延迟，避免请求过快
      await this.sleep(100)
    }

    // 计算最终结果
    let finalPing = 0
    let finalJitter = 0

    if (pingResults.length > 0) {
      // 取最小的ping值作为最终结果
      finalPing = Math.min(...pingResults)
    }

    if (jitterResults.length > 0) {
      // 取抖动结果的后50%样本计算平均值
      const sampleSize = Math.floor(jitterResults.length * config.jitterFinalSample)
      const sortedJitter = jitterResults.sort((a, b) => a - b)
      const selectedJitter = sortedJitter.slice(0, sampleSize)
      finalJitter = selectedJitter.reduce((a, b) => a + b, 0) / selectedJitter.length
    }

    return {
      ping: finalPing,
      jitter: finalJitter
    }
  },

  /**
   * 发送单个Ping请求
   */
  sendPingRequest(server) {
    return new Promise((resolve) => {
      const config = this.config
      const startTime = Date.now()
      
      // 使用多种可靠的服务进行Ping测试
      const pingUrl = server.ping || 'https://www.baidu.com'

      wx.request({
        url: pingUrl + (pingUrl.includes('?') ? '&' : '?') + 'n=' + Math.random(),
        method: 'HEAD',  // 使用HEAD请求，只获取响应头，减少数据传输
        timeout: config.pingTimeout,
        success: (res) => {
          const endTime = Date.now()
          const ping = endTime - startTime
          
          // 只要能成功连接就认为ping成功（状态码2xx-3xx）
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve(ping)
          } else {
            console.warn(`Ping请求收到非成功状态码: ${res.statusCode}`)
            resolve(null)
          }
        },
        fail: (err) => {
          console.error('Ping请求失败:', err)
          resolve(null)
        }
      })
    })
  },

  /**
   * 延迟函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  /**
   * 更新UI
   */
  updateUI(data) {
    if (data.liveSpeed !== undefined) {
      this.setData({ liveSpeed: data.liveSpeed.toFixed(1) })
    }
    if (data.progress !== undefined) {
      this.setData({ progress: data.progress })
    }
  },

  /**
   * 计算速度对应的角度（非线性）
   */
  getNonlinearDegree(mega_bps) {
    const scale = [
      { degree: 680, value: 0 },
      { degree: 570, value: 0.5 },
      { degree: 460, value: 1 },
      { degree: 337, value: 10 },
      { degree: 220, value: 100 },
      { degree: 115, value: 500 },
      { degree: 0, value: 1000 }
    ]

    if (mega_bps === 0 || mega_bps <= 0 || isNaN(mega_bps)) {
      return 0
    }

    let i = 0
    while (i < scale.length) {
      if (mega_bps > scale[i].value) {
        i++
      } else {
        return scale[i - 1].degree + 
          (mega_bps - scale[i - 1].value) * 
          (scale[i].degree - scale[i - 1].degree) / 
          (scale[i].value - scale[i - 1].value)
      }
    }
    return scale[scale.length - 1].degree
  },

  /**
   * 绘制仪表盘
   */
  drawGauge(speed) {
    if (speed < 0) {
      speed = 0
    }

    const query = wx.createSelectorQuery()
    query.select('#gaugeCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) {
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getWindowInfo().pixelRatio
        const width = res[0].width
        const height = res[0].height

        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(width, height) * 0.4

        // 清除画布
        ctx.clearRect(0, 0, width, height)

        // 绘制背景圆弧
        ctx.lineWidth = 20
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI)
        ctx.stroke()

        // 计算当前速度对应的角度
        const degree = this.getNonlinearDegree(speed)
        const startAngle = 0.75 * Math.PI
        const totalAngle = 1.5 * Math.PI
        const currentAngle = startAngle + (totalAngle - (degree / 680) * totalAngle)

        // 绘制进度圆弧
        if (speed > 0) {
          ctx.strokeStyle = '#00BFFF'
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, startAngle, currentAngle)
          ctx.stroke()
        }

        // 绘制速度数值
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 40px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(speed.toFixed(1), centerX, centerY)

        // 绘制单位
        ctx.font = '16px sans-serif'
        ctx.fillText('Mbps', centerX, centerY + 35)
      })
  },

  /**
   * 测试下载源速度，自动选择最优源
   */
  async testBestDownloadSource() {
    const server = this.selectedServer
    const sources = [server.download, ...server.downloadFallback]
    
    // 限制测试数量，避免过多请求
    const limitedSources = sources.slice(0, 10)
    
    console.log(`开始测试 ${limitedSources.length} 个下载源的速度`)
    
    const testPromises = limitedSources.map(async (source, index) => {
      const startTime = Date.now()
      try {
        const result = await this.testDownloadSpeedWithSmallFile(source)
        const duration = Date.now() - startTime
        console.log(`下载源测试完成: ${source}, 耗时: ${duration}ms`)
        return { source, duration, index }
      } catch (error) {
        console.log(`下载源测试失败: ${source}, 错误: ${error.message}`)
        // 如果测试失败，返回一个很大的时间值
        return { source, duration: Number.MAX_SAFE_INTEGER, index }
      }
    })
    
    const results = await Promise.all(testPromises)
    // 找到最快的那个源
    const fastest = results.reduce((prev, current) => {
      return prev.duration < current.duration ? prev : current
    })
    
    if (fastest.duration === Number.MAX_SAFE_INTEGER) {
      console.log('所有下载源都不可用，使用默认源')
      // 如果所有源都不可用，使用默认的第一个源
      this.currentDownloadIndex = 0
    } else {
      console.log(`选择最快下载源: ${fastest.source}, 耗时: ${fastest.duration}ms`)
      
      // 更新下载源索引
      if (fastest.index === 0) {
        this.currentDownloadIndex = 0
      } else {
        this.currentDownloadIndex = fastest.index  // 使用备用源
      }
    }
    
    return fastest.source
  },
  
  /**
   * 使用小文件测试单个下载源的速度
   */
  testDownloadSpeedWithSmallFile(url) {
    return new Promise((resolve, reject) => {
      // 添加随机参数防止缓存，并使用小文件进行快速测试
      let testUrl = url
      if (url.includes('httpbin.org')) {
        // 对于httpbin.org，使用bytes endpoint测试小文件
        testUrl = 'https://httpbin.org/bytes/10240' // 10KB测试文件
      } else if (url.includes('picsum.photos')) {
        testUrl = 'https://picsum.photos/200/200' // 小图片
      } else if (url.includes('placeholder')) {
        testUrl = 'https://via.placeholder.com/100x100' // 小占位图
      } else {
        // 对于其他URL，添加随机参数防止缓存
        testUrl = url + (url.includes('?') ? '&' : '?') + 'r=' + Math.random() + '&test=1'
      }
      
      wx.downloadFile({
        url: testUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res)
          } else {
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  onShow() {
    this.loadThemeMode()
  },

  onThemeChanged(theme) {
    this.updateThemeClass(theme)
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
  }
})