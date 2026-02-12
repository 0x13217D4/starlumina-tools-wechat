const defaultAvatarUrl = '/images/user.png'

Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      gender: 0, // 0-保密 1-男 2-女
      birthday: ''
    },
    genderRange: ['保密', '男', '女'],
    defaultAvatarUrl: defaultAvatarUrl,
    currentDate: new Date().toISOString().split('T')[0],
    eventChannel: null,  // 存储事件通道引用
    themeClass: ''  // 主题类名
  },

  onLoad(options) {
    // 优先从本地存储加载用户信息（登录后的微信信息）
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }

    // 同时保留事件通道，用于其他场景传递数据
    const eventChannel = this.getOpenerEventChannel()
    this.setData({ eventChannel })
    eventChannel.on('sendUserInfo', (data) => {
      this.setData({ userInfo: data })
    })

    this.loadThemeMode()
  },

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
  },

  onUnload() {
    // 清理事件通道监听器
    if (this.data.eventChannel) {
      this.data.eventChannel.off('sendUserInfo');
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    })
  },

  onNicknameChange(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    })
  },

  onGenderChange(e) {
    this.setData({
      'userInfo.gender': e.detail.value
    })
  },

  onBirthdayChange(e) {
    this.setData({
      'userInfo.birthday': e.detail.value
    })
  },

  saveProfile() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.setData({
      userInfo: this.data.userInfo
    })
    wx.setStorageSync('userInfo', this.data.userInfo)
    wx.navigateBack()
  },
  
  onShareAppMessage: function() {
    return {
      title: '编辑个人信息',
      path: '/pages/mine/edit/edit',
      imageUrl: '/images/user.png'
    }
  }
})
