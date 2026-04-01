Page({
  onShareAppMessage() {
    return {
      title: '心理测评 - 星芒集盒',
      path: '/pages/psychology-test/psychology-test'
    }
  },
  onShareTimeline() {
    return {
      title: '心理测评 - 星芒集盒',
      path: '/pages/psychology-test/psychology-test'
    }
  },
  data: {
    scales: [
      {
        id: 'sas',
        name: '焦虑自评量表(SAS)',
        themeClass: '',
        description: '用于评估焦虑症状的严重程度',
        questionsCount: 20
      },
      {
        id: 'sds',
        name: '抑郁自评量表(SDS)',
        description: '用于评估抑郁症状的严重程度',
        questionsCount: 20
      },
      {
        id: 'scl90',
        name: '心理健康自评量表(SCL90)',
        description: '综合评估多种心理症状',
        questionsCount: 90
      },
      {
        id: 'bdi',
        name: 'Beck抑郁自评问卷(BDI)',
        description: '评估抑郁症状的严重程度',
        questionsCount: 21
      }
    ]
  },

  navigateToScale: function(e) {
    const scaleId = e.currentTarget.dataset.id;
    if (['sas', 'sds', 'scl90', 'bdi'].includes(scaleId)) {
      wx.navigateTo({
        url: `/pages/psychology-test/${scaleId}/${scaleId}`
      });
    } else {
      wx.showToast({
        title: '量表暂未开放',
        icon: 'none'
      });
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
    let actualTheme
    if (themeMode === 'system') {
      const systemSetting = wx.getSystemSetting()
      actualTheme = systemSetting.theme || 'light'
    } else {
      actualTheme = themeMode
    }
    
    // 合并 setData 调用，减少视图层更新次数
    this.updateThemeClass(actualTheme)
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
});