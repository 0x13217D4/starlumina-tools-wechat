/**
 * 权限服务模块
 * 封装权限管理相关逻辑
 */

class PermissionService {
  /**
   * 检查权限状态
   * @param {string} permissionKey 权限键名
   * @returns {Promise<string>} 权限状态描述
   */
  static async checkPermission(permissionKey) {
    const scope = this._getScopeByKey(permissionKey);
    if (!scope) return '未请求';

    const setting = await this._getAuthSetting();
    const status = setting[scope];
    
    return this._getStatusDescription(status);
  }

  /**
   * 请求权限
   * @param {string} permissionKey 权限键名
   * @returns {Promise<string>} 权限状态描述
   */
  static async requestPermission(permissionKey) {
    if (permissionKey === 'notificationAuthorized') {
      return this._handleNotificationPermission();
    }

    const scope = this._getScopeByKey(permissionKey);
    if (!scope) return '未请求';

    try {
      await this._authorize(scope);
      return '已授权';
    } catch (error) {
      return '未授权';
    }
  }

  /**
   * 获取授权设置
   * @private
   */
  static _getAuthSetting() {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => resolve(res.authSetting || {}),
        fail: () => resolve({})
      });
    });
  }

  /**
   * 授权
   * @private
   */
  static _authorize(scope) {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope,
        success: resolve,
        fail: reject
      });
    });
  }

  /**
   * 处理通知权限
   * @private
   */
  static _handleNotificationPermission() {
    return new Promise((resolve) => {
      wx.showModal({
        title: '通知权限说明',
        content: '小程序通知权限需要在微信设置中手动开启',
        showCancel: false,
        confirmText: '知道了'
      });
      resolve('未授权');
    });
  }

  /**
   * 根据权限键名获取scope
   * @private
   */
  static _getScopeByKey(permissionKey) {
    const scopeMap = {
      'albumAuthorized': 'scope.writePhotosAlbum',
      'cameraAuthorized': 'scope.camera',
      'locationAuthorized': 'scope.userLocation',
      'microphoneAuthorized': 'scope.record'
    };
    return scopeMap[permissionKey];
  }

  /**
   * 获取权限状态描述
   * @private
   */
  static _getStatusDescription(status) {
    const descriptions = {
      true: '已授权',
      false: '未授权',
      undefined: '未请求'
    };
    return descriptions[status] || '未知';
  }
}

module.exports = PermissionService;