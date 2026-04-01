Page({
  data: {
    canvasWidth: 300,
    canvasHeight: 300,
    boardSize: 15,
    cellSize: 20,
    board: [],
    currentPlayer: 1, // 1: 黑棋, 2: 白棋
    gameActive: false,
    gameMode: null, // 'pvp' 或 'pve'
    moveHistory: [],
    gameTime: 0,
    gameTimeFormatted: '00:00',
    timerInterval: null,
    gameStarted: false, // 是否已开始对局（第一颗落子）
    aiPlayer: 2,
    showModeModal: true,
    showFirstPlayerModal: false, // 先手/后手选择模态框
    showWinModal: false,
    winMessage: '',
    themeClass: '',
    currentModeText: '选择模式',
    statusText: '等待开始游戏',
    playerFirst: true // 玩家是否先手（仅在PVE模式下有效）
  },

  onLoad: function() {
    this.initGame();
  },

  onUnload: function() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }
    
    // 清理可能存在的setTimeout定时器
    // 注意：微信小程序中无法直接清理setTimeout，但页面卸载时会自动清理
  },

  // 初始化游戏
  initGame: function() {
    const board = Array(this.data.boardSize).fill().map(() => Array(this.data.boardSize).fill(0));
    
    this.setData({
      board: board,
      currentPlayer: 1,
      gameActive: false,        // 不直接激活游戏，等待选择先手/后手
      gameMode: 'pve',          // 默认人机对战
      moveHistory: [],
      gameTime: 0,
      gameTimeFormatted: '00:00',
      gameStarted: false,       // 重置对局开始状态
      showModeModal: false,     // 不显示模式选择弹窗
      showFirstPlayerModal: true, // 直接显示先手选择弹窗
      showWinModal: false,
      winMessage: '',
      currentModeText: '人机对战',
      statusText: '请选择先手',
      playerFirst: true         // 默认玩家先手
    });

    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }

    this.drawBoard();
  },

  // 绘制棋盘
  drawBoard: function() {
    const ctx = wx.createCanvasContext('gameCanvas', this);
    const { boardSize, cellSize } = this.data;
    
    // 使用统一的坐标计算方法确保一致性
    const position = this.calculateBoardPosition(0, 0);
    const offsetX = position.offsetX;
    const offsetY = position.offsetY;
    const boardWidth = position.boardWidth;
    

    // 清空画布
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

    // 绘制网格线
    ctx.setStrokeStyle('#8B5A2B');
    ctx.setLineWidth(1);

    for (let i = 0; i < boardSize; i++) {
      // 水平线
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * cellSize);
      ctx.lineTo(offsetX + boardWidth, offsetY + i * cellSize);
      ctx.stroke();

      // 垂直线
      ctx.beginPath();
      ctx.moveTo(offsetX + i * cellSize, offsetY);
      ctx.lineTo(offsetX + i * cellSize, offsetY + boardWidth);
      ctx.stroke();
    }

    // 绘制星位
    const starPoints = [
      {x: 3, y: 3}, {x: 3, y: 11}, {x: 7, y: 7}, 
      {x: 11, y: 3}, {x: 11, y: 11}
    ];

    ctx.setFillStyle('#8B5A2B');
    starPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(offsetX + point.x * cellSize, offsetY + point.y * cellSize, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 绘制棋子
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (this.data.board[i][j] !== 0) {
          this.drawPiece(ctx, i, j, this.data.board[i][j]);
        }
      }
    }

    ctx.draw();
  },

  // 绘制棋子
  drawPiece: function(ctx, row, col, player) {
    const { cellSize } = this.data;
    
    // 使用统一的坐标计算方法确保一致性
    const position = this.calculateBoardPosition(0, 0);
    const offsetX = position.offsetX;
    const offsetY = position.offsetY;
    const x = offsetX + col * cellSize;
    const y = offsetY + row * cellSize;
    

    // 棋子阴影
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.4 + 2, 0, Math.PI * 2);
    ctx.setFillStyle('rgba(0, 0, 0, 0.2)');
    ctx.fill();

    // 棋子本体
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.4, 0, Math.PI * 2);

    if (player === 1) {
      // 黑棋 - 使用简单的颜色填充
      ctx.setFillStyle('#000');
    } else {
      // 白棋 - 使用简单的颜色填充
      ctx.setFillStyle('#fff');
    }

    ctx.fill();

    // 棋子边缘
    ctx.setStrokeStyle(player === 1 ? '#333' : '#ccc');
    ctx.setLineWidth(1);
    ctx.stroke();
  },

  // 开始游戏
  startGame: function() {
    // 重置棋盘
    const board = Array(this.data.boardSize).fill().map(() => Array(this.data.boardSize).fill(0));
    
    let currentPlayer = 1; // 默认黑棋先手
    let aiPlayer = 2; // 默认AI执白
    
    if (this.data.playerFirst) {
      // 玩家先手，执黑棋
      currentPlayer = 1; // 黑棋先手
      aiPlayer = 2; // AI执白
    } else {
      // AI先手，执黑棋
      currentPlayer = 1; // 黑棋先手（AI）
      aiPlayer = 1; // AI执黑棋
    }
    
    this.setData({
      board: board,
      gameActive: true,
      currentPlayer: currentPlayer,
      aiPlayer: aiPlayer,
      moveHistory: [],
      gameTime: 0,
      showFirstPlayerModal: false,
      currentModeText: this.data.playerFirst ? '人机对战(你先手)' : '人机对战(AI先手)'
    });

    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }

    this.updateGameStatus();
    this.startTimer();
    this.drawBoard();

    // 如果AI先手，AI先走一步
    if (!this.data.playerFirst && this.data.gameMode === 'pve') {
      console.log('AI先手，即将落子', 'currentPlayer:', this.data.currentPlayer, 'aiPlayer:', this.data.aiPlayer);
      setTimeout(() => this.aiMove(), 1000);
    }
  },

  // 更新游戏状态
  updateGameStatus: function() {
    if (this.data.gameActive) {
      const playerName = this.data.currentPlayer === 1 ? '黑棋' : '白棋';
      this.setData({
        statusText: `游戏进行中 - ${playerName}回合`
      });
    }
  },

  // 开始计时
  startTimer: function() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }

    const timerInterval = setInterval(() => {
      const newTime = this.data.gameTime + 1;
      this.setData({
        gameTime: newTime,
        gameTimeFormatted: this.formatTime(newTime)
      });
    }, 1000);

    this.setData({ timerInterval });
  },

  // 停止计时
  stopTimer: function() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.setData({ timerInterval: null });
    }
  },

  // 处理点击事件
  onCanvasTap: function(e) {
    if (!this.data.gameActive) return;

    const { x, y } = e.detail;
    
    // 获取Canvas元素的实际位置和尺寸
    wx.createSelectorQuery()
      .in(this)
      .select('#gameCanvas')
      .boundingClientRect((rect) => {
        if (rect) {
          // 计算相对于Canvas的坐标
          const canvasX = x - rect.left;
          const canvasY = y - rect.top;
          
          // 使用新的精确坐标计算方法，并传入实际的Canvas尺寸
          const position = this.calculateBoardPosition(canvasX, canvasY, rect.width, rect.height);
          
          // 验证坐标是否在有效范围内且位置为空
          if (position.isValid && this.data.board[position.row][position.col] === 0) {
            this.makeMove(position.row, position.col);
          }
        }
      })
      .exec();
  },

  // 落子
  makeMove: function(row, col) {
    const newBoard = this.data.board.map(row => [...row]);
    newBoard[row][col] = this.data.currentPlayer;

    const newMoveHistory = [...this.data.moveHistory, {
      row, col, player: this.data.currentPlayer
    }];

    // 如果是第一颗落子，开始计时
    if (!this.data.gameStarted) {
      this.setData({ gameStarted: true });
      this.startTimer();
    }

    this.setData({
      board: newBoard,
      moveHistory: newMoveHistory
    });

    this.drawBoard();
    this.updateGameStatus();

    // 检查胜利
    if (this.checkWin(row, col, this.data.currentPlayer)) {
      this.endGame(this.data.currentPlayer);
      return;
    }

    // 检查平局
    if (this.checkDraw()) {
      this.endGame(null);
      return;
    }

    // 切换玩家
    const nextPlayer = this.data.currentPlayer === 1 ? 2 : 1;
    this.setData({ currentPlayer: nextPlayer });
    this.updateGameStatus();

    // AI回合 - 只有当切换后是AI的回合才执行
    if (this.data.gameMode === 'pve' && nextPlayer === this.data.aiPlayer && this.data.gameActive) {
      setTimeout(() => this.aiMove(), 500);
    }
  },

  // 检查胜利
  checkWin: function(row, col, player) {
    const directions = [
      [1, 0],   // 水平
      [0, 1],   // 垂直
      [1, 1],   // 对角线
      [1, -1]   // 反对角线
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      // 正向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;

        if (newRow < 0 || newRow >= this.data.boardSize || 
            newCol < 0 || newCol >= this.data.boardSize) {
          break;
        }

        if (this.data.board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      // 反向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dy;
        const newCol = col - i * dx;

        if (newRow < 0 || newRow >= this.data.boardSize || 
            newCol < 0 || newCol >= this.data.boardSize) {
          break;
        }

        if (this.data.board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 5) {
        return true;
      }
    }

    return false;
  },

  // 检查平局
  checkDraw: function() {
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (this.data.board[i][j] === 0) {
          return false;
        }
      }
    }
    return true;
  },

  // 游戏结束
  endGame: function(winner) {
    this.stopTimer();

    let winMessage = '';
    if (winner) {
      const winnerName = winner === 1 ? '黑棋' : '白棋';
      winMessage = `${winnerName}获胜!`;
    } else {
      winMessage = '平局!';
    }

    this.setData({
      gameActive: false,
      showWinModal: true,
      winMessage: winMessage
    });
  },

  // 悔棋
  undoMove: function() {
    if (this.data.moveHistory.length === 0 || !this.data.gameActive) return;

    const newMoveHistory = [...this.data.moveHistory];
    const lastMove = newMoveHistory.pop();

    const newBoard = this.data.board.map(row => [...row]);
    newBoard[lastMove.row][lastMove.col] = 0;

    // 如果是人机对战且是AI的回合，需要悔两步
    if (this.data.gameMode === 'pve' && lastMove.player === this.data.aiPlayer && newMoveHistory.length > 0) {
      const playerMove = newMoveHistory.pop();
      newBoard[playerMove.row][playerMove.col] = 0;
      this.setData({
        board: newBoard,
        moveHistory: newMoveHistory,
        currentPlayer: playerMove.player
      });
    } else {
      this.setData({
        board: newBoard,
        moveHistory: newMoveHistory,
        currentPlayer: lastMove.player
      });
    }

    this.drawBoard();
    this.updateGameStatus();
  },

  // AI智能策略 - 增强版
  aiMove: function() {
    if (!this.data.gameActive) return;

    const startTime = Date.now();
    const maxThinkTime = 4000; // 最大思考时间4秒
    
    try {
      // 第一层：开局库决策
      const openingMove = this.getOpeningMove(this.data.board, this.data.aiPlayer);
      if (openingMove) {
        console.log('AI使用开局库着法:', openingMove);
        this.makeMove(openingMove.row, openingMove.col);
        return;
      }

      // 第二层：关键威胁检测（必胜必防）
      const criticalMove = this.getCriticalMove(this.data.board, this.data.aiPlayer);
      if (criticalMove) {
        console.log('AI检测到关键威胁:', criticalMove);
        this.makeMove(criticalMove.row, criticalMove.col);
        return;
      }

      // 第二层半：快速评估最优着法（如果时间充裕）
      const quickMove = this.getQuickBestMove(this.data.board, this.data.aiPlayer);
      const currentTime = Date.now();
      if (quickMove && (currentTime - startTime) < 1000) { // 如果快速评估时间少于1秒
        console.log('AI使用快速评估着法:', quickMove);
        this.makeMove(quickMove.row, quickMove.col);
        return;
      }

      // 第三层：Minimax深度搜索
      const depth = this.getSearchDepth();
      console.log('AI开始深度搜索，深度:', depth);
      
      const result = this.minimax(
        this.data.board, 
        depth, 
        -Infinity, 
        Infinity, 
        true, 
        this.data.aiPlayer,
        startTime
      );

      // 检查搜索是否超时或异常
      const thinkTime = Date.now() - startTime;
      if (thinkTime > maxThinkTime) {
        console.warn('AI搜索超时，使用回退策略');
        this.fallbackMove();
        return;
      }

      if (result && result.move) {
        console.log('AI通过深度搜索选择着法:', result.move, '得分:', result.score);
        this.makeMove(result.move.row, result.move.col);
      } else {
        console.warn('AI搜索无结果，使用回退策略');
        this.fallbackMove();
      }

    } catch (error) {
      console.error('AI决策出错:', error);
      this.fallbackMove();
    }
  },

  // 快速评估最佳着法
  getQuickBestMove: function(board, player) {
    const candidates = [];
    
    // 收集所有可能的着法
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0 && this.hasNeighbor(board, i, j, 2)) {
          const score = this.evaluatePosition(i, j, player);
          candidates.push({ row: i, col: j, score });
        }
      }
    }
    
    if (candidates.length > 0) {
      // 选择得分最高的位置
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0];
    }
    
    return null;
  },

  // 获取关键着法（必胜必防）
  getCriticalMove: function(board, player) {
    const opponent = player === 1 ? 2 : 1;
    
    // 检查必胜机会
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          const threat = this.getThreatLevel(board, i, j, player);
          if (threat >= 100000) { // 必胜
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 检查必防位置
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = opponent;
          const threat = this.getThreatLevel(tempBoard, i, j, opponent);
          if (threat >= 100000) { // 对手必胜，必须防守
            return { row: i, col: j };
          }
        }
      }
    }
    
    return null;
  },

  // 回退策略（简单但可靠的着法选择）
  fallbackMove: function() {
    try {
      const candidates = [];
      
      // 收集所有可能的着法
      for (let i = 0; i < this.data.boardSize; i++) {
        for (let j = 0; j < this.data.boardSize; j++) {
          if (this.data.board[i][j] === 0 && this.hasNeighbor(this.data.board, i, j, 2)) {
            const score = this.evaluatePosition(i, j, this.data.aiPlayer);
            candidates.push({ row: i, col: j, score });
          }
        }
      }
      
      if (candidates.length > 0) {
        // 选择得分最高的位置
        candidates.sort((a, b) => b.score - a.score);
        const bestMove = candidates[0];
        console.log('AI使用回退策略选择着法:', bestMove);
        this.makeMove(bestMove.row, bestMove.col);
      } else {
        // 如果没有候选位置，选择第一个空位
        for (let i = 0; i < this.data.boardSize; i++) {
          for (let j = 0; j < this.data.boardSize; j++) {
            if (this.data.board[i][j] === 0) {
              console.log('AI选择第一个空位:', { row: i, col: j });
              this.makeMove(i, j);
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('回退策略也失败:', error);
    }
  },

  // 获取搜索深度（优化版）
  getSearchDepth: function() {
    const moveCount = this.countMoves(this.data.board);
    
    // 根据游戏阶段和棋子密度动态调整
    if (moveCount < 8) return 5;  // 早期可以深度搜索
    if (moveCount < 20) return 4;  // 中前期
    if (moveCount < 40) return 4;  // 中期
    if (moveCount < 60) return 3;  // 中后期
    return 3;  // 残局保证响应速度
  },


  // Minimax核心算法
  minimax: function(board, depth, alpha, beta, isMaximizing, player, startTime) {
    const opponent = player === 1 ? 2 : 1;
    const currentPlayer = isMaximizing ? player : opponent;
    
    // 超时检查
    if (Date.now() - startTime > 2000) {
      return { score: this.evaluateBoard(board, player), move: null };
    }
    
    // 检查游戏结束状态
    const gameState = this.checkGameState(board);
    if (gameState !== 'ongoing' || depth === 0) {
      return {
        score: this.getFinalScore(gameState, player),
        move: null
      };
    }
    
    let bestMove = null;
    const moves = this.getSortedMoves(board, currentPlayer);
    
    if (moves.length === 0) {
      return { score: this.evaluateBoard(board, player), move: null };
    }
    
    if (isMaximizing) {
      let maxScore = -Infinity;
      
      for (const move of moves) {
        const newBoard = this.makeMoveOnBoard(board, move.row, move.col, currentPlayer);
        const result = this.minimax(newBoard, depth - 1, alpha, beta, false, player, startTime);
        
        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) {
          break; // α-β剪枝
        }
      }
      
      return { score: maxScore, move: bestMove };
    } else {
      let minScore = Infinity;
      
      for (const move of moves) {
        const newBoard = this.makeMoveOnBoard(board, move.row, move.col, currentPlayer);
        const result = this.minimax(newBoard, depth - 1, alpha, beta, true, player, startTime);
        
        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }
        
        beta = Math.min(beta, minScore);
        if (beta <= alpha) {
          break; // α-β剪枝
        }
      }
      
      return { score: minScore, move: bestMove };
    }
  },

  // 获取排序后的可能移动
  getSortedMoves: function(board, player) {
    const moves = [];
    
    // 收集所有可能移动并计算初步分数
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 只考虑有棋子周围的位置（优化搜索范围）
          if (this.hasNeighbor(board, i, j)) {
            const score = this.evaluatePosition(i, j, player);
            moves.push({ row: i, col: j, score });
          }
        }
      }
    }
    
    // 按分数排序，提高剪枝效率
    moves.sort((a, b) => b.score - a.score);
    
    // 限制搜索范围，只考虑前N个最佳移动
    // 根据游戏阶段动态调整搜索宽度
    const moveCount = this.countMoves(board);
    let searchWidth = 15; // 默认宽度
    
    if (moveCount < 10) {
      searchWidth = 20; // 开局阶段考虑更多可能性
    } else if (moveCount > 50) {
      searchWidth = 10; // 残局阶段减少搜索宽度以提高速度
    }
    
    return moves.slice(0, Math.min(moves.length, searchWidth));
  },

  // 检查位置是否有邻居棋子（优化搜索范围）
  hasNeighbor: function(board, row, col, distance = 2) {
    for (let i = Math.max(0, row - distance); i <= Math.min(this.data.boardSize - 1, row + distance); i++) {
      for (let j = Math.max(0, col - distance); j <= Math.min(this.data.boardSize - 1, col + distance); j++) {
        if (board[i][j] !== 0) {
          return true;
        }
      }
    }
    return false;
  },

  // 在棋盘上模拟落子
  makeMoveOnBoard: function(board, row, col, player) {
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = player;
    return newBoard;
  },

  // 检查游戏状态
  checkGameState: function(board) {
    // 检查是否有五连
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] !== 0) {
          if (this.checkWinOnBoard(i, j, board[i][j], board)) {
            return board[i][j] === 1 ? 'blackWin' : 'whiteWin';
          }
        }
      }
    }
    
    // 检查是否平局
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          return 'ongoing';
        }
      }
    }
    
    return 'draw';
  },

  // 获取最终得分
  getFinalScore: function(gameState, player) {
    switch (gameState) {
      case 'blackWin':
        return player === 1 ? 100000 : -100000;
      case 'whiteWin':
        return player === 2 ? 100000 : -100000;
      case 'draw':
        return 0;
      default:
        return 0;
    }
  },

  // 计算棋盘上的总移动数
  countMoves: function(board) {
    let count = 0;
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] !== 0) {
          count++;
        }
      }
    }
    return count;
  },

  // 评估位置分数 - 增强版
  evaluatePosition: function(row, col, player) {
    const opponent = player === 1 ? 2 : 1;
    
    // 使用新的威胁评估系统
    const myThreat = this.getThreatLevel(this.data.board, row, col, player);
    const opponentThreat = this.getThreatLevel(this.data.board, row, col, opponent);
    
    // 直接威胁评估
    if (myThreat >= 100000) return 100000; // 必胜
    if (opponentThreat >= 100000) return 90000; // 必防
    
    let score = 0;
    
    // 威胁级别评分
    score += myThreat * 1.2; // 自己的威胁权重更高
    score += opponentThreat * 0.8; // 对手威胁权重稍低
    
    // 位置价值评估
    score += this.getPositionWeight(row, col);
    
    // 增加对形成连续棋型的奖励
    const patternScore = this.evaluatePatterns(this.data.board, row, col, player);
    score += patternScore;
    
    // 考虑多个方向的潜在发展
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    let potentialDevelopment = 0;
    for (const [dx, dy] of directions) {
      // 检查该方向的发展潜力
      let freeSpaces = 0;
      // 正向检查
      for (let i = 1; i <= 3; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;
        
        if (!this.isValidPosition(newRow, newCol)) break;
        
        if (this.data.board[newRow][newCol] === 0) {
          freeSpaces++;
        } else if (this.data.board[newRow][newCol] === player) {
          // 继续
        } else {
          break; // 对手棋子阻挡
        }
      }
      
      // 反向检查
      for (let i = 1; i <= 3; i++) {
        const newRow = row - i * dy;
        const newCol = col - i * dx;
        
        if (!this.isValidPosition(newRow, newCol)) break;
        
        if (this.data.board[newRow][newCol] === 0) {
          freeSpaces++;
        } else if (this.data.board[newRow][newCol] === player) {
          // 继续
        } else {
          break; // 对手棋子阻挡
        }
      }
      
      // 根据自由空间数量给予奖励
      if (freeSpaces >= 4) {
        potentialDevelopment += 300;
      } else if (freeSpaces >= 3) {
        potentialDevelopment += 150;
      } else if (freeSpaces >= 2) {
        potentialDevelopment += 50;
      }
    }
    
    score += potentialDevelopment;
    
    return score;
  },

  // 获取威胁级别
  getThreatLevel: function(board, row, col, player) {
    if (board[row][col] !== 0) return 0;
    
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    let maxThreat = 0;
    let doubleThreeCount = 0;
    let doubleTwoCount = 0;
    
    // 临时放置棋子进行分析
    const tempBoard = board.map(row => [...row]);
    tempBoard[row][col] = player;
    
    for (const [dx, dy] of directions) {
      const lineInfo = this.analyzeLine(tempBoard, row, col, dx, dy, player);
      
      // 识别各种威胁模式
      if (lineInfo.five) return 100000;  // 五连
      if (lineInfo.openFour) return 50000;  // 活四
      if (lineInfo.doubleThree) {
        doubleThreeCount++;
        continue;
      }
      if (lineInfo.four) {
        maxThreat = Math.max(maxThreat, 10000);  // 冲四
        continue;
      }
      if (lineInfo.openThree) {
        maxThreat = Math.max(maxThreat, 5000); // 活三
        continue;
      }
      if (lineInfo.doubleTwo) {
        doubleTwoCount++;
        continue;
      }
      if (lineInfo.three) {
        maxThreat = Math.max(maxThreat, 1000);  // 眠三
        continue;
      }
      if (lineInfo.openTwo) {
        maxThreat = Math.max(maxThreat, 200); // 活二
        continue;
      }
    }
    
    // 处理双威胁情况
    if (doubleThreeCount >= 2) return 30000; // 双活三
    if (doubleTwoCount >= 2) maxThreat = Math.max(maxThreat, 100); // 双活二
    if (doubleThreeCount >= 1 && doubleTwoCount >= 1) maxThreat = Math.max(maxThreat, 800); // 活三+活二
    
    // 考虑多个潜在威胁的组合
    if (maxThreat >= 5000) { // 如果有任何活三或以上的威胁
      // 检查是否有其他潜在威胁
      let additionalThreats = 0;
      for (const [dx, dy] of directions) {
        const lineInfo = this.analyzeLine(tempBoard, row, col, dx, dy, player);
        if (lineInfo.openThree || lineInfo.three || lineInfo.openTwo) {
          additionalThreats++;
        }
      }
      
      // 如果有多重潜在威胁，增加威胁值
      if (additionalThreats >= 2) {
        maxThreat *= 1.5;
      }
    }
    
    return Math.min(maxThreat, 99999); // 确保不会超过获胜分数
  },

  // 分析单线连珠情况
  analyzeLine: function(board, row, col, dx, dy, player) {
    let count = 1;
    let openEnds = 0;
    let spaces = 0;
    let blocked = false;
    
    // 正向分析
    let continuousCount = 0;
    let gapPositions = [];
    
    for (let i = 1; i <= 6; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) {
        blocked = true;
        break;
      }
      
      if (board[newRow][newCol] === player) {
        count++;
        continuousCount++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        if (continuousCount > 0 && spaces === 0) {
          spaces = i;
        }
        break;
      } else {
        blocked = true;
        break;
      }
    }
    
    // 反向分析
    let continuousCountReverse = 0;
    let blockedReverse = false;
    
    for (let i = 1; i <= 6; i++) {
      const newRow = row - i * dy;
      const newCol = col - i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) {
        blockedReverse = true;
        break;
      }
      
      if (board[newRow][newCol] === player) {
        count++;
        continuousCountReverse++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        break;
      } else {
        blockedReverse = true;
        break;
      }
    }
    
    // 计算各种威胁模式
    const five = count >= 5;
    const openFour = count === 4 && openEnds === 2;
    const four = count === 4 && openEnds === 1;
    const openThree = count === 3 && openEnds === 2;
    const three = count === 3 && openEnds === 1;
    const openTwo = count === 2 && openEnds === 2;
    
    // 检测双威胁
    const doubleThree = this.checkDoubleThree(board, row, col, dx, dy, player);
    const doubleTwo = this.checkDoubleTwo(board, row, col, dx, dy, player);
    
    return {
      count,
      openEnds,
      blocked: blocked || blockedReverse,
      five,
      openFour,
      four,
      openThree,
      three,
      openTwo,
      doubleThree,
      doubleTwo,
      score: this.calculateLineScore(count, openEnds, blocked || blockedReverse)
    };
  },

  // 检查双活三
  checkDoubleThree: function(board, row, col, dx, dy, player) {
    let threeCount = 0;
    
    // 检查所有方向是否形成活三
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    for (const [dx2, dy2] of directions) {
      const lineInfo = this.analyzeLineWithoutDoubleThree(board, row, col, dx2, dy2, player);
      if (lineInfo.openThree && lineInfo.count === 3) {
        threeCount++;
      }
    }
    
    return threeCount >= 2;
  },

  // 不检测双活三的线分析（避免递归）
  analyzeLineWithoutDoubleThree: function(board, row, col, dx, dy, player) {
    let count = 1;
    let openEnds = 0;
    let spaces = 0;
    let blocked = false;
    
    // 正向分析
    let continuousCount = 0;
    
    for (let i = 1; i <= 6; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) {
        blocked = true;
        break;
      }
      
      if (board[newRow][newCol] === player) {
        count++;
        continuousCount++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        if (continuousCount > 0 && spaces === 0) {
          spaces = i;
        }
        break;
      } else {
        blocked = true;
        break;
      }
    }
    
    // 反向分析
    let continuousCountReverse = 0;
    let blockedReverse = false;
    
    for (let i = 1; i <= 6; i++) {
      const newRow = row - i * dy;
      const newCol = col - i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) {
        blockedReverse = true;
        break;
      }
      
      if (board[newRow][newCol] === player) {
        count++;
        continuousCountReverse++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        break;
      } else {
        blockedReverse = true;
        break;
      }
    }
    
    // 计算各种威胁模式（不检测双威胁）
    const five = count >= 5;
    const openFour = count === 4 && openEnds === 2;
    const four = count === 4 && openEnds === 1;
    const openThree = count === 3 && openEnds === 2;
    const three = count === 3 && openEnds === 1;
    const openTwo = count === 2 && openEnds === 2;
    
    return {
      count,
      openEnds,
      blocked: blocked || blockedReverse,
      five,
      openFour,
      four,
      openThree,
      three,
      openTwo,
      doubleThree: false,
      doubleTwo: false,
      score: this.calculateLineScore(count, openEnds, blocked || blockedReverse)
    };
  },

  // 不检测双威胁的线分析（避免递归）
  analyzeLineWithoutDoubleCheck: function(board, row, col, dx, dy, player) {
    let count = 1;
    let openEnds = 0;
    let spaces = 0;
    let blocked = false;
    
    // 正向分析
    let continuousCount = 0;
    
    for (let i = 1; i <= 6; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) {
        blocked = true;
        break;
      }
      
      if (board[newRow][newCol] === player) {
        count++;
        continuousCount++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        if (continuousCount > 0 && spaces === 0) {
          spaces = i;
        }
        break;
      } else {
        blocked = true;
        break;
      }
    }
    
    // 反向分析
    let continuousCountReverse = 0;
    let blockedReverse = false;
    
    for (let i = 1; i <= 6; i++) {
      const newRow = row - i * dy;
      const newCol = col - i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) {
        blockedReverse = true;
        break;
      }
      
      if (board[newRow][newCol] === player) {
        count++;
        continuousCountReverse++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        break;
      } else {
        blockedReverse = true;
        break;
      }
    }
    
    // 计算各种威胁模式（不检测双威胁）
    const five = count >= 5;
    const openFour = count === 4 && openEnds === 2;
    const four = count === 4 && openEnds === 1;
    const openThree = count === 3 && openEnds === 2;
    const three = count === 3 && openEnds === 1;
    const openTwo = count === 2 && openEnds === 2;
    
    return {
      count,
      openEnds,
      blocked: blocked || blockedReverse,
      five,
      openFour,
      four,
      openThree,
      three,
      openTwo,
      doubleThree: false,
      doubleTwo: false,
      score: this.calculateLineScore(count, openEnds, blocked || blockedReverse)
    };
  },

  // 检查双活二
  checkDoubleTwo: function(board, row, col, dx, dy, player) {
    let twoCount = 0;
    
    const tempBoard = board.map(row => [...row]);
    tempBoard[row][col] = player;
    
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    for (const [dx2, dy2] of directions) {
      const lineInfo = this.analyzeLineWithoutDoubleCheck(tempBoard, row, col, dx2, dy2, player);
      if (lineInfo.openTwo && lineInfo.count === 2) {
        twoCount++;
      }
    }
    
    return twoCount >= 2;
  },

  // 计算单线得分
  calculateLineScore: function(count, openEnds, blocked) {
    if (blocked) {
      switch (count) {
        case 4: return 8000;  // 被堵的四
        case 3: return 800;   // 被堵的三
        case 2: return 80;    // 被堵的二
        default: return 0;
      }
    } else {
      switch (count) {
        case 4: 
          return openEnds === 2 ? 20000 : 5000; // 活四 vs 冲四
        case 3: 
          return openEnds === 2 ? 2000 : 500;   // 活三 vs 眠三
        case 2: 
          return openEnds === 2 ? 200 : 50;     // 活二 vs 眠二
        default: return 0;
      }
    }
  },

  // 检查位置是否有效
  isValidPosition: function(row, col) {
    return row >= 0 && row < this.data.boardSize && 
           col >= 0 && col < this.data.boardSize;
  },

  // 获取位置权重
  getPositionWeight: function(row, col) {
    // 基于五子棋理论的位置权重表
    // 中心位置权重最高，向四周递减
    const weightMatrix = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,3,3,3,3,3,3,3,3,3,2,1,0],
      [0,1,2,3,4,4,4,4,4,4,4,3,2,1,0],
      [0,1,2,3,4,5,5,5,5,5,4,3,2,1,0],
      [0,1,2,3,4,5,6,6,6,5,4,3,2,1,0],
      [0,1,2,3,4,5,6,7,6,5,4,3,2,1,0],
      [0,1,2,3,4,5,6,6,6,5,4,3,2,1,0],
      [0,1,2,3,4,5,5,5,5,5,4,3,2,1,0],
      [0,1,2,3,4,4,4,4,4,4,4,3,2,1,0],
      [0,1,2,3,3,3,3,3,3,3,3,3,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    
    let baseWeight = weightMatrix[row][col];
    
    // 根据游戏阶段动态调整权重
    const moveCount = this.countMoves(this.data.board);
    const stageMultiplier = this.getStageMultiplier(moveCount);
    
    // 考虑与现有棋子的距离
    const distanceBonus = this.getDistanceBonus(row, col);
    
    return Math.floor(baseWeight * stageMultiplier + distanceBonus);
  },

  // 获取游戏阶段乘数
  getStageMultiplier: function(moveCount) {
    if (moveCount < 10) {
      return 3.0; // 开局阶段更重视中心控制
    } else if (moveCount < 30) {
      return 2.0; // 中局阶段
    } else if (moveCount < 50) {
      return 1.5; // 中后局
    } else {
      return 1.0; // 残局阶段位置重要性降低
    }
  },

  // 获取距离奖励
  getDistanceBonus: function(row, col) {
    let bonus = 0;
    const minDistance = 3; // 最小考虑距离
    
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (this.data.board[i][j] !== 0) {
          const distance = Math.max(Math.abs(i - row), Math.abs(j - col));
          if (distance <= minDistance && distance > 0) {
            // 距离现有棋子越近奖励越高
            bonus += (minDistance - distance + 1) * 2;
          }
        }
      }
    }
    
    return bonus;
  },

  // 评估棋型模式
  evaluatePatterns: function(board, row, col, player) {
    let score = 0;
    
    // 评估是否能形成连续的棋型
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    for (const [dx, dy] of directions) {
      // 检查正向
      let forwardCount = 0;
      let forwardBlocked = false;
      for (let i = 1; i <= 5; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;
        
        if (!this.isValidPosition(newRow, newCol)) {
          forwardBlocked = true;
          break;
        }
        
        if (board[newRow][newCol] === player) {
          forwardCount++;
        } else if (board[newRow][newCol] === 0) {
          // 空位，可以考虑
          break;
        } else {
          // 对手棋子，阻挡
          forwardBlocked = true;
          break;
        }
      }
      
      // 检查反向
      let backwardCount = 0;
      let backwardBlocked = false;
      for (let i = 1; i <= 5; i++) {
        const newRow = row - i * dy;
        const newCol = col - i * dx;
        
        if (!this.isValidPosition(newRow, newCol)) {
          backwardBlocked = true;
          break;
        }
        
        if (board[newRow][newCol] === player) {
          backwardCount++;
        } else if (board[newRow][newCol] === 0) {
          // 空位，可以考虑
          break;
        } else {
          // 对手棋子，阻挡
          backwardBlocked = true;
          break;
        }
      }
      
      // 根据连续棋子数和阻挡情况给予奖励
      const totalCount = forwardCount + backwardCount + 1;
      const totalBlocked = (forwardBlocked ? 1 : 0) + (backwardBlocked ? 1 : 0);
      
      // 评估不同类型的连珠
      if (totalCount >= 5) {
        score += 100000; // 五连
      } else if (totalCount === 4 && totalBlocked === 0) {
        score += 50000;  // 活四
      } else if (totalCount === 4 && totalBlocked === 1) {
        score += 10000;  // 冲四
      } else if (totalCount === 3 && totalBlocked === 0) {
        score += 5000;   // 活三
      } else if (totalCount === 3 && totalBlocked === 1) {
        score += 1000;   // 眠三
      } else if (totalCount === 2 && totalBlocked === 0) {
        score += 200;    // 活二
      } else if (totalCount >= 4) {
        score += 1000;   // 接近形成四连
      } else if (totalCount >= 3) {
        score += 500;    // 接近形成三连
      } else if (totalCount >= 2) {
        score += 100;    // 接近形成二连
      }
    }
    
    return score;
  },

  // 全局棋盘评估
  evaluateBoard: function(board, player) {
    const opponent = player === 1 ? 2 : 1;
    let totalScore = 0;
    
    // 评估所有位置
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === player) {
          // 评估自己的棋子位置
          totalScore += this.evaluateExistingPiece(board, i, j, player);
        } else if (board[i][j] === opponent) {
          // 评估对手的棋子位置（防守价值）
          totalScore -= this.evaluateExistingPiece(board, i, j, opponent) * 0.8;
        }
      }
    }
    
    // 添加形状和结构评估
    totalScore += this.evaluateStructure(board, player);
    
    // 添加灵活性和潜力评估
    totalScore += this.evaluateFlexibility(board, player);
    
    // 添加潜在威胁评估
    totalScore += this.evaluatePotentialThreats(board, player);
    
    return totalScore;
  },

  // 评估已存在棋子的价值
  evaluateExistingPiece: function(board, row, col, player) {
    let score = 0;
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    // 基础位置权重
    score += this.getPositionWeight(row, col) * 0.1;
    
    // 各方向的威胁评估
    for (const [dx, dy] of directions) {
      const lineInfo = this.analyzeLine(board, row, col, dx, dy, player);
      
      if (lineInfo.five) score += 100000;
      else if (lineInfo.openFour) score += 50000;
      else if (lineInfo.four) score += 10000;
      else if (lineInfo.openThree) score += 5000;
      else if (lineInfo.three) score += 1000;
      else if (lineInfo.openTwo) score += 200;
      
      // 连接性奖励
      if (lineInfo.count >= 2) {
        score += lineInfo.count * 50;
      }
      
      // 考虑发展潜力
      if (!lineInfo.blocked && lineInfo.openEnds > 0) {
        // 如果该方向未被阻挡且有开口，给予额外奖励
        score += 100;
      }
    }
    
    return score;
  },

  // 评估整体结构
  evaluateStructure: function(board, player) {
    let structureScore = 0;
    
    // 检查是否有好的形状（如三角形、长龙等）
    const shapes = this.identifyShapes(board, player);
    
    for (const shape of shapes) {
      switch (shape.type) {
        case 'triangle':
          structureScore += 500;
          break;
        case 'line3':
          structureScore += 300;
          break;
        case 'potential4':
          structureScore += 2000;
          break;
        case 'flexible':
          structureScore += 100;
          break;
      }
    }
    
    return structureScore;
  },

  // 评估灵活性
  evaluateFlexibility: function(board, player) {
    let flexibilityScore = 0;
    
    // 计算可发展的方向数量
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === player) {
          const directions = [[1,0], [0,1], [1,1], [1,-1]];
          let flexibleDirections = 0;
          
          for (const [dx, dy] of directions) {
            if (this.canExpand(board, i, j, dx, dy, player)) {
              flexibleDirections++;
            }
          }
          
          flexibilityScore += flexibleDirections * 20;
        }
      }
    }
    
    return flexibilityScore;
  },

  // 评估潜在威胁
  evaluatePotentialThreats: function(board, player) {
    let threatScore = 0;
    const opponent = player === 1 ? 2 : 1;
    
    // 评估对手潜在的活三、活四等威胁
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 临时放置对手棋子
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = opponent;
          
          // 评估对手在此位置的威胁
          const opponentThreat = this.getThreatLevel(tempBoard, i, j, opponent);
          
          // 如果对手在此位置有较大威胁，增加防守分值
          if (opponentThreat >= 5000) {
            threatScore -= opponentThreat * 0.5; // 防守价值
          }
        }
      }
    }
    
    // 评估自己潜在的威胁
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 评估自己在此位置的威胁
          const myThreat = this.getThreatLevel(board, i, j, player);
          
          // 如果自己在此位置有较大威胁，增加进攻分值
          if (myThreat >= 5000) {
            threatScore += myThreat * 0.7; // 进攻价值
          }
        }
      }
    }
    
    return threatScore;
  },

  // 识别形状
  identifyShapes: function(board, player) {
    const shapes = [];
    const playerPositions = [];
    
    // 收集所有己方棋子位置
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === player) {
          playerPositions.push({row: i, col: j});
        }
      }
    }
    
    // 检测三角形结构
    for (let i = 0; i < playerPositions.length; i++) {
      for (let j = i + 1; j < playerPositions.length; j++) {
        for (let k = j + 1; k < playerPositions.length; k++) {
          if (this.isTriangle(playerPositions[i], playerPositions[j], playerPositions[k])) {
            shapes.push({type: 'triangle', positions: [playerPositions[i], playerPositions[j], playerPositions[k]]});
          }
        }
      }
    }
    
    // 检测直线结构
    const lines = this.findLines(board, player, 3);
    for (const line of lines) {
      shapes.push({type: 'line3', positions: line});
    }
    
    // 检测潜在四连线
    const potentialFours = this.findPotentialFours(board, player);
    for (const potential of potentialFours) {
      shapes.push({type: 'potential4', positions: potential});
    }
    
    return shapes;
  },

  // 检查是否形成三角形
  isTriangle: function(pos1, pos2, pos3) {
    const dist1 = Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
    const dist2 = Math.abs(pos1.row - pos3.row) + Math.abs(pos1.col - pos3.col);
    const dist3 = Math.abs(pos2.row - pos3.row) + Math.abs(pos2.col - pos3.col);
    
    // 简单的三角形判定：三点距离适中
    return dist1 <= 4 && dist2 <= 4 && dist3 <= 4 && dist1 >= 2 && dist2 >= 2 && dist3 >= 2;
  },

  // 查找直线
  findLines: function(board, player, minLength) {
    const lines = [];
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    for (const [dx, dy] of directions) {
      for (let i = 0; i < this.data.boardSize; i++) {
        for (let j = 0; j < this.data.boardSize; j++) {
          if (board[i][j] === player) {
            const line = this.getLineInDirection(board, i, j, dx, dy, player);
            if (line.length >= minLength) {
              lines.push(line);
            }
          }
        }
      }
    }
    
    return lines;
  },

  // 获取某个方向的直线
  getLineInDirection: function(board, row, col, dx, dy, player) {
    const line = [{row, col}];
    
    // 正向搜索
    for (let i = 1; i < 5; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      
      if (this.isValidPosition(newRow, newCol) && board[newRow][newCol] === player) {
        line.push({row: newRow, col: newCol});
      } else {
        break;
      }
    }
    
    // 反向搜索
    for (let i = 1; i < 5; i++) {
      const newRow = row - i * dy;
      const newCol = col - i * dx;
      
      if (this.isValidPosition(newRow, newCol) && board[newRow][newCol] === player) {
        line.unshift({row: newRow, col: newCol});
      } else {
        break;
      }
    }
    
    return line;
  },

  // 查找潜在四连线
  findPotentialFours: function(board, player) {
    const potentials = [];
    
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 临时放置棋子
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = player;
          
          // 检查是否能形成四连线
          if (this.countConnections(tempBoard, i, j, player) >= 4) {
            potentials.push([{row: i, col: j}]);
          }
        }
      }
    }
    
    return potentials;
  },

  // 计算连接数
  countConnections: function(board, row, col, player) {
    let maxCount = 0;
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      
      // 正向搜索
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;
        
        if (this.isValidPosition(newRow, newCol) && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      // 反向搜索
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dy;
        const newCol = col - i * dx;
        
        if (this.isValidPosition(newRow, newCol) && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      maxCount = Math.max(maxCount, count);
    }
    
    return maxCount;
  },

  // 检查是否可以扩展
  canExpand: function(board, row, col, dx, dy, player) {
    let count = 0;
    let hasSpace = false;
    
    // 检查正向
    for (let i = 1; i <= 4; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) break;
      
      if (board[newRow][newCol] === player) {
        count++;
      } else if (board[newRow][newCol] === 0) {
        hasSpace = true;
        break;
      } else {
        break;
      }
    }
    
    // 检查反向
    for (let i = 1; i <= 4; i++) {
      const newRow = row - i * dy;
      const newCol = col - i * dx;
      
      if (!this.isValidPosition(newRow, newCol)) break;
      
      if (board[newRow][newCol] === player) {
        count++;
      } else if (board[newRow][newCol] === 0) {
        hasSpace = true;
        break;
      } else {
        break;
      }
    }
    
    return count >= 1 && hasSpace;
  },

  // 判断是否处于开局阶段
  isOpenGame: function(board) {
    const moveCount = this.countMoves(board);
    
    // 通常前10步被认为是开局阶段
    if (moveCount <= 10) {
      return true;
    }
    
    // 如果棋子都集中在中心区域，也算作开局
    let centerCount = 0;
    const centerRange = 5; // 中心区域范围
    
    for (let i = 7 - centerRange; i <= 7 + centerRange; i++) {
      for (let j = 7 - centerRange; j <= 7 + centerRange; j++) {
        if (board[i][j] !== 0) {
          centerCount++;
        }
      }
    }
    
    // 如果大部分棋子在中心区域，仍算开局
    return centerCount >= moveCount * 0.7;
  },

  // 获取开局着法
  getOpeningMove: function(board, player) {
    const moveCount = this.countMoves(board);
    
    if (moveCount === 0) {
      return this.getFirstMove();
    }
    
    if (moveCount === 1) {
      return this.getSecondMove(board, player);
    }
    
    if (moveCount <= 6) {
      return this.getEarlyGameMove(board, player);
    }
    
    if (this.isOpenGame(board)) {
      return this.getMidOpeningMove(board, player);
    }
    
    return null; // 不在开局阶段
  },

  // 获取第一步着法
  getFirstMove: function() {
    // 天元位置 - 五子棋最经典的开局
    return { row: 7, col: 7 };
  },

  // 获取第二步着法
  getSecondMove: function(board, player) {
    const opponent = player === 1 ? 2 : 1;
    
    // 查找对手的第一步
    let firstOpponentMove = null;
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === opponent) {
          firstOpponentMove = { row: i, col: j };
          break;
        }
      }
      if (firstOpponentMove) break;
    }
    
    if (!firstOpponentMove) return null;
    
    // 根据对手第一步的位置选择应对
    const distance = Math.abs(firstOpponentMove.row - 7) + Math.abs(firstOpponentMove.col - 7);
    
    if (distance === 0) {
      // 对手下天元，选择相邻位置
      return this.getAdjacentToCenter(firstOpponentMove);
    } else {
      // 对手没下天元，下天元控制中心
      return { row: 7, col: 7 };
    }
  },

  // 获取天元相邻位置
  getAdjacentToCenter: function(centerMove) {
    const adjacentMoves = [
      {row: 6, col: 6}, {row: 6, col: 7}, {row: 6, col: 8},
      {row: 7, col: 6}, {row: 7, col: 8},
      {row: 8, col: 6}, {row: 8, col: 7}, {row: 8, col: 8}
    ];
    
    // 随机选择一个相邻位置
    return adjacentMoves[Math.floor(Math.random() * adjacentMoves.length)];
  },

  // 获取早期游戏着法（3-4步）
  getEarlyGameMove: function(board, player) {
    const opponent = player === 1 ? 2 : 1;
    
    // 检查是否需要防守
    const urgentDefense = this.findUrgentDefense(board, player);
    if (urgentDefense) {
      return urgentDefense;
    }
    
    // 检查是否有进攻机会
    const attackOpportunity = this.findAttackOpportunity(board, player);
    if (attackOpportunity) {
      return attackOpportunity;
    }
    
    // 构建良好形状
    return this.getShapeBuildingMove(board, player);
  },

  // 获取中局开局着法（5-10步）
  getMidOpeningMove: function(board, player) {
    // 使用更智能的策略
    const urgentDefense = this.findUrgentDefense(board, player);
    if (urgentDefense) {
      return urgentDefense;
    }
    
    const attackOpportunity = this.findAttackOpportunity(board, player);
    if (attackOpportunity) {
      return attackOpportunity;
    }
    
    // 优先选择能形成良好结构的位置
    return this.getStrategicMove(board, player);
  },

  // 查找紧急防守位置
  findUrgentDefense: function(board, player) {
    const opponent = player === 1 ? 2 : 1;
    
    // 首先检查对手是否能形成五连（最高优先级）
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 检查对手在此位置是否能形成威胁
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = opponent;
          
          // 如果对手能形成五连，必须防守
          if (this.getThreatLevel(tempBoard, i, j, opponent) >= 100000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 然后检查自己是否能形成五连（进攻优先级也很高）
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 检查自己在此位置是否能获胜
          if (this.getThreatLevel(board, i, j, player) >= 100000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 检查对手是否能形成活四
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 检查对手在此位置是否能形成威胁
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = opponent;
          
          // 如果对手能形成活四，必须防守
          if (this.getThreatLevel(tempBoard, i, j, opponent) >= 50000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 检查对手是否能形成双活三
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          // 检查对手在此位置是否能形成威胁
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = opponent;
          
          // 如果对手能形成双活三，也需要防守
          if (this.getThreatLevel(tempBoard, i, j, opponent) >= 30000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    return null;
  },

  // 查找进攻机会
  findAttackOpportunity: function(board, player) {
    // 首先查找能立即获胜的机会
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          const threat = this.getThreatLevel(board, i, j, player);
          
          // 如果能获胜，立即进攻
          if (threat >= 100000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 然后查找能形成活四的机会
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          const threat = this.getThreatLevel(board, i, j, player);
          
          // 如果能形成活四，立即进攻
          if (threat >= 50000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 查找能形成双活三的机会
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          const threat = this.getThreatLevel(board, i, j, player);
          
          // 如果能形成双活三，也是好机会
          if (threat >= 30000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // 查找能形成冲四的机会
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0) {
          const threat = this.getThreatLevel(board, i, j, player);
          
          // 如果能形成冲四，也不错
          if (threat >= 10000) {
            return { row: i, col: j };
          }
        }
      }
    }
    
    return null;
  },

  // 获取构建形状的着法
  getShapeBuildingMove: function(board, player) {
    const candidates = [];
    
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0 && this.hasNeighbor(board, i, j, 2)) {
          const score = this.evaluatePosition(i, j, player);
          candidates.push({ row: i, col: j, score });
        }
      }
    }
    
    if (candidates.length === 0) return null;
    
    // 选择得分最高的位置
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
  },

  // 获取战略性着法
  getStrategicMove: function(board, player) {
    const candidates = [];
    
    // 收集候选位置
    for (let i = 0; i < this.data.boardSize; i++) {
      for (let j = 0; j < this.data.boardSize; j++) {
        if (board[i][j] === 0 && this.hasNeighbor(board, i, j, 2)) {
          const score = this.evaluatePosition(i, j, player);
          
          // 额外奖励能够构建良好结构的位置
          let structureBonus = 0;
          const tempBoard = board.map(row => [...row]);
          tempBoard[i][j] = player;
          
          // 检查是否能形成好的结构
          const shapes = this.identifyShapes(tempBoard, player);
          for (const shape of shapes) {
            switch (shape.type) {
              case 'triangle':
                structureBonus += 300;
                break;
              case 'line3':
                structureBonus += 200;
                break;
              case 'potential4':
                structureBonus += 1000;
                break;
            }
          }
          
          candidates.push({ 
            row: i, 
            col: j, 
            score: score + structureBonus 
          });
        }
      }
    }
    
    if (candidates.length === 0) return null;
    
    // 选择得分最高的位置
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
  },

  // 在指定棋盘上检查胜利
  checkWinOnBoard: function(row, col, player, board) {
    const directions = [
      [1, 0],   // 水平
      [0, 1],   // 垂直
      [1, 1],   // 对角线
      [1, -1]   // 反对角线
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      // 正向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dy;
        const newCol = col + i * dx;

        if (newRow < 0 || newRow >= this.data.boardSize || 
            newCol < 0 || newCol >= this.data.boardSize) {
          break;
        }

        if (board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      // 反向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dy;
        const newCol = col - i * dx;

        if (newRow < 0 || newRow >= this.data.boardSize || 
            newCol < 0 || newCol >= this.data.boardSize) {
          break;
        }

        if (board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 5) {
        return true;
      }
    }

    return false;
  },

  // 评估某个方向的连珠情况
  evaluateDirection: function(row, col, dx, dy, player, board) {
    let score = 0;
    let count = 1; // 包括当前位置
    let openEnds = 0; // 开口数量

    // 正向检查
    let blocked = false;
    for (let i = 1; i < 5; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;

      if (newRow < 0 || newRow >= this.data.boardSize || 
          newCol < 0 || newCol >= this.data.boardSize) {
        blocked = true;
        break;
      }

      if (board[newRow][newCol] === player) {
        count++;
      } else if (board[newRow][newCol] === 0) {
        openEnds++;
        break;
      } else {
        blocked = true;
        break;
      }
    }

    // 反向检查
    if (!blocked) {
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dy;
        const newCol = col - i * dx;

        if (newRow < 0 || newRow >= this.data.boardSize || 
            newCol < 0 || newCol >= this.data.boardSize) {
          break;
        }

        if (board[newRow][newCol] === player) {
          count++;
        } else if (board[newRow][newCol] === 0) {
          openEnds++;
          break;
        } else {
          break;
        }
      }
    }

    // 根据连珠数量和开口情况计算分数
    if (count >= 5) {
      score = 1000; // 五连
    } else if (count === 4) {
      score = openEnds >= 2 ? 500 : 100; // 活四或冲四
    } else if (count === 3) {
      score = openEnds >= 2 ? 50 : 10; // 活三或眠三
    } else if (count === 2) {
      score = openEnds >= 2 ? 5 : 1; // 活二或眠二
    }

    return score;
  },

  // 重新开始
  restartGame: function() {
    this.setData({
      showFirstPlayerModal: true,
      statusText: '请选择先手'
    });
  },

  // 开始新游戏
  startNewGame: function() {
    this.setData({
      board: Array(this.data.boardSize).fill().map(() => Array(this.data.boardSize).fill(0)),
      currentPlayer: 1,
      gameActive: true,
      moveHistory: [],
      gameTime: 0,
      gameTimeFormatted: '00:00',
      gameStarted: false,      // 重置对局开始状态
      showWinModal: false
    });

    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }

    this.setData({ timerInterval: null });
    this.updateGameStatus();
    this.drawBoard();
  },


  // 选择先手
  selectFirst: function() {
    this.setData({
      showFirstPlayerModal: false,
      playerFirst: true,
      aiPlayer: 2
    });
    this.startGame();
  },

  // 选择后手
  selectSecond: function() {
    this.setData({
      showFirstPlayerModal: false,
      playerFirst: false,
      aiPlayer: 1,  // AI执黑棋（先手）
      currentPlayer: 1  // 当前应该是黑棋（AI）的回合
    });
    this.startGame();
  },

  // 格式化时间
  formatTime: function(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  },

  // 新的精确坐标计算方法
  calculateBoardPosition: function(clientX, clientY, actualCanvasWidth, actualCanvasHeight) {
    const { cellSize, boardSize } = this.data;
    
    // 如果没有提供实际Canvas尺寸，则使用data中的值
    const canvasWidth = actualCanvasWidth || this.data.canvasWidth;
    const canvasHeight = actualCanvasHeight || this.data.canvasHeight;
    
    // 计算棋盘在画布中的偏移
    const boardWidth = (boardSize - 1) * cellSize;
    const offsetX = (canvasWidth - boardWidth) / 2;
    const offsetY = (canvasHeight - boardWidth) / 2;
    
    // 计算相对于棋盘的坐标
    const relativeX = clientX - offsetX;
    const relativeY = clientY - offsetY;
    
    // 计算最近的网格交点 - 使用四舍五入以获得更准确的位置
    const col = Math.round(relativeX / cellSize);
    const row = Math.round(relativeY / cellSize);
    
    // 边界约束
    return {
      col: Math.max(0, Math.min(boardSize - 1, col)),
      row: Math.max(0, Math.min(boardSize - 1, row)),
      isValid: col >= 0 && col < boardSize && row >= 0 && row < boardSize,
      offsetX: offsetX,
      offsetY: offsetY,
      boardWidth: boardWidth
    };
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
});



