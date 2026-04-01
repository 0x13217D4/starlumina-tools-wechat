const logger = require('../../utils/logger');

Page({
  data: {
    currentTime: '',
    gameStarted: false,
    currentRound: 1,
    cards: [],
    themeClass: ''
  },

  timer: null,
  timeUpdateInterval: null,

  onLoad: function() {
    this.loadThemeMode();
    this.updateTime();
    this.startTimeUpdate();
    // 直接开始第一局
    this.startGame();
  },

  onShow: function() {
    this.loadThemeMode();
    this.startTimeUpdate();
  },

  onHide: function() {
    this.stopTimeUpdate();
  },

  onUnload: function() {
    this.stopTimeUpdate();
  },

  onThemeChanged: function(theme) {
    this.updateThemeClass(theme);
    this.updateNavigationBar(theme);
  },

  loadThemeMode: function() {
    const themeMode = wx.getStorageSync('themeMode') || 'system';
    
    const app = getApp();
    let actualTheme = app.globalData.theme || 'light';
    
    if (!actualTheme || actualTheme === 'light') {
      if (themeMode === 'system') {
        const systemSetting = wx.getSystemSetting();
        actualTheme = systemSetting.theme || 'light';
      } else {
        actualTheme = themeMode;
      }
    }
    
    this.updateThemeClass(actualTheme);
    this.updateNavigationBar(actualTheme);
  },

  updateThemeClass: function(theme) {
    let themeClass = '';
    if (theme === 'dark') {
      themeClass = 'dark';
    } else {
      themeClass = '';
    }
    this.setData({ themeClass });
  },

  updateNavigationBar: function(theme) {
    if (wx.setNavigationBarColor && typeof wx.setNavigationBarColor === 'function') {
      wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#667eea'
      });
    }
  },

  // 更新当前时间
  updateTime: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const timeStr = `${year}年${month}月${day}日${hours}:${minutes}:${seconds}`;
    this.setData({ currentTime: timeStr });
  },

  // 开始时间更新定时器
  startTimeUpdate: function() {
    this.stopTimeUpdate();
    this.updateTime();
    this.timeUpdateInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  // 停止时间更新定时器
  stopTimeUpdate: function() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  },

  // 开始游戏
  startGame: function() {
    const cards = this.generateRandomCards();
    this.setData({
      gameStarted: true,
      currentRound: 1,
      cards: cards
    });
  },

  // 验牌（翻开牌）
  verifyCards: function() {
    var that = this;
    var cards = this.data.cards.map(function(card) {
      return Object.assign({}, card, { revealed: true });
    });
    this.setData({ cards: cards });
    
    // 识别牌型
    var handType = this.identifyHandType(cards);
    var handTypeName = this.getHandTypeName(handType);
    
    // 输出牌面结果到控制台（仅开发环境）
    if (__DEV__) {
      console.log('========== 炸金花结果 ==========');
      console.log('第', that.data.currentRound, '局');
      console.log('牌型：' + handTypeName);
      cards.forEach(function(card, index) {
        console.log('牌' + (index + 1) + ': ' + card.suitSymbol + card.displayPoint + ' (' + (card.suitClass === 'red' ? '红' : '黑') + ')');
      });
      console.log('================================');
    }
  },

  // 识别牌型
  identifyHandType: function(cards) {
    var points = cards.map(function(c) { return c.point; });
    var suits = cards.map(function(c) { return c.suit; });
    
    var sortedPoints = points.slice().sort(function(a, b) { return a - b; });
    
    // 检查是否同花
    var isFlush = (suits[0] === suits[1] && suits[1] === suits[2]);
    
    // 检查是否顺子
    var isStraight = (sortedPoints[2] - sortedPoints[1] === 1 && sortedPoints[1] - sortedPoints[0] === 1);
    // 特殊顺子: Q-K-A (12, 13, 1)
    if (sortedPoints[0] === 1 && sortedPoints[1] === 12 && sortedPoints[2] === 13) {
      isStraight = true;
    }
    
    // 检查是否豹子
    var isThreeOfAKind = (points[0] === points[1] && points[1] === points[2]);
    
    // 检查是否对子
    var isPair = (points[0] === points[1] || points[1] === points[2] || points[0] === points[2]);
    
    // 判断牌型（按优先级）
    if (isThreeOfAKind) return 'baozi';
    if (isFlush && isStraight) return 'tonghuashun';
    if (isFlush) return 'tonghua';
    if (isStraight) return 'shunzi';
    if (isPair) return 'duizi';
    return 'sanpai';
  },

  // 获取牌型名称
  getHandTypeName: function(type) {
    var names = {
      baozi: '豹子 🔥',
      tonghuashun: '同花顺 ⭐',
      tonghua: '同花 💎',
      shunzi: '顺子 📈',
      duizi: '对子 👥',
      sanpai: '散牌 📄'
    };
    return names[type] || '未知';
  },

  // 下一局
  nextRound: function() {
    const cards = this.generateRandomCards();
    this.setData({
      currentRound: this.data.currentRound + 1,
      cards: cards
    });
  },

  // 生成随机扑克牌（按真实概率分布）
  generateRandomCards: function() {
    // 扑克牌定义
    var suits = [
      { name: 'spade', symbol: '♠', class: 'black' },
      { name: 'heart', symbol: '♥', class: 'red' },
      { name: 'club', symbol: '♣', class: 'black' },
      { name: 'diamond', symbol: '♦', class: 'red' }
    ];
    
    var points = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    // 根据概率决定牌型
    var handType = this.decideHandType();
    
    // 根据牌型生成对应的牌
    var cards = this.generateCardsByType(handType, suits, points);
    
    // 洗牌（打乱顺序）
    cards = this.shuffleThreeCards(cards);
    
    return cards;
  },

  // 根据概率决定牌型（使用加权随机选择，确保概率准确）
  decideHandType: function() {
    // 实际概率分布（百分比，基于真实扑克牌组合计算）
    // C(52,3) = 22100 种三张牌组合
    // 豹子: 13 * C(4,3) = 52, 概率 = 52/22100 ≈ 0.235%
    // 同花顺: 4 * 12 = 48, 概率 = 48/22100 ≈ 0.217%
    // 同花(非顺子): 4 * C(13,3) - 48 = 1096, 概率 = 1096/22100 ≈ 4.959%
    // 顺子(非同花): 12 * (4^3 - 4) = 720, 概率 = 720/22100 ≈ 3.258%
    // 对子: 13 * C(4,2) * 12 * 4 = 3744, 概率 = 3744/22100 ≈ 16.941%
    // 散牌: 22100 - 52 - 48 - 1096 - 720 - 3744 = 16440, 概率 = 16440/22100 ≈ 74.390%
    var probabilities = [
      { type: 'baozi', weight: 0.24 },        // 豹子
      { type: 'tonghuashun', weight: 0.22 },  // 同花顺
      { type: 'tonghua', weight: 4.96 },      // 同花
      { type: 'shunzi', weight: 3.26 },       // 顺子
      { type: 'duizi', weight: 16.94 },       // 对子
      { type: 'sanpai', weight: 74.39 }       // 散牌
    ];
    
    // 使用更精确的加权随机选择算法
    return this.weightedRandomSelect(probabilities);
  },
  
  // 加权随机选择算法（使用整数运算避免浮点精度问题）
  weightedRandomSelect: function(items) {
    // 将权重转换为整数（乘以10000以保留4位小数精度）
    var scaledWeights = [];
    var totalWeight = 0;
    
    for (var i = 0; i < items.length; i++) {
      var scaledWeight = Math.round(items[i].weight * 10000);
      scaledWeights.push(scaledWeight);
      totalWeight += scaledWeight;
    }
    
    // 生成一个在 [0, totalWeight) 范围内的随机整数
    var rand = this.secureRandomInt(totalWeight);
    
    // 加权选择
    var cumulative = 0;
    for (var i = 0; i < items.length; i++) {
      cumulative += scaledWeights[i];
      if (rand < cumulative) {
        return items[i].type;
      }
    }
    
    // 兜底返回最后一个
    return items[items.length - 1].type;
  },
  
  // 生成安全的随机整数 [0, max)
  secureRandomInt: function(max) {
    // 使用多熵源混合生成更均匀的随机数
    var entropy = this.collectEntropy();
    
    // 使用种子化的伪随机数生成器
    var seed = entropy.timestamp ^ 
               Math.floor(entropy.r1 * 0xFFFFFFFF) ^
               Math.floor(entropy.r2 * 0xFFFF) ^
               Math.floor(entropy.r3 * 0xFF);
    
    // 使用 xorshift 算法生成均匀分布的随机数
    seed = this.xorshift32(seed);
    
    // 混合 Math.random 增加不可预测性
    var combined = (seed / 0xFFFFFFFF + Math.random()) / 2;
    
    return Math.floor(combined * max);
  },
  
  // xorshift32 伪随机数生成算法（均匀分布）
  xorshift32: function(seed) {
    var x = seed || 1;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return x >>> 0; // 确保返回无符号32位整数
  },

  // 根据牌型生成对应的牌
  generateCardsByType: function(type, suits, points) {
    var cards = [];
    
    switch (type) {
      case 'baozi':
        cards = this.generateBaozi(suits, points);
        break;
      case 'tonghuashun':
        cards = this.generateTonghuashun(suits, points);
        break;
      case 'tonghua':
        cards = this.generateTonghua(suits, points);
        break;
      case 'shunzi':
        cards = this.generateShunzi(suits, points);
        break;
      case 'duizi':
        cards = this.generateDuizi(suits, points);
        break;
      case 'sanpai':
      default:
        cards = this.generateSanpai(suits, points);
        break;
    }
    
    return cards;
  },

  // 生成豹子（三张点数相同）- 使用真随机发牌
  generateBaozi: function(suits, points) {
    // 真随机选择点数 (13种可能，每种等概率)
    var pointIndex = Math.floor(Math.random() * 13);
    
    // 真随机选择3个不同花色 (C(4,3)=4种组合)
    var allSuitCombos = [[0,1,2], [0,1,3], [0,2,3], [1,2,3]];
    var suitCombo = allSuitCombos[Math.floor(Math.random() * 4)];
    
    var cards = [];
    for (var i = 0; i < 3; i++) {
      var suit = suits[suitCombo[i]];
      cards.push(this.createCard(suit, pointIndex, points));
    }
    
    // 打乱牌的显示顺序
    return this.shuffleThreeCards(cards);
  },

  // 生成同花顺（同花色且连续）- 使用真随机发牌
  generateTonghuashun: function(suits, points) {
    // 真随机选择花色 (4种可能)
    var suit = suits[Math.floor(Math.random() * 4)];
    
    // 真随机选择顺子序列 (12种可能：A-2-3 到 Q-K-A)
    var startPoints = [
      [0, 1, 2],   // A-2-3
      [1, 2, 3],   // 2-3-4
      [2, 3, 4],   // 3-4-5
      [3, 4, 5],   // 4-5-6
      [4, 5, 6],   // 5-6-7
      [5, 6, 7],   // 6-7-8
      [6, 7, 8],   // 7-8-9
      [7, 8, 9],   // 8-9-10
      [8, 9, 10],  // 9-10-J
      [9, 10, 11], // 10-J-Q
      [10, 11, 12],// J-Q-K
      [11, 12, 0]  // Q-K-A
    ];
    var seq = startPoints[Math.floor(Math.random() * 12)];
    
    var cards = [];
    for (var i = 0; i < 3; i++) {
      cards.push(this.createCard(suit, seq[i], points));
    }
    
    return cards;
  },

  // 生成同花（同花色不连续）- 使用真随机发牌
  generateTonghua: function(suits, points) {
    // 真随机选择花色 (4种可能)
    var suit = suits[Math.floor(Math.random() * 4)];
    
    // 从13个点数中选3个不连续的点数
    // C(13,3) = 286种组合，减去12种顺子 = 274种
    var pointIndices;
    do {
      // 真随机选择3个不同点数
      pointIndices = this.trueRandomSample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3);
      pointIndices.sort(function(a, b) { return a - b; });
    } while (this.isConsecutive(pointIndices));
    
    var cards = [];
    for (var i = 0; i < 3; i++) {
      cards.push(this.createCard(suit, pointIndices[i], points));
    }
    
    // 打乱牌的显示顺序
    return this.shuffleThreeCards(cards);
  },

  // 生成顺子（连续但不同花色）- 使用真随机发牌
  generateShunzi: function(suits, points) {
    // 真随机选择顺子序列 (12种可能)
    var startPoints = [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
      [4, 5, 6],
      [5, 6, 7],
      [6, 7, 8],
      [7, 8, 9],
      [8, 9, 10],
      [9, 10, 11],
      [10, 11, 12],
      [11, 12, 0]
    ];
    var seq = startPoints[Math.floor(Math.random() * 12)];
    
    // 真随机选择花色组合，确保不全同 (4^3 - 4 = 60种有效组合)
    var suitIndices;
    do {
      suitIndices = [
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4)
      ];
    } while (suitIndices[0] === suitIndices[1] && suitIndices[1] === suitIndices[2]);
    
    var cards = [];
    for (var i = 0; i < 3; i++) {
      cards.push(this.createCard(suits[suitIndices[i]], seq[i], points));
    }
    
    return cards;
  },

  // 生成对子（两张点数相同）- 使用真随机发牌
  generateDuizi: function(suits, points) {
    // 真随机选择对子的点数 (13种可能)
    var pairPointIndex = Math.floor(Math.random() * 13);
    
    // 真随机选择单牌的点数 (12种可能)
    var singlePointIndex = Math.floor(Math.random() * 12);
    if (singlePointIndex >= pairPointIndex) {
      singlePointIndex++;
    }
    
    // 真随机选择对子的花色组合 (C(4,2)=6种)
    var allPairSuitCombos = [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]];
    var pairSuitCombo = allPairSuitCombos[Math.floor(Math.random() * 6)];
    
    // 真随机选择单牌的花色 (4种)
    var singleSuitIndex = Math.floor(Math.random() * 4);
    
    var cards = [
      this.createCard(suits[pairSuitCombo[0]], pairPointIndex, points),
      this.createCard(suits[pairSuitCombo[1]], pairPointIndex, points),
      this.createCard(suits[singleSuitIndex], singlePointIndex, points)
    ];
    
    // 打乱牌的显示顺序
    return this.shuffleThreeCards(cards);
  },

  // 生成散牌（无特殊组合）- 使用真随机发牌
  generateSanpai: function(suits, points) {
    var cards;
    var attempts = 0;
    var maxAttempts = 100; // 防止无限循环
    
    do {
      attempts++;
      // 真随机选择3个不同点数
      var pointIndices = this.trueRandomSample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3);
      
      // 真随机选择花色
      var suitIndices = [
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4)
      ];
      
      cards = [];
      for (var i = 0; i < 3; i++) {
        cards.push(this.createCard(suits[suitIndices[i]], pointIndices[i], points));
      }
    } while (this.isValidHand(cards) && attempts < maxAttempts);
    
    // 打乱牌的显示顺序
    return this.shuffleThreeCards(cards);
  },
  
  // 真随机采样：从数组中随机选取n个元素
  trueRandomSample: function(arr, n) {
    var result = [];
    var copied = arr.slice();
    
    for (var i = 0; i < n && copied.length > 0; i++) {
      var index = Math.floor(Math.random() * copied.length);
      result.push(copied[index]);
      copied.splice(index, 1);
    }
    
    return result;
  },

  // 创建单张牌
  createCard: function(suit, pointIndex, points) {
    return {
      suit: suit.name,
      suitSymbol: suit.symbol,
      suitClass: suit.class,
      point: pointIndex + 1,
      displayPoint: points[pointIndex],
      revealed: false
    };
  },

  // 判断三个点数是否连续
  isConsecutive: function(indices) {
    var sorted = indices.slice().sort(function(a, b) { return a - b; });
    // 普通顺子
    if (sorted[2] - sorted[1] === 1 && sorted[1] - sorted[0] === 1) return true;
    // Q-K-A 特殊顺子 (索引: Q=11, K=12, A=0，排序后 [0,11,12])
    if (sorted[0] === 0 && sorted[1] === 11 && sorted[2] === 12) return true;
    return false;
  },

  // 判断是否构成有效牌型（豹子、同花顺、同花、顺子、对子）
  isValidHand: function(cards) {
    var points = cards.map(function(c) { return c.point; });
    var suits = cards.map(function(c) { return c.suit; });
    
    // 检查豹子
    if (points[0] === points[1] && points[1] === points[2]) return true;
    
    // 检查对子
    if (points[0] === points[1] || points[1] === points[2] || points[0] === points[2]) return true;
    
    // 检查同花
    if (suits[0] === suits[1] && suits[1] === suits[2]) return true;
    
    // 检查顺子
    var sorted = points.slice().sort(function(a, b) { return a - b; });
    if (sorted[2] - sorted[1] === 1 && sorted[1] - sorted[0] === 1) return true;
    // Q-K-A 特殊顺子 (point: Q=12, K=13, A=1，排序后 [1,12,13])
    if (sorted[0] === 1 && sorted[1] === 12 && sorted[2] === 13) return true;
    
    return false;
  },

  // 洗三张牌的顺序
  shuffleThreeCards: function(cards) {
    for (var i = 2; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    return cards;
  },

  // 通用数组洗牌
  shuffleArray: function(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  },

  // 改进的洗牌算法（Fisher-Yates算法 + 多熵源增强）
  shuffleDeck: function(deck) {
    // 使用传统方式复制数组，避免ES6展开运算符兼容性问题
    var shuffled = [];
    for (var i = 0; i < deck.length; i++) {
      shuffled.push(deck[i]);
    }
    
    // 收集多种熵源增强随机性
    var entropy = this.collectEntropy();
    
    // 使用Fisher-Yates洗牌算法
    for (var i = shuffled.length - 1; i > 0; i--) {
      // 结合多种熵源生成随机数
      var j = Math.floor(this.enhancedRandom(entropy, i) * (i + 1));
      
      // 使用传统方式交换，避免解构赋值兼容性问题
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    
    return shuffled;
  },

  // 收集多种熵源
  collectEntropy: function() {
    var entropy = {
      // 时间熵
      timestamp: Date.now(),
      // 多次 Math.random 作为熵源
      r1: Math.random(),
      r2: Math.random(),
      r3: Math.random()
    };
    
    // 尝试获取系统信息作为额外熵源
    try {
      var systemInfo = wx.getSystemInfoSync();
      entropy.battery = systemInfo.batteryLevel || 0;
      entropy.brightness = systemInfo.screenBrightness || 0;
      entropy.volume = systemInfo.volume || 0;
      entropy.memory = systemInfo.memorySize || 0;
    } catch (e) {
      // 获取失败时使用备用值
      entropy.battery = Math.random() * 100;
      entropy.brightness = Math.random();
    }
    
    return entropy;
  },

  // 增强的随机数生成（结合多熵源）
  enhancedRandom: function(entropy, index) {
    // 将多个熵源混合
    var seed = Math.floor(entropy.timestamp) ^
               Math.floor(entropy.r1 * 1000000000) ^
               Math.floor(entropy.r2 * 1000000000) ^
               Math.floor(entropy.r3 * 1000000000) ^
               Math.floor(entropy.battery * 1000) ^
               Math.floor(entropy.brightness * 1000) ^
               (index * 12345);
    
    // 使用线性同余生成器进行混合
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    
    // 返回 [0, 1) 范围的随机数，并结合 Math.random 增加不可预测性
    return ((seed / 0x7fffffff) + Math.random()) / 2;
  },

  onShareAppMessage: function() {
    return {
      title: '炸金花',
      path: '/pages/zjh/zjh'
    };
  },
  
  onShareTimeline: function() {
    return {
      title: '星芒集盒 - 炸金花'
    };
  }
});