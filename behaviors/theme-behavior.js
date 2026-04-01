/**
 * 主题管理 Behavior
 * 统一处理小程序的主题切换逻辑，减少代码重复
 */

const logger = require('./logger');

module.exports = Behavior({
  /**
   * 组件的属性列表
   */
  properties: {
    // 可以接收外部传入的主题模式
    themeMode: {
      type: String,
      value: 'system'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    themeClass: '',
    themeMode: 'system',
    actualTheme: 'light'
  },

  /**
   * 生命周期方法
   */
  lifetimes: {
    attached() {
      // 页面加载时初始化主题
      this._initTheme();
    },
    
    detached() {
      // 页面卸载时清理（如果需要）
    }
  },

  /**
   * 页面生命周期方法
   */
  pageLifetimes: {
    show() {
      // 页面显示时更新主题
      this._updateTheme();
    }
  },

  /**
   * 方法列表
   */
  methods: {
    /**
     * 初始化主题
     * @private
     */
    _initTheme() {
      this.loadThemeMode();
    },

    /**
     * 加载主题模式
     * @public
     */
    loadThemeMode() {
      const themeMode = wx.getStorageSync('themeMode') || 'system';
      this.setData({ themeMode });
      
      // 获取实际的主题
      const actualTheme = this._getActualTheme(themeMode);
      this.setData({ actualTheme });
      
      // 更新页面主题类
      this.updateThemeClass(actualTheme);
      
      // 更新导航栏和 TabBar（可选）
      if (this.updateNavigationBarAndTabBar) {
        this.updateNavigationBarAndTabBar(actualTheme);
      } else if (this.updateNavigationBar) {
        this.updateNavigationBar(actualTheme);
      }
    },

    /**
     * 获取实际的主题
     * @private
     * @param {string} themeMode 主题模式
     * @returns {string} 实际主题（light 或 dark）
     */
    _getActualTheme(themeMode) {
      // 优先使用应用级别的当前主题
      const app = getApp();
      if (app.globalData && app.globalData.theme) {
        return app.globalData.theme;
      }
      
      // 如果应用级别没有主题信息，则按传统方式计算
      if (themeMode === 'system') {
        const systemSetting = wx.getSystemSetting();
        return systemSetting.theme || 'light';
      } else {
        return themeMode;
      }
    },

    /**
     * 更新主题类名
     * @public
     * @param {string} theme 主题（light 或 dark）
     */
    updateThemeClass(theme) {
      const themeClass = theme === 'dark' ? 'dark' : '';
      this.setData({ themeClass });
    },

    /**
     * 更新导航栏和 TabBar 样式
     * @public
     * @param {string} theme 主题（light 或 dark）
     */
    updateNavigationBarAndTabBar(theme) {
      // 设置导航栏
      if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
        wx.setNavigationBarColor({
          frontColor: theme === 'dark' ? '#ffffff' : '#000000',
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
        });
      }
      
      // 设置 TabBar
      if (wx.setTabBarStyle && typeof wx.setTabBarStyle === 'function') {
        wx.setTabBarStyle({
          color: theme === 'dark' ? '#999999' : '#666666',
          selectedColor: theme === 'dark' ? '#09e765' : '#07C160',
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderStyle: theme === 'dark' ? 'white' : 'black'
        });
      }
    },

    /**
     * 更新导航栏样式（简化版）
     * @public
     * @param {string} theme 主题（light 或 dark）
     */
    updateNavigationBar(theme) {
      if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
        wx.setNavigationBarColor({
          frontColor: theme === 'dark' ? '#ffffff' : '#000000',
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
        });
      }
    },

    /**
     * 主题变化时的回调（可由页面重写）
     * @public
     * @param {string} theme 新主题
     */
    onThemeChanged(theme) {
      // 默认实现：更新主题类
      this.updateThemeClass(theme);
      
      // 页面可以重写此方法来自定义行为
      if (typeof this._onThemeChanged === 'function') {
        this._onThemeChanged(theme);
      }
    },

    /**
     * 切换到指定主题模式
     * @public
     * @param {string} mode 主题模式（system, light, dark）
     */
    switchThemeMode(mode) {
      const app = getApp();
      
      // 保存主题设置
      wx.setStorageSync('themeMode', mode);
      
      // 调用应用级别的切换方法
      if (app.switchTheme) {
        app.switchTheme(mode);
      }
      
      // 更新当前页面主题
      this.loadThemeMode();
      
      // 生产环境减少日志输出
      if (__DEV__) {
        logger.info('主题已切换:', mode);
      }
    }
  }
});
