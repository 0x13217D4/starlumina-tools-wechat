Page({
  data: {
    currentTool: 'pen', // 当前工具: select, pen, eraser
    selectedColor: '#000000', // 默认黑色
    brushSize: 5, // 默认笔刷大小
    colors: ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'],
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    points: [], // 存储触摸点用于压感
    showPenPanel: false, // 笔工具面板显示状态
    showEraserPanel: false, // 橡皮擦面板显示状态
    scale: 1, // 画布缩放比例
    scalePercent: 100, // 缩放百分比显示
    offsetX: 0, // 画布X偏移
    offsetY: 0, // 画布Y偏移
    isPanning: false, // 是否正在拖动画布
    lastPanX: 0, // 上一次拖动X坐标
    lastPanY: 0, // 上一次拖动Y坐标
    strokes: [], // 保存所有笔画路径数据
    currentStroke: null // 当前正在绘制的笔画
  },

  onLoad() {
    // 使用 Canvas 2D 新接口初始化
    this.initCanvas();
  },

  // 初始化 Canvas 2D
  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#whiteboardCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          console.error('Canvas 节点获取失败');
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 获取设备像素比，适配高清屏（使用新 API）
        const windowInfo = wx.getWindowInfo();
        const dpr = windowInfo.pixelRatio;
        const width = res[0].width;
        const height = res[0].height;

        // 设置 Canvas 实际像素大小
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // 缩放上下文以匹配 CSS 尺寸
        ctx.scale(dpr, dpr);

        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.dpr = dpr; // 缓存设备像素比，避免重复调用

        // 清空画布
        this.clearBoard();
      });
  },

  onShow() {
    // 页面显示时重新绘制（如果有保存的内容）
    // setTimeout(() => {
    //   this.redrawCanvas();
    // }, 100);
  },

  switchTool(e) {
    const tool = e.currentTarget.dataset.tool;
    const currentTool = this.data.currentTool;
    
    if (currentTool === tool) {
      // 如果点击当前工具，切换面板状态
      if (tool === 'pen') {
        this.setData({
          showPenPanel: !this.data.showPenPanel,
          showEraserPanel: false
        });
      } else if (tool === 'eraser') {
        this.setData({
          showEraserPanel: !this.data.showEraserPanel,
          showPenPanel: false
        });
      } else if (tool === 'select') {
        // 选择工具关闭所有面板
        this.setData({
          showPenPanel: false,
          showEraserPanel: false
        });
      }
    } else {
      // 如果点击不同工具，切换到新工具并关闭所有面板
      this.setData({
        currentTool: tool,
        showPenPanel: false,
        showEraserPanel: false
      });
    }
  },

  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      selectedColor: color
    });
  },

  onBrushSizeChange(e) {
    this.setData({
      brushSize: e.detail.value
    });
  },

  // 转换屏幕坐标到画布坐标
  screenToCanvas(x, y) {
    const { scale, offsetX, offsetY } = this.data;
    return {
      x: (x - offsetX) / scale,
      y: (y - offsetY) / scale
    };
  },

  onTouchStart(e) {
    const touch = e.touches[0];
    const x = touch.x;
    const y = touch.y;
    
    // 双指操作
    if (e.touches.length > 1) {
      this.handlePinchStart(e);
      return;
    }

    const { currentTool, scale, offsetX, offsetY } = this.data;

    // 选择工具模式下，支持拖动
    if (currentTool === 'select') {
      this.setData({
        isPanning: true,
        lastPanX: x,
        lastPanY: y
      });
      return;
    }

  // 绘图模式
    const canvasPos = this.screenToCanvas(x, y);
    
    this.setData({
      lastX: x,
      lastY: y,
      isDrawing: true,
      points: [{x: canvasPos.x, y: canvasPos.y, force: touch.force || 1}]
    });

    // 创建新笔画
    if (currentTool === 'pen' || currentTool === 'eraser') {
      const newStroke = {
        tool: currentTool,
        color: this.data.selectedColor,
        size: this.data.brushSize,
        points: [canvasPos],
        isEraser: currentTool === 'eraser'
      };
      
      this.setData({
        currentStroke: newStroke
      });
      
      // 应用当前画布的变换状态进行绘制
      this.ctx.save();
      const dpr = this.dpr || wx.getWindowInfo().pixelRatio || 1;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
      this.ctx.translate(offsetX, offsetY);
      this.ctx.scale(scale, scale);
      this.ctx.beginPath();
      this.ctx.moveTo(canvasPos.x, canvasPos.y);
      this.ctx.restore();
    }
  },

  handlePinchStart(e) {
    if (e.touches.length >= 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      
      const dx = t1.x - t2.x;
      const dy = t1.y - t2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      this.setData({
        pinchStartDistance: distance,
        pinchStartScale: this.data.scale
      });
    }
  },

  onTouchMove(e) {
    const { isDrawing, isPanning, currentTool, scale, offsetX, offsetY } = this.data;
    
    // 双指缩放
    if (e.touches.length > 1) {
      this.handlePinchMove(e);
      return;
    }

    const touch = e.touches[0];
    const x = touch.x;
    const y = touch.y;

    // 拖动画布
    if (isPanning && currentTool === 'select') {
      const dx = x - this.data.lastPanX;
      const dy = y - this.data.lastPanY;
      
      this.setData({
        offsetX: this.data.offsetX + dx,
        offsetY: this.data.offsetY + dy,
        lastPanX: x,
        lastPanY: y
      });
      
      this.redrawCanvas();
      return;
    }

    // 绘图
    if (!isDrawing || !this.ctx) return;
    
    const canvasPos = this.screenToCanvas(x, y);
    this.data.points.push({x: canvasPos.x, y: canvasPos.y, force: touch.force || 1});

    // 应用当前画布的变换状态进行绘制
    this.ctx.save();
    const dpr = this.dpr || wx.getWindowInfo().pixelRatio || 1;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.ctx.translate(offsetX, offsetY);
    this.ctx.scale(scale, scale);

    if (currentTool === 'pen') {
      const pressure = touch.force || 1;
      const dynamicSize = Math.max(1, this.data.brushSize * pressure);
      
      this.ctx.strokeStyle = this.data.selectedColor;
      this.ctx.lineWidth = dynamicSize;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.lineTo(canvasPos.x, canvasPos.y);
      this.ctx.stroke();
    } else if (currentTool === 'eraser') {
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = this.data.brushSize * 3;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.lineTo(canvasPos.x, canvasPos.y);
      this.ctx.stroke();
    }

    this.ctx.restore();

    this.setData({
      lastX: x,
      lastY: y
    });

    // 保存笔画点
    if (this.data.currentStroke) {
      this.data.currentStroke.points.push(canvasPos);
    }
  },

  handlePinchMove(e) {
    if (e.touches.length >= 2 && this.data.pinchStartDistance) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      
      const dx = t1.x - t2.x;
      const dy = t1.y - t2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 计算缩放比例，限制在 0.1 到 5 之间
      const newScale = this.data.pinchStartScale * (distance / this.data.pinchStartDistance);
      const clampedScale = Math.max(0.1, Math.min(5, newScale));
      
      this.setData({
        scale: clampedScale,
        scalePercent: Math.round(clampedScale * 100)
      });
      
      this.redrawCanvas();
    }
  },

  onTouchEnd(e) {
    const { isDrawing, isPanning, currentTool } = this.data;
    
    if (isPanning && currentTool === 'select') {
      this.setData({
        isPanning: false
      });
      return;
    }

    if (isDrawing) {
      this.setData({
        isDrawing: false
      });
      
      if (this.ctx) {
        this.ctx.closePath();
      }
      
      // 保存完成的笔画
      if (this.data.currentStroke) {
        const strokes = this.data.strokes;
        strokes.push(this.data.currentStroke);
        this.setData({
          strokes: strokes,
          currentStroke: null
        });
      }
    }
  },

  onTouchCancel(e) {
    this.setData({
      isDrawing: false,
      isPanning: false
    });
    if (this.ctx) {
      this.ctx.closePath();
    }
  },

  // 重绘整个画布
  redrawCanvas() {
    if (!this.ctx) return;
    
    const { scale, offsetX, offsetY, strokes } = this.data;
    
    // 清空画布
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // 保存当前状态
    this.ctx.save();
    
    // 应用变换
    this.ctx.translate(offsetX, offsetY);
    this.ctx.scale(scale, scale);
    
    // 重绘所有笔画
    strokes.forEach(stroke => {
      if (stroke.points.length < 1) return;
      
      this.ctx.beginPath();
      this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      if (stroke.isEraser) {
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = stroke.size * 3;
      } else {
        this.ctx.strokeStyle = stroke.color;
        this.ctx.lineWidth = stroke.size;
      }
      
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();
    });
    
    // 恢复状态
    this.ctx.restore();
  },

  clearBoard() {
    if (!this.ctx || !this.canvasWidth || !this.canvasHeight) {
      setTimeout(() => this.clearBoard(), 100);
      return;
    }
    
    this.setData({
      strokes: [],
      scale: 1,
      offsetX: 0,
      offsetY: 0
    });
    
    this.redrawCanvas();
  },

  // 缩放控制
  zoomIn() {
    const newScale = Math.min(5, this.data.scale * 1.2);
    this.setData({
      scale: newScale,
      scalePercent: Math.round(newScale * 100)
    });
    this.redrawCanvas();
  },

  zoomOut() {
    const newScale = Math.max(0.1, this.data.scale / 1.2);
    this.setData({
      scale: newScale,
      scalePercent: Math.round(newScale * 100)
    });
    this.redrawCanvas();
  },

  resetView() {
    this.setData({
      scale: 1,
      scalePercent: 100,
      offsetX: 0,
      offsetY: 0
    });
    this.redrawCanvas();
  }
});
