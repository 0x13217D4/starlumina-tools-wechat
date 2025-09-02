const tools = [
  {
    category: '查询测评',
    tools: [
      {
        name: '身份证核验',
        path: '/pages/id-verify/id-verify'
      },
      {
        name: 'MBTI性格测试',
        path: '/pages/mbti/mbti'
      },
      {
        name: '心理测评量表',
        path: '/pages/psychology-test/psychology-test'
      }
    ]
  },
  {
    category: '二维码/条码',
    tools: [
      {
        name: '条码生成器',
        path: '/pages/barcode/barcode'
      },
      {
        name: '二维码生成器',
        path: '/pages/qrcode/qrcode'
      },
      {
        name: '扫一扫',
        path: 'pages/scan/scan'
      }
    ]
  },
  {
    category: '设备测试',
    tools: [
      {
        name: '设备信息',
        path: '/pages/deviceinfo/deviceinfo',
    getDeviceInfo: function() {
      const that = this;
      wx.getSystemInfo({
        success: function(res) {
          wx.getSetting({
            success: (authRes) => {
              const deviceInfo = {
                ...res,
                albumAuthorized: authRes.authSetting['scope.writePhotosAlbum'],
                cameraAuthorized: authRes.authSetting['scope.camera'],
                locationAuthorized: authRes.authSetting['scope.userLocation'],
                microphoneAuthorized: authRes.authSetting['scope.record']
              };
              
              wx.navigateTo({
                url: '/pages/deviceinfo/deviceinfo',
                success: function(res) {
                  res.eventChannel.emit('acceptDeviceInfo', deviceInfo);
                }
              });
            }
          });
        }
      });
    }
  },
      {
        name: '屏幕显示测试',
        path: 'pages/screentest/screentest'
      },
      {
        name: '多指触控测试',
        path: 'pages/multitouch/multitouch'
      }
    ]
  },
  {
    category: '转换工具',
    tools: [
      {
        name: '随机数生成',
        path: 'pages/random/random'
      },
      {
        name: '进制转换器',
        path: 'pages/converter/converter'
      },
      {
        name: '单位转换器',
        path: 'pages/unit-converter/unit-converter'
      }
    ]
  }
]

Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 实用工具集',
      imageUrl: '/images/tools.png'
    }
  },
  data: {
    toolCategories: tools
  },

  navigateToTool(e) {
    const categoryIndex = e.currentTarget.dataset.categoryIndex
    const toolIndex = e.currentTarget.dataset.toolIndex
    const tool = this.data.toolCategories[categoryIndex].tools[toolIndex]
    
    if (tool.getDeviceInfo) {
      tool.getDeviceInfo()
    } else {
      // 确保路径以/开头
      const path = tool.path.startsWith('/') ? tool.path : `/${tool.path}`
      wx.navigateTo({
        url: path,
        success: () => console.log('导航成功:', path),
        fail: (err) => {
          console.error('导航失败:', err)
          wx.showToast({
            title: '无法打开页面',
            icon: 'none'
          })
        }
      })
    }
  },
  
  onShareAppMessage: function() {
    return {
      title: '星芒集盒 - 实用工具集合',
      path: '/pages/tools/tools',
      imageUrl: '/images/logo.jpg'
    }
  }
})