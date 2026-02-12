/**
 * 用户认证工具类
 */

/**
 * 检查用户是否已登录
 * @returns {Boolean} 是否已登录
 */
function checkIsLoggedIn() {
  const userInfo = wx.getStorageSync('userInfo')
  const token = wx.getStorageSync('token')
  return !!(userInfo && token)
}

/**
 * 获取用户信息
 * @returns {Object} 用户信息
 */
function getUserInfo() {
  return wx.getStorageSync('userInfo') || null
}

/**
 * 获取登录token
 * @returns {String} 登录token
 */
function getToken() {
  return wx.getStorageSync('token') || null
}

/**
 * 检查session_key是否过期
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */
function checkSession(success, fail) {
  wx.checkSession({
    success: () => {
      if (success) success()
    },
    fail: () => {
      if (fail) fail()
    }
  })
}

/**
 * 执行登录
 * @param {Object} userInfo 用户信息
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */
function login(userInfo, success, fail) {
  wx.login({
    success: (res) => {
      if (res.code) {
        // 这里应该将 code 发送到后台服务器换取 openid 和 session_key
        // 由于没有后台服务器，直接模拟登录成功
        mockLoginSuccess(userInfo, res.code, success)
      } else {
        console.log('登录失败：' + res.errMsg)
        if (fail) fail(res.errMsg)
      }
    },
    fail: (err) => {
      console.error('wx.login 调用失败：', err)
      if (fail) fail(err.errMsg)
    }
  })
}

/**
 * 模拟登录成功（实际项目应该调用后台接口）
 * @param {Object} userInfo 用户信息
 * @param {String} code 登录凭证
 * @param {Function} callback 回调函数
 */
function mockLoginSuccess(userInfo, code, callback) {
  const userData = {
    avatarUrl: userInfo.avatarUrl,
    nickName: userInfo.nickName,
    gender: userInfo.gender || 0,
    birthday: ''
  }

  wx.setStorageSync('userInfo', userData)
  wx.setStorageSync('token', 'mock_token_' + Date.now())
  wx.setStorageSync('loginTime', Date.now())

  if (callback) callback(userData)
}

/**
 * 退出登录
 */
function logout() {
  wx.removeStorageSync('userInfo')
  wx.removeStorageSync('token')
  wx.removeStorageSync('loginTime')
}

module.exports = {
  checkIsLoggedIn,
  getUserInfo,
  getToken,
  checkSession,
  login,
  logout
}