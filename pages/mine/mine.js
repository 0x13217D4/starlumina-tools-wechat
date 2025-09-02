
const defaultAvatarUrl = '/images/user.png'

Page({
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 我的',
      imageUrl: '/images/mine.png'
    }
  },
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      gender: 0,
      birthday: ''
    },
    defaultAvatarUrl: defaultAvatarUrl,
    genderText: ['未知', '男', '女']
  },

  onLoad() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  editProfile() {
    wx.navigateTo({
      url: '/pages/mine/edit/edit',
      success: (res) => {
        res.eventChannel.emit('sendUserInfo', this.data.userInfo)
      }
    })
  },

  aboutApp() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    })
    this.saveUserInfo()
  },

  saveUserInfo() {
    wx.setStorageSync('userInfo', this.data.userInfo)
  },
  
  onShareAppMessage: function() {
    return {
      title: '个人中心',
      path: '/pages/mine/mine',
      imageUrl: this.data.userInfo.avatarUrl || '/images/user.png'
    }
  }
})
