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
    currentDate: new Date().toISOString().split('T')[0]
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendUserInfo', (data) => {
      this.setData({ userInfo: data })
    })
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