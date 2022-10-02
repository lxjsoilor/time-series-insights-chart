
/**
 * Author: 林雄军
 * Description: 封装时序见解
 * Date:  
 */
 const closePng = require('./close.png');
 const closeImg = new Image();
 closeImg.src = closePng;
 closeImg.onload = () => {};
 const countDown = (start, end) => {
  if (start === end) return "0秒";
  var startDate = +new Date(start);
  var endDate = +new Date(end);
  var dec = Math.abs((endDate - startDate)) / 1000;
  var d = parseInt(dec / 60 / 60 / 24);
  d = d < 10 ? "0" + d : d;
  var h = parseInt((dec / 60 / 60) % 24);
  h = h < 10 ? "0" + h : h;
  //得到分钟 格式化成前缀加零的样式
  var m = parseInt((dec / 60) % 60);
  m = m < 10 ? "0" + m : m;
  var s = parseInt(dec % 60);
  s = s < 10 ? "0" + s : s;
  if (d > 0) {
    return `${d}天${h}时${m}分${s}秒`;
  }
  if (h > 0) {
    return `${h}时${m}分${s}秒`;
  }
  if (m > 0) {
    return `$${m}分${s}秒`;
  }
  if (s > 0) {
    return `${s}秒`;
  }
};

const log = (arg) => {
  try {
  } catch (e) {
  }
};


const OperationUtils = {
  add: function (arg1, arg2) {
    return arg1 + arg2;
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (
      (OperationUtils.multiply(arg1, m) + OperationUtils.multiply(arg2, m)) / m
    );
  },
  sub: function (arg1, arg2) {
    return arg1 - arg2;
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    n = r1 >= r2 ? r1 : r2;
    return (
      (OperationUtils.multiply(arg1, m) - OperationUtils.multiply(arg2, m)) /
      m
    ).toFixed(n);
  },
  multiply: function (arg1, arg2) {
    return arg1 * arg2;
    if (arg1 == null || arg2 == null) {
      return null;
    }
    var n1, n2;
    var r1, r2; // 小数位数
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    n1 = Number(arg1.toString().replace(".", ""));
    n2 = Number(arg2.toString().replace(".", ""));
    return (n1 * n2) / Math.pow(10, r1 + r2);
  },
  divide: function (arg1, arg2) {
    return arg1 / arg2;
    if (arg1 == null) {
      return null;
    }
    if (arg2 == null || arg2 == 0) {
      return null;
    }
    var n1, n2;
    var r1, r2; // 小数位数
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    n1 = Number(arg1.toString().replace(".", ""));
    n2 = Number(arg2.toString().replace(".", ""));
    return (n1 / n2) * Math.pow(10, r2 - r1);
  },
};

const DEFAULT_CONFIG = {
  colors: ["#FF6410", "#00BAF1", "#00FF23", "#FE004C", "#0052DF", "#F9CA53"],
  padding: [10, 10, 0, 0],
  line: {
    pointsPow: 1,
  },
  yLabel: {
    isRounding: true,
    line: {
      show: true,
      num: 5,
      lineColor: "#ffffffff",
      width: 0,
    },
    font: {
      size: 14,
      color: "#65686C",
      family: "Arial",
      padding: [0, 10, 0, 10],
    },
  },
  xLabel: {
    line: {
      show: true,
      num: 2,
      lineColor: "#333",
      width: 0,
    },
    font: {
      size: 14,
      color: "#FFFFFF",
      family: "Arial",
      padding: [10, 0, 10, 0],
    },
  },
  menus: {
    background: "#FFFFFF",
    fontColor: "#000000",
  },
  chooseBox: {
    background: "rgba(50, 50, 200, 0.5)",
    topBackground: "#01BAF5",
    topFontColor: "#000000",
    bottomBackground: "#FFFEFF",
    bottomFontColor: "#000000",
  },
  statistics: {
    fontColor: "#FFFEFF",
  },
  horizontalLine: {
    color: "#898B8F",
    backgroundColor: "#FFFFFF",
    fontColor: "#000000",
  },
  verticalLine: {
    color: "#898B8F",
    backgroundColor: "#FFFFFF",
    fontColor: "#000000",
  },
};

export default class TimeSeriesInsightsChart {
  constructor(opts) {
    this.dpr = 1;
    this.canvas = opts.canvas;
    this.onMemuSelected = opts.onMemuSelected;
    this.onHistoryChange = opts.onHistoryChange;
    this.ctx = null;
    this.data = opts.data;
    this.originData = opts.data;
    this.currentData = [];
    this.dataValueMax = [];
    this.dataValueMin = [];
    this.config = Object.assign(DEFAULT_CONFIG, opts.config);
    this.yLabel = [];
    this.xLabel = [];
    this.currentPoints = [];
    // 鼠标按下
    this.mouseDown = false;
    this.mouseDownPoint = {};
    // 鼠标移动
    this.mouseMove = false;
    this.mouseMovePoint = {};
    // 鼠标抬起
    this.mouseUp = true;
    this.mouseUpPoint = {};

    this.menuListInvalidArea = {};
    this.mousedownTimer = 0;

    this.currentSelectedDataItemIndex = 0;
    this.horizontalLineItem = {};

    // 同时选取
    this.sameTimeSelect = false;
    // x轴文字
    this.xLabels = [];

    this.dataChangeListener = () => {};

    this.mousedownEventListener = () => {};

    this.pointStatisticsInfo;

    this.hasDataIndex = 0;

    // 缩放比例
    this.scale = 1;
    // 当前选择的菜单index
    this.menusActive = -1;
    // 菜单区域
    this.menusRect = []; // {x, y, w, h}[]
    // 统计框关闭区域
    this.closeRect = {}; // {x, y, w, h}
    // y轴文字的宽度列表，为了取到最宽的
    this.yLableTextWidthList = [];
    // 操作历史记录
    this.historyList = []; // 历史记录
    // 是否是单条线的，针对数据检测的图标
    this.single = false;
    // 滚动距离
    this.scrollTop = 0;
    // 高度
    this.height = 0;
    // 是否正在绘制选择框
    this.isDrawChooseBoxIng = false;
    // 是否正在绘制统计
    this.isDrawCurrentPointStatisticsIng = false;
    // 当前统计的x轴
    this.isDrawCurrentPointStatisticsIngX = 0;
    // 是否是鼠标经过时候触发label提示
    this.isMoveEvent = false;

  }

  setIsMoveEvent(isMoveEvent) {
    this.isMoveEvent = isMoveEvent;
  }

  setScale(scale) {
    this.scale = 1 / scale;
  }

  setScrollTop(scrollTop) {
    this.scrollTop = scrollTop;
    if (!this.sameTimeSelect) return;
    // 开始绘制
    if(this.isDrawChooseBoxIng) {
      this.draw();
      this.drawChooseBox();

      if(this.isDrawCurrentPointStatisticsIng) {
        this.drawCurrentPointStatistics({
          x: this.isDrawCurrentPointStatisticsIngX,
          y: this.mouseDownPoint.sourcePoint.y,
        });
      }
    }
  }

  setSingle(single) {
    this.single = single;
  }

  setColors(colors=["#FF6410", "#00BAF1", "#00FF23", "#FE004C", "#0052DF", "#F9CA53"]) {
    this.config.colors = colors;
    this.draw();
  }

  init(width, height) {
    this.height = height;
    this.initChart(width, height);
    this.initListener();
  }

  setDataChangeListener(fn) {
    this.dataChangeListener = fn;
  }

  setMousedownEventListener(fn) {
    this.mousedownEventListener = fn;
  }

  setPointStatisticsInfo(fn) {
    this.pointStatisticsInfo = fn;
  }

  setWidth(width) {
    if (width) {
      this.initChart(width, this.canvas.height);
    }
    this.draw();
  }

  setHeight(height) {
    if (height) {
      this.initChart(this.canvas.width, height);
    }
    this.draw();
  }

  setSameTimeSelect(bool) {
    this.sameTimeSelect = bool;
    this.mouseDown = false;
  }

  setOriginData(data) {
    this.originData = data;
    this.historyList = [JSON.parse(JSON.stringify(data))];
    this.onHistoryChange && this.onHistoryChange([]);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  refresh() {
    this.setSelectData(this.originData);
    this.draw();
  }

  putHistory(data) {
    this.historyList.push(JSON.parse(JSON.stringify(data)));
    this.onHistoryChange && this.onHistoryChange(this.historyList);
  }

  getPreData() {
    const data = this.historyList.pop() || [[{}]];
    this.onHistoryChange && this.onHistoryChange(this.historyList);
    if(this.historyList.length === 0) {
      this.historyList = [JSON.parse(JSON.stringify(this.originData))];
    }
    if(
      data[0][0].name === this.data[0][0].name &&
      data[0].length === this.data[0].length
    ) {
      if(this.historyList.length > 0) {
        const data2 = this.historyList.pop();
        this.onHistoryChange && this.onHistoryChange(this.historyList);
        if(this.historyList.length === 0) {
          this.historyList = [JSON.parse(JSON.stringify(this.originData))];
        }
        return data2;
      } else {
        return this.originData;
      }
    }
    if(this.historyList.length > 0) {
      return data;
    }
    return this.originData;
  }

  back() {
    this.setSelectData(this.getPreData());
    this.draw();
  }

  initChart(width = 1593, height = 600) {
    this.historyList = [JSON.parse(JSON.stringify(this.originData))];
    this.setSelectData(this.originData);
    this.canvas.width = width;
    const length = this.originData.length;
    let newHeight = height;
    if (length > 3) {
      newHeight = height + (height / 3) * (length - 3);
    }
    this.canvas.height = newHeight;
    this.ctx = this.canvas.getContext("2d");
  }

  initListener() {
    const eventsName = ["mousedown", "mouseup", "mousemove"];
    eventsName.forEach((item) => {
      this.canvas.addEventListener(
        item,
        (e) => {
          this[item + "Event"](e);
        },
        false
      );
    });
  }

  mousedownEvent(e) {
    const pos = this.getCanvasPos(this.canvas, e);
    this.mousedownEventListener(pos);
    // 判断是否鼠标在菜单范围内
    // 绘制选中的点
    if (this.isInside(this.menuListInvalidArea, pos.x, pos.y)) {
      this.listenMenuListClick(pos.x, pos.y);
    } else if(this.isInside(this.closeRect, pos.x, pos.y)) {
      this.draw();
      this.drawChooseBox();
      this.drawMenuList();
    } else {
      this.mouseDownPoint = {
        ...this.getNearX(pos),
        sourcePoint: pos,
      };
      this.mousedownTimer = setTimeout(() => {
        this.mouseDown = true;
      }, 100);
      this.mouseMove = false;
      this.mouseUp = false;
      if(!this.isMoveEvent) {
        this.setCurrentSelectedDataItemIndex(pos.y);
        this.drawCurrentPointAndLine({ x: this.mouseDownPoint.x, y: pos.y });
        this.drawCurrentPointToolBar({ x: this.mouseDownPoint.x, y: pos.y });
      }
      this.isDrawChooseBoxIng = false;
      this.isDrawCurrentPointStatisticsIng = false;
      this.menuListInvalidArea = {};
    }
  }

  setCurrentSelectedDataItemIndex(y) {
    let index = -1;
    this.yLabel.forEach((item, i) => {
      if (y <= item[0].y && index === -1) {
        index = i;
      }
    });
    this.currentSelectedDataItemIndex = index;
  }

  mousemoveEvent(e) {
    if(this.isMoveEvent) {
      const pos = this.getCanvasPos(this.canvas, e);
      this.mouseMovePoint = {
        ...this.getNearX(pos),
        sourcePoint: pos,
      };
      this.setCurrentSelectedDataItemIndex(pos.y);
      this.drawCurrentPointAndLine({ x: this.mouseMovePoint.x, y: pos.y });
      this.drawCurrentPointToolBar({ x: this.mouseMovePoint.x, y: pos.y });
    }
    if (!this.sameTimeSelect) return;
    this.mouseMove = true;
    if (this.mouseDown) {
      const pos = this.getCanvasPos(this.canvas, e);
      this.mouseMovePoint = {
        ...this.getNearX(pos),
        sourcePoint: pos,
      };
      // 开始绘制
      this.drawChooseBox();
    } else {
    }
    this.getMenusActive(e);
  }

  getMenusActive(e) {
    const pos = this.getCanvasPos(this.canvas, e);
    let index = -1;
    this.menusRect.forEach((rect, i) => {
      if(this.isInside(rect, pos.x, pos.y)) {
        index = i
      }
    });
    this.menusActive = index;
    if (index !== -1) {
      this.drawMenuList();
    }
  }

  mouseupEvent(e) {
    if (!this.sameTimeSelect) return;
    clearTimeout(this.mousedownTimer);
    const pos = this.getCanvasPos(this.canvas, e);
    if (this.isInside(this.menuListInvalidArea, pos.x, pos.y)) {
      return;
    } else if(this.isInside(this.closeRect, pos.x, pos.y)) {
      return;
    }
    this.mouseUpPoint = {
      ...this.getNearX(pos),
      sourcePoint: pos,
    };
    if (this.mouseMove && this.mouseDown) {
      // 画菜单
      if (!this.isInside(this.menuListInvalidArea, pos.x, pos.y)) {
        this.drawMenuList();
      }
    }
    this.mouseDown = false;
    this.mouseMove = false;
    this.mouseUp = true;
  }

  drawMenuList() {
    const nameStart = this.mouseDownPoint.name;
    const nameEnd = this.mouseUpPoint.name;
    const indexStart = this.originData[this.hasDataIndex].findIndex(
      ({ name }) => name === nameStart
    );
    const indexEnd = this.originData[this.hasDataIndex].findIndex(
      ({ name }) => name === nameEnd
    );
    if (Math.abs(indexStart - indexEnd) < 1) return;

    // 画菜单
    const menus = ["缩放", "查看统计数据", "导出数据"];
    const menusItemHeight = 30;
    const height = menusItemHeight * menus.length;
    const {
      x: downX,
      y: downY,
      sourcePoint: downSourcePoint,
    } = this.mouseDownPoint;
    const { x: upX, y: upY, sourcePoint: upSourcePoint } = this.mouseUpPoint;
    const width = 100;

    this.ctx.save();
    // 画菜单背景
    this.ctx.fillStyle = this.config.menus.background;
    const rectHeight = upSourcePoint.y - downSourcePoint.y;
    let bgX = 0;

    if(upX > downX) {
      bgX = upX + 10;
    } else {
      bgX = downX + 10;
    }
    if (bgX > this.canvas.width - width) {
      bgX = bgX - width - 10;
    }
    let bgY = upSourcePoint.y - height / 2 - rectHeight / 2;
    // 上边界判断
    if (bgY < this.scrollTop) {
      bgY = bgY + height/2;
    } else 
    // 下边界判断
    if (bgY > this.canvas.height + this.scrollTop - height) {
      bgY = this.canvas.height + this.scrollTop - height - 10;
    }
    this.ctx.fillRect(bgX, bgY, width, height);
    // 画菜单内容
    const padding = 10;
    this.menusRect = [];
    menus.forEach((text, index) => {
      this.menusRect.push({
        x: bgX,
        y: bgY + ((index) * (height / 3)),
        w: width,
        h: height / 3
      });
      if(this.menusActive === index) {
        // 画背景
        this.ctx.fillStyle = "#1567FF";
        this.ctx.fillRect(bgX, bgY + ((this.menusActive) * (height / 3)), width, height / 3);
      }
      // 画文字
      const fontX = bgX + padding;
      const fontY =
        bgY + height / (2 * menus.length) + (height * index) / menus.length;
      this.ctx.textAlign = "start";
      this.ctx.font = "12px Arial";
      if(this.menusActive === index) {
        this.ctx.fillStyle = "#FFF";
      } else {
        this.ctx.fillStyle = this.config.menus.fontColor;
      }
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(text, fontX, fontY);
    });
    //
    this.setMenuListInvalidArea(bgX, bgY, width, height, menus);
    this.ctx.restore();
  }

  listenMenuListClick(clickX, clickY) {
    // 判断clickY 在哪个菜单上
    const { x, y, w, h, menus } = this.menuListInvalidArea;
    const index = Math.ceil((y + h - clickY) / (h / menus.length));
    const selected = menus[menus.length - index];
    const nameStart = this.mouseDownPoint.name;
    const nameEnd = this.mouseUpPoint.name;
    const indexStart = this.originData[this.hasDataIndex].findIndex(
      ({ name }) => name === nameStart
    );
    const indexEnd = this.originData[this.hasDataIndex].findIndex(
      ({ name }) => name === nameEnd
    );
    let start;
    let end;
    if (indexStart > indexEnd) {
      start = indexEnd;
      end = indexStart + 1;
    } else {
      start = indexStart;
      end = indexEnd + 1;
    }
    const newData = JSON.parse(JSON.stringify(this.originData));
    newData.forEach((item, index) => {
      newData[index] = item.splice(start, end - start);
    });
    this.draw();
    if (selected === "缩放") {
      this.putHistory(newData);
      // this.setSelectData(newData);
      this.draw();
    }
    if (selected === "查看统计数据") {
      this.drawChooseBox();
      let x = this.mouseDownPoint.x;
      if(this.mouseUpPoint.x > this.mouseDownPoint.x) {
        x = this.mouseUpPoint.x;
      }
      this.drawCurrentPointStatistics({
        x: x,
        y: this.mouseDownPoint.sourcePoint.y,
      });
    }
    if (selected === "导出数据") {
      this.drawChooseBox();
      this.drawMenuList();
    }
    this.onMemuSelected && this.onMemuSelected(selected, newData);
  }

  setMenuListInvalidArea(x, y, w, h, menus) {
    this.menuListInvalidArea = {
      x,
      y,
      w,
      h,
      menus,
    };
    // this.ctx.rect(x, y, w, h);
  }

  drawChooseBox() {
    this.isDrawChooseBoxIng = true;
    this.clearCanvas();
    this.draw();
    const { x, y, sourcePoint, name } = this.mouseDownPoint;
    const {
      x: x2,
      y: y2,
      sourcePoint: sourcePoint2,
      name: name2,
    } = this.mouseMovePoint;

    // this.drawVerticalLine(x);
    // this.drawVerticalLine(x2);
    this.drawDots(x, "mouseDownPoint");
    this.drawDots(x2, "mouseMovePoint");

    this.ctx.save();
    this.ctx.fillStyle = this.config.chooseBox.background;
    // this.ctx.fillRect(x, sourcePoint.y, x2 - x, sourcePoint2.y - sourcePoint.y);
    this.ctx.fillRect(x, 0, x2 - x, this.canvas.height);
    // 画选框顶部文字
    this.ctx.fillStyle = this.config.chooseBox.topBackground;
    this.ctx.textAlign = "center";
    this.ctx.font = "12px Arial";
    this.ctx.textBaseline = "top";
    // 画文字背景
    let text1;
    if (x2 > x) {
      text1 = `${countDown(name, name2)}`;
    } else {
      text1 = `${countDown(name2, name)}`;
    }
    const width = this.ctx.measureText(text1).width * 1.2;
    this.ctx.fillRect(
      x + (x2 - x) / 2 - width / 2,
      0 + this.scrollTop,
      width,
      20
    );
    this.ctx.fillStyle = this.config.chooseBox.topFontColor;
    this.ctx.fillText(text1, x + (x2 - x) / 2, 5 + this.scrollTop);
    // 画选框底部文字
    this.ctx.textBaseline = "bottom";
    let text2 = `${name}`;
    let text3 = `${name2}`;
    if (x2 > x) {
      text3 = `${name}`;
      text2 = `${name2}`;
    }
    const width2 = this.ctx.measureText(text2).width * 1.2;
    this.ctx.fillStyle = this.config.chooseBox.bottomBackground;
    this.ctx.fillRect(
      x + (x2 - x) / 2 - width2 / 2,
      this.scrollTop + this.height - 30,
      width2,
      30
    );
    this.ctx.fillStyle = this.config.chooseBox.bottomFontColor;
    this.ctx.fillText(text2, x + (x2 - x) / 2, this.scrollTop + this.height);
    this.ctx.fillText(text3, x + (x2 - x) / 2, this.scrollTop + this.height - 15);
    this.ctx.restore();
  }

  // 清除当前画布
  clearCanvas() {
    this.menusRect = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  isInside(rect, x, y) {
    if (!rect.x) return false;
    if (
      x > rect.x &&
      x < rect.x + rect.w &&
      y > rect.y &&
      y < rect.y + rect.h
    ) {
      return true;
    }
    return false;
  }

  // 获取最近的一个坐标点
  // 找到距离当前点击位置最近的坐标点 x 轴
  getNearX({ x, y }) {
    let point;
    let difference = +Infinity;
    this.currentPoints.forEach((item) => {
      let currentDifference = Math.abs(x - item.x);
      if (currentDifference <= difference) {
        point = item;
        difference = currentDifference;
      }
    });
    return {
      ...point,
    };
  }

  // 画统计栏
  drawCurrentPointStatistics({ x, y }) {
    this.isDrawCurrentPointStatisticsIngX = x;
    this.isDrawCurrentPointStatisticsIng = true;
    // 画背景
    const { x: x2, name: startName } = this.mouseDownPoint;
    const { name: endName } = this.mouseUpPoint;

    const itemData = this.data[0];
    let endIndex = itemData.findIndex(item => item.name === endName);
    let startIndex = itemData.findIndex(item => item.name === startName);
    if(startIndex > endIndex) {
      let temp = startIndex;
      startIndex = endIndex;
      endIndex = temp;
    }
    // const rangeData = JSON.parse(JSON.stringify(this.data)).splice
    const rangeData = this.data.map(item => {
      return JSON.parse(JSON.stringify(item)).splice(startIndex, endIndex-startIndex);
    })
    const rangeDataStatistics = rangeData.map(item => {
      let min = 0;
      let max = 0;
      let total = 0;
      let avg = 0;
      item.forEach(item2 => {
        total += item2.value;
        if (min > item2.value) {
          min = item2.value;
        }
        if (max < item2.value) {
          max = item2.value;
        }
      })
      avg = total / item.length;
      return {
        name: item[0].info.title,
        min,
        avg,
        max,
        total
      }
    })
    let infos = [];
    this.ctx.save();
    this.ctx.fillStyle = "rgba(50, 50, 60, 0.8)";
    const count = this.originData.length;
    const width = 346;
    const titleHeight = 80;
    const contextHeight = 80 * count;
    const height = titleHeight + contextHeight;
    const horPadding = 10;
    let direction = horPadding;
    let newY = y - height / 2 + titleHeight + 40;
    if (this.canvas.width - x <= width) {
      direction = -(horPadding + width);
    }
    let newX = x + direction;
    if (newY < 0) {
      newY = horPadding;
    }
    if (newY > this.canvas.height - height) {
      newY = newY - height / 2 - horPadding;
    }
    let timeSpan = "";
    if (x2 < x) {
      timeSpan = `${countDown(startName, endName)}`;
    } else {
      timeSpan = `${countDown(endName, startName)}`;
    }
    this.ctx.fillRect(newX, newY, width, height);
    // 画标题
    this.ctx.textAlign = "start";
    this.ctx.fillStyle = this.config.statistics.fontColor;
    this.ctx.textBaseline = "middle";
    if (x2 >= x) {
      this.ctx.fillText(
        `${endName} -- ${startName}`,
        newX + horPadding,
        newY + titleHeight / 2 - 10 + 10
      );
    } else {
      this.ctx.fillText(
        `${startName} -- ${endName}`,
        newX + horPadding,
        newY + titleHeight / 2 - 10 + 10
      );
    }
    this.ctx.fillText(
      `${timeSpan}`,
      newX + horPadding,
      newY + titleHeight / 2 + 10 + 10
    );
    this.currentData.forEach((data) => {
      data.forEach((item) => {
        if (item.name == endName) {
          infos.push(item.info);
        }
      });
    });

    // 画关闭
    // ctx.drawImage(img,10,10,300,150);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.drawImage(
      closeImg,
      newX + width - 25,
      newY + 10,
      12,
      12
    );
    this.closeRect = {
      x: newX + width - 25 - 6,
      y: newY + 10 - 6,
      w: 12 + 12,
      h: 12 + 12
    }

    let pointStatisticsInfo = new Array(count).fill(true);
    if (this.pointStatisticsInfo) {
      pointStatisticsInfo = this.pointStatisticsInfo(this.mouseDownPoint, this.mouseUpPoint);
      this.drawPointStatisticsInfo({
        newX, newY, horPadding, titleHeight, contextHeight, infos: pointStatisticsInfo, pointStatisticsInfo
      })
    } else {
      this.drawPointStatisticsInfo({
        newX, newY, horPadding, titleHeight, contextHeight, infos, pointStatisticsInfo, rangeDataStatistics
      })
    }
    this.ctx.restore();
  }

  drawPointStatisticsInfo({newX, newY, horPadding, titleHeight, contextHeight, infos, pointStatisticsInfo, rangeDataStatistics}) {
    // 画内容
    const count = pointStatisticsInfo.length;
    pointStatisticsInfo.forEach((item, index) => {
      // 画线条
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.config.colors[index];
      this.ctx.moveTo(
        newX + horPadding,
        newY + titleHeight + horPadding + (contextHeight * index) / count
      );
      this.ctx.lineTo(
        newX + horPadding,
        newY + titleHeight + (contextHeight * (index + 1)) / count - horPadding
      );
      this.ctx.closePath();
      this.ctx.stroke();
      // 画文字
      this.ctx.textAlign = "start";
      this.ctx.font = "12px Arial";
      this.ctx.fillStyle = this.config.statistics.fontColor;
      this.ctx.textBaseline = "middle";
      const textHeight = 10;
      const length = 75 - horPadding;
      const lengthItem = length / 3;
      const info = infos[index];
      new Array(3).fill(true).forEach((item2, index2) => {

        if (index2 == 0) {
          this.ctx.fillText(
            rangeDataStatistics[index].name,
            newX + horPadding + horPadding,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
        }
        if (index2 == 1) {
          this.ctx.fillText(
            "min",
            newX + horPadding + horPadding,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
          this.ctx.fillText(
            "max",
            newX + horPadding + horPadding + 80,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
          this.ctx.fillText(
            "avg",
            newX + horPadding + horPadding + 160,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
        }
        if (index2 == 2) {
          this.ctx.fillText(
            rangeDataStatistics[index].min.toFixed(2),
            newX + horPadding + horPadding,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
          this.ctx.fillText(
            rangeDataStatistics[index].max.toFixed(2),
            newX + horPadding + horPadding + 80,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
          this.ctx.fillText(
            rangeDataStatistics[index].avg.toFixed(2),
            newX + horPadding + horPadding + 160,
            newY +
              titleHeight +
              horPadding +
              (contextHeight * index) / count +
              textHeight +
              lengthItem * index2
          );
        }
    

      });
    });
  }

  drawCurrentPointToolBarFn(x, y, n) {

    let { name } = this.mouseDownPoint;
    if(this.isMoveEvent) {
      name = this.mouseMovePoint.name;
    }
    let infos = [];
    this.ctx.save();
    this.ctx.fillStyle = "rgba(50, 50, 60, 0.8)";

    const count = n;
    const width = 200;
    let height = 80 * count;
    const horPadding = 10;
    let direction = horPadding;
    let newY = y - height / 2;
    if (this.canvas.width - x <= width) {
      direction = -(horPadding + width);
    }
    if (newY < 0) {
      newY = horPadding;
    }
    if (newY > this.canvas.height - height) {
      newY = newY - height / 2 - horPadding;
    }
    let newX = x + direction;
    if(this.single) {
      height = 80 - 20;
    }
    this.ctx.fillRect(newX, newY, width, height);
    // 画内容
    if (this.count === 1) {
      const currentDataItem = this.currentData[this.currentSelectedDataItemIndex];
      if(currentDataItem.length > 0) {
        currentDataItem.forEach((item) => {
          if (item.name == name) {
            infos.push(item.info);
          }
        });
      } else {
        infos.push({});
      }
    } else {
      this.currentData.forEach((data) => {
        if(data.length > 0) {
          data.forEach((item) => {
            if (item.name == name) {
              infos.push(item.info);
            }
          });
        } else {
          infos.push({});
        }
      });
    }
    new Array(count).fill(true).forEach((item, index) => {
      let color = this.config.colors[this.currentSelectedDataItemIndex];
      if (count !== 1) {
        color = this.config.colors[index];
      }
      if (!this.single) {
        // 画线条
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(
          newX + horPadding,
          newY + horPadding + (height * index) / count
        );
        this.ctx.lineTo(
          newX + horPadding,
          newY + (height * (index + 1)) / count - horPadding
        );
        this.ctx.closePath();
        this.ctx.stroke();
      }

      // 画文字
      this.ctx.textAlign = "start";
      this.ctx.font = "12px Arial";
      this.ctx.fillStyle = this.config.statistics.fontColor;
      this.ctx.textBaseline = "middle";
      const textHeight = 10;
      const length = 75 - horPadding;
      const lengthItem = length / 3;
      let info = infos[this.currentSelectedDataItemIndex];
      if (this.sameTimeSelect) {
        info = infos[index];
      }
      if (this.single) {
        new Array(2).fill(true).forEach((item2, index2) => {
          let infoText = "";
          if (index2 === 0) {
            infoText = info.date || '';
          }
          if (index2 === 1) {
            infoText = info.value || '';
          }
          this.ctx.fillText(
            infoText,
            newX + horPadding + horPadding - (this.single ? 5 : 0),
            newY +
              horPadding +
              (height * index) / count +
              textHeight +
              lengthItem * index2
          );
        });
      } else {
        new Array(3).fill(true).forEach((item2, index2) => {
          let infoText = "";
          if (index2 === 0) {
            infoText = info.title || '';
          }
          if (index2 === 1) {
            infoText = info.date || '';
          }
          if (index2 === 2) {
            infoText = info.value || '';
          }
          this.ctx.fillText(
            infoText,
            newX + horPadding + horPadding - (this.single ? 5 : 0),
            newY +
              horPadding +
              (height * index) / count +
              textHeight +
              lengthItem * index2
          );
        });
      }
    });
    this.ctx.restore();
  }

  // 画工具栏
  drawCurrentPointToolBar({ x, y }) {
    const currentDataItem = this.currentData[this.currentSelectedDataItemIndex];
    if (currentDataItem.length <= 0) return;
    // 画背景
    if (this.sameTimeSelect) {
      this.drawCurrentPointToolBarFn(x, y, this.originData.length);
      return;
    }
    this.drawCurrentPointToolBarFn(x, y, 1);
  }

  // 画圆和线条
  drawCurrentPointAndLine({ x, y }) {
    this.clearCanvas();
    this.draw();
    // 画线条
    // 画横线条
    this.drawHorizontalLine();
    this.drawHorizontalLineText();
    // 画竖线条
    this.drawVerticalLine(x);
    // 画圆
    this.drawDots(x);
  }
  drawHorizontalLine() {
    this.ctx.save();
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = this.config.horizontalLine.color;
    this.ctx.beginPath();
    this.ctx.setLineDash([3, 6]);
    let y = this.getHorizontalLineItem().y;
    if(!y) return;
    this.ctx.moveTo(this.xLabel[this.hasDataIndex][0].x, y);
    this.ctx.lineTo(this.canvas.width, y);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.restore();
  }
  getHorizontalLineItem() {
    let { name } = this.mouseDownPoint;
    if(this.isMoveEvent) {
      name = this.mouseMovePoint.name;
    }
    if (this.currentSelectedDataItemIndex === -1) {
      return {};
    }
    const currentDataItem = this.currentData[this.currentSelectedDataItemIndex];
    if(currentDataItem.length > 0) {
      currentDataItem.forEach((item) => {
        if (item.name === name) {
          this.horizontalLineItem = item;
        }
      });
    } else {
      this.horizontalLineItem = {};
    }

    return this.horizontalLineItem;
  }
  drawHorizontalLineText() {
    if(this.isMoveEvent) {
      return;
    }
    const { y, value } = this.getHorizontalLineItem();
    if(!y) return;
    const padding = 10;
    this.ctx.save();
    // 画背景
    this.ctx.fillStyle = this.config.horizontalLine.backgroundColor;
    const width = this.ctx.measureText(value.toFixed(3)).width + 2 * padding;
    this.ctx.fillRect(this.xLabel[this.hasDataIndex][0].x, y - 10, width, 18);
    // 画文字
    this.ctx.textAlign = "start";
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = this.config.horizontalLine.fontColor;
    this.ctx.textBaseline = "middle";
    this.ctx.fillText((value / 10).toFixed(3), this.xLabel[this.hasDataIndex][0].x + padding, y);
    this.ctx.restore();
  }
  drawDots(x, str = "mouseDownPoint") {
    // 获取所有的y画所有的圆点
    // 根据name 获取所有的y
    if(this.isMoveEvent) {
      str = 'mouseMovePoint';
    }
    const name = this[str].name;
    // 判断是否是同时选取
    if (this.sameTimeSelect) {
      const ys = this.currentData.map((data) => {
        let currentY;
        data.forEach((item) => {
          if (item.name == name) {
            currentY = item.y;
          }
        });
        return currentY;
      });
      ys.forEach((y, index) => {
        this.ctx.save();
        this.ctx.fillStyle = this.config.colors[index];
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
      });
      return;
    }
    const data = this.currentData[this.currentSelectedDataItemIndex];
    let currentY;
    if(data) {
      data.forEach((item) => {
        if (item.name == name) {
          currentY = item.y;
        }
      });
    } else {
      this.mousedownEventListener();
    }
    this.ctx.save();
    this.ctx.fillStyle = this.config.colors[this.currentSelectedDataItemIndex];
    this.ctx.beginPath();
    this.ctx.arc(x, currentY, 5, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawVerticalLine(x) {
    this.ctx.save();
    // 画线条
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = this.config.verticalLine.color;
    // 判断是否是同时选取
    this.ctx.beginPath();
    if (true) {
      this.ctx.moveTo(x, 0);
      if (this.single) {
        this.ctx.lineTo(x, this.yLabel[this.originData.length - 1][0].y + 22);
      } else {
        this.ctx.lineTo(x, this.canvas.height);
      }

    } else {
      const labels = this.yLabel[this.currentSelectedDataItemIndex];
      this.ctx.moveTo(x, labels[0].y);
      this.ctx.lineTo(x, labels[labels.length - 1].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }

  setSelectData(data) {
    this.data = data;
    this.dataValueMax = [];
    this.dataValueMin = [];
    data.forEach((item) => {
      if(item.length <= 0) {
        this.dataValueMax.push(0);
        this.dataValueMin.push(0);
      } else {
        this.dataValueMax.push(item[0].value);
        this.dataValueMin.push(item[0].value);
      }
    });
    this.dataChangeListener(data);
  }

  draw() {
    this.clearCanvas();
    if (!this.data.length) {
      return;
    }
    this.currentData = [];
    this.dataValueMax = [];
    this.dataValueMin = [];
    this.data.forEach((item) => {
      if(item.length <= 0) {
        this.dataValueMax.push(0);
        this.dataValueMin.push(0);
      } else {
        this.dataValueMax.push(item[0].value);
        this.dataValueMin.push(item[0].value);
      }
    });
    let hasEvent = false;
    this.data.forEach((dataItem, index) => {
      dataItem = JSON.parse(JSON.stringify(this.getNewData(dataItem)));
      this.initCoordinateSystem(dataItem, index);
      this.initData(dataItem, false, index);
      this.drawCoordinateSystem(index);
      this.drawLine(dataItem, index);
      this.currentData[index] = dataItem;
      if(dataItem.length > 0 && !hasEvent) {
        hasEvent = true;
        this.hasDataIndex = index;
        this.events(JSON.parse(JSON.stringify(dataItem)));
      }
    });
  }

  getStyles(obj) {
    //兼容FF，IE10; IE9及以下未测试
    return document.defaultView.getComputedStyle(obj);
  }

  getCanvasPos(canvas, e) {
    const { x, y } = this.getXY(canvas, e);
    return {
      x,
      y,
    };
  }

  getXY(canvas, evt){
    let style = window.getComputedStyle(canvas, null);
    //宽高
    let cssWidth = parseFloat(style["width"]);
    let cssHeight = parseFloat(style["height"]);
    //各个方向的边框长度
    let borderLeft = parseFloat(style["border-left-width"]);
    let borderTop = parseFloat(style["border-top-width"]);
    let paddingLeft = parseFloat(style["padding-left"]);
    let paddingTop = parseFloat(style["padding-top"]);

    let scaleX = canvas.width / cssWidth; // 水平方向的缩放因子
    let scaleY = canvas.height / cssHeight; // 垂直方向的缩放因子

    let x = evt.clientX;
    let y = evt.clientY;

    let rect = canvas.getBoundingClientRect();
    x -= (rect.left + borderLeft + paddingLeft); // 去除 borderLeft paddingLeft 后的坐标
    y -= (rect.top + borderTop + paddingTop); // 去除 borderLeft paddingLeft 后的坐标
    x *= scaleX; // 修正水平方向的坐标
    y *= scaleY; // 修正垂直方向的坐标
    x *= this.scale;
    y *= this.scale;
    return {x,y}
  };


  // 事件相关
  events(data) {
    data = data.filter((item) => {
      return item.isReal;
    });
    this.currentPoints = data;
    this.moveFlag = true;
    this.canvas.addEventListener("touchmove", (e) => {
      if (this.moveFlag) {
        this.moveFlag = false;
        let clientX = e.changedTouches[0].clientX * this.dpr;
        let point = null;

        let pointLeft = null;
        let pointRight = null;
        for (let i = 0; i < data.length; i++) {
          if (i === data.length - 1 || (data[i].x > clientX && i === 0)) {
            pointLeft = data[i];
            pointRight = data[i];
          } else if (data[i].x > clientX) {
            pointRight = data[i];
            break;
          } else {
            pointLeft = data[i];
          }
        }

        if (
          clientX - pointLeft.x / this.dpr >
          pointRight.x / this.dpr - clientX
        ) {
          point = pointRight;
        } else {
          point = pointLeft;
        }
        this.moveFlag = true;
      }
      e.preventDefault();
    });
  }
  //初始化数据坐标点
  initData(data, isReal, i) {
    let xWidthStep =
      (this.canvas.width -
        this.yLabel[i][0].x -
        (this.config.yLabel.font.padding[1] + this.config.padding[1]) *
          this.dpr) /
      (data.length - 1);
    data.forEach((item, index) => {
      item.isReal = isReal || item.isReal;
      item.x =
        this.yLabel[i][0].x +
        this.config.yLabel.font.padding[1] * this.dpr +
        xWidthStep * index;
      item.y = this.calculateY(item.value, i);
    });
  }
  getNewData(data) {
    let points = [];
    let divisions = (data.length - 1) * this.config.line.pointsPow;
    for (let d = 0; d <= divisions; d++) {
      points.push(
        this.getPoint(OperationUtils.divide(d, divisions), divisions, data)
      );
    }
    return points;
  }
  getPoint(t, divisions, data) {
    const points = data;
    const isRealI =
      OperationUtils.multiply(t, divisions) % this.config.line.pointsPow;
    const p = OperationUtils.multiply(points.length - 1, t);
    const intPoint = Math.floor(p);
    const weight = p - intPoint;
    const p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
    const p1 = points[intPoint];
    const p2 =
      points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
    const p3 =
      points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];
    return {
      isReal: isRealI === 0,
      name:
        isRealI === 0
          ? points[
              OperationUtils.divide(
                OperationUtils.multiply(t, divisions),
                this.config.line.pointsPow
              )
            ].name
          : null,
      info:
        isRealI === 0
          ? points[
              OperationUtils.divide(
                OperationUtils.multiply(t, divisions),
                this.config.line.pointsPow
              )
            ].info
          : {},
      value: this.catmullRom(weight, p0.value, p1.value, p2.value, p3.value),
    };
  }
  catmullRom(t, p0, p1, p2, p3) {
    const v0 = OperationUtils.multiply(OperationUtils.sub(p2, p0), 0.5);
    const v1 = OperationUtils.multiply(OperationUtils.sub(p3, p1), 0.5);
    const t2 = OperationUtils.multiply(t, t);
    const t3 = OperationUtils.multiply(t, t2);
    return (
      (2 * p1 - 2 * p2 + v0 + v1) * t3 +
      (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
      v0 * t +
      p1
    );
  }
  // 连接点绘制线
  drawLine(data, index) {
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.lineWidth = 1 * this.dpr;
    this.ctx.strokeStyle = this.config.colors[index];
    this.ctx.lineJoin = "round";
    data.forEach((item) => {
      this.ctx.lineTo(item.x, item.y);
    });
    this.ctx.stroke();
    this.ctx.closePath();

    // if (this.config.line.points.show) {
    //   data.forEach((item) => {
    //     if (item.isReal) {
    //       this.ctx.beginPath();
    //       this.ctx.fillStyle = this.config.line.points.outside.color;
    //       this.ctx.arc(
    //         item.x,
    //         item.y,
    //         this.config.line.points.outside.r * this.dpr,
    //         0,
    //         2 * Math.PI
    //       );
    //       this.ctx.fill();
    //       this.ctx.closePath();

    //       this.ctx.beginPath();
    //       this.ctx.fillStyle = this.config.line.points.insideArc.color;
    //       this.ctx.arc(
    //         item.x,
    //         item.y,
    //         this.config.line.points.insideArc.r * this.dpr,
    //         0,
    //         2 * Math.PI
    //       );
    //       this.ctx.fill();
    //       this.ctx.closePath();
    //     }
    //   });
    // }
  }

  //初始化坐标系
  initCoordinateSystem(data, index) {
    data.forEach((item) => {
      if (typeof item.value === "number") {
        if (item.value > this.dataValueMax[index]) {
          this.dataValueMax[index] = item.value;
        } else if (item.value < this.dataValueMin[index]) {
          this.dataValueMin[index] = item.value;
        }
      }
    });
    if (this.dataValueMin[index] > 0) {
      // this.dataValueMin[index] = 0;
    }

    this.yLabel[index] = this.config.yLabel.isRounding
      ? this.buildYLabelRounding(index)
      : this.buildYLabel();
    this.xLabel = this.buildXLabel(
      JSON.parse(JSON.stringify(this.data)),
      index
    );
  }
  // x轴值处理
  buildXLabel(data, index) {
    if(index === 0) {
      this.xLabels = [];
    }
    // if (data.length === 1) {
    //   this.config.xLabel.line.num = 1;
    //   xLabels = data;
    // } else if (data.length === 2) {
    //   this.config.xLabel.line.num = 2;
    //   xLabels = data;
    // } else if (
    //   data.length <
    //   this.config.xLabel.line.num * 2 + (this.config.xLabel.line.num - 2)
    // ) {
    //   this.config.xLabel.line.num = 2;
    //   xLabels = [data[0], data[data.length - 1]];
    // } else {
    //   let xLableStep = Math.floor(
    //     (data.length - this.config.xLabel.line.num) /
    //       (this.config.xLabel.line.num - 1)
    //   );
    //   for (let i = 0; i < this.config.xLabel.line.num - 1; i++) {
    //     xLabels.push(data[xLableStep * i + i]);
    //   }
    //   xLabels.push(data[data.length - 1]);
    // }

    this.xLabels[index] = data[index];

    let y =
      this.canvas.height -
      (this.config.xLabel.font.padding[2] + this.config.padding[2]) * this.dpr;
    let xWidthStep =
      (this.canvas.width -
        this.yLabel[index][0].x -
        (this.config.yLabel.font.padding[1] + this.config.padding[1]) *
          this.dpr) /
      (this.xLabels[index].length - 1);
    for (let i = 0; i < this.xLabels[index].length; i++) {
      this.xLabels[index][i].x =
        this.yLabel[index][0].x +
        this.config.yLabel.font.padding[1] * this.dpr +
        xWidthStep * i;
      this.xLabels[index][i].y = y;
      this.xLabels[index][i].textAlign =
        i === 0 ? "left" : i === this.xLabels[index].length - 1 ? "right" : "center";
      this.xLabels[index][i].textBaseline = "bottom";
    }
    return this.xLabels;
  }
  // 取整y轴值处理
  buildYLabelRounding(index) {
    let newMax = Math.ceil(this.dataValueMax[index] * 1000);
    let newMin = Math.floor(this.dataValueMin[index] * 1000);
    let difference = newMax - newMin;
    let step = difference / this.config.yLabel.line.num;
    let isShowNought = step;

    // 寻找距离0最近的y
    // 小幅波动特殊处理
    // 如果newMin > 0 则newMin距离0最近  如果小于可接受比例，则展示0
    // 如果newMax < 0 则newMax距离0最近  如果小于可接受比例，则展示0
    // 否则数据路过0 让y轴坐标线距离0最近的参数回归0
    if (difference < 10) {
      step = 10;
      newMax = Math.ceil((newMax + 20) / 10) * 10;
      newMin = newMax - step * this.config.yLabel.line.num;
    }

    let stepIndex = 1;
    while (
      difference >=
      Math.pow(10, stepIndex + 1) * (this.config.yLabel.line.num - 1)
    ) {
      stepIndex++;
    }
    let ceilNumber = Math.pow(10, stepIndex);
    if (newMin >= 0) {
      if (newMin < isShowNought) {
        newMax = Math.ceil(newMax / ceilNumber) * ceilNumber;
        // step =
        //   Math.ceil(newMax / this.config.yLabel.line.num / ceilNumber) *
        //   ceilNumber;
        step = (newMax - newMin) / this.config.yLabel.line.num;
        if (newMax % step) {
          newMax = step * Math.ceil(newMax / step);
        }
        newMin = newMax - step * this.config.yLabel.line.num;
      } else {
        newMin = Math.floor(newMin / ceilNumber) * ceilNumber;
        // step =
        //   Math.ceil(
        //     (newMax - newMin) / this.config.yLabel.line.num / ceilNumber
        //   ) * ceilNumber;
        step = (newMax - newMin) / this.config.yLabel.line.num;
        newMax = newMin + step * this.config.yLabel.line.num;

      }
    } else if (newMax <= 0) {
      if (-newMax < isShowNought) {
        newMin = Math.floor(newMin / ceilNumber) * ceilNumber;
        step =
          Math.ceil(-newMin / this.config.yLabel.line.num / ceilNumber) *
          ceilNumber;
        if (-newMin % step) {
          newMin = step * Math.floor(newMin / step);
        }
        newMax = newMin + step * this.config.yLabel.line.num;
      } else {
        newMax = Math.ceil(newMax / ceilNumber) * ceilNumber;
        step =
          Math.ceil(
            (newMax - newMin) / this.config.yLabel.line.num / ceilNumber
          ) * ceilNumber;
        newMin = newMax - step * this.config.yLabel.line.num;
      }
    } else {
      // 计算到0的步时
      let i = 0;
      // newMax = Math.ceil(newMax / ceilNumber) * ceilNumber;
      // newMin = Math.floor(newMin / ceilNumber) * ceilNumber;
      let newValue = newMax > -newMin ? -newMin : newMax;
      let newValueOld = newValue;
      while (newValue - step >= 0) {
        newValue -= step;
        i++;
      }

      let supplementValue1 = newValueOld - step * i;
      let supplementValue2 = step * (i + 1) - newValueOld;
      // 让y轴坐标线距离0最近的参数回归0 加大step
      if (i === 0) {
        if (newMax > -newMin) {
          // step =
          //   Math.ceil(newMax / (this.config.yLabel.line.num - 1) / ceilNumber) *
          //   ceilNumber;
          step = (newMax - newMin) / this.config.yLabel.line.num;

          // newMax = step * (this.config.yLabel.line.num - 1);
          // newMin = -step;
        } else {
          // step =
          //   Math.ceil(
          //     -newMin / (this.config.yLabel.line.num - 1) / ceilNumber
          //   ) * ceilNumber;
          step = (newMax - newMin) / this.config.yLabel.line.num;

          // newMax = step;
          // newMin = -step * (this.config.yLabel.line.num - 1);
        }
      } else if (supplementValue1 > supplementValue2) {
        if (newMax > -newMin) {
          // 采用newMin计算进入 0上方步长小 用newMax加大step
          step =
            Math.ceil(
              newMax / (this.config.yLabel.line.num - (i + 1)) / ceilNumber
            ) * ceilNumber;
          newMax = step * (this.config.yLabel.line.num - (i + 1));
          newMin = newMax - step * this.config.yLabel.line.num;
        } else {

          // 采用newMax计算进入 0下方步长小 用newMin加大step
          step =
            Math.ceil(
              -newMin / (this.config.yLabel.line.num - (i + 1)) / ceilNumber
            ) * ceilNumber;
          newMin = -step * (this.config.yLabel.line.num - (i + 1));
          newMax = newMin + step * this.config.yLabel.line.num;
        }
      } else {
        if (newMax > -newMin) {
          // 采用newMin计算进入 0下方步长小 用newMin加大step
          step = Math.ceil(-newMin / i / ceilNumber) * ceilNumber;
          newMin = -step * i;
          newMax = newMin + step * this.config.yLabel.line.num;
        } else {
          // 采用newMax计算进入 0上方步长小 用newMax加大step
          step = Math.ceil(newMax / i / ceilNumber) * ceilNumber;
          newMax = step * i;
          newMin = newMax - step * this.config.yLabel.line.num;
        }
      }
    }

    this.dataValueMax[index] = newMax / 1000;
    this.dataValueMin[index] = newMin / 1000;
    step = step / 1000;
    return this.buildYLabel(step, index);
  }
  // y轴值处理
  buildYLabel(step, index) {
    if (!step) {
      let difference = this.dataValueMax[index] - this.dataValueMin[index];
      step = difference / this.config.yLabel.line.num;
    }

    this.ctx.font =
      this.config.yLabel.font.size * this.dpr +
      "px " +
      this.config.yLabel.font.family;
    let dataValueMaxTextWidth = this.ctx.measureText(
      (this.dataValueMax[index] > 0 ? "+" : "") +
        this.dataValueMax[index].toFixed(3)
    ).width;
    let dataValueMinTextWidth = this.ctx.measureText(
      (this.dataValueMax[index] > 0 ? "+" : "") +
        this.dataValueMin[index].toFixed(3)
    ).width;
    let yLableTextWidth =
      (dataValueMaxTextWidth > dataValueMinTextWidth
        ? dataValueMaxTextWidth
        : dataValueMinTextWidth) +
      (this.config.padding[3] + this.config.yLabel.font.padding[3]) * this.dpr;
    let cur = "";
    let yLabels = [];
    for (let i = 0; i <= this.config.yLabel.line.num; i++) {
      cur = (this.dataValueMin[index] + i * step).toFixed(3);
      if (+cur === 0) {
        cur = "0.00";
      } else if (+cur > 0) {
        cur = `${cur}`;
      }
      let value = +cur/10;
      if (value < 0) {
        value = value.toFixed(3);
      }else {
        value = value.toFixed(3);
      }
      if (value === '-0.000') {
        value = '0.000'
      }
      yLabels.push({
        value,
        // x: yLableTextWidth,
        x: 60,
        y: this.calculateY(+cur, index),
        textAlign: "right",
        textBaseline: "middle",
      });
    }
    return yLabels;
  }
  calculateY(value, index) {
    return (
      (this.config.yLabel.font.size / 2 + this.config.padding[0]) * this.dpr +
      ((this.dataValueMax[index] - value) /
        (this.dataValueMax[index] - this.dataValueMin[index])) *
        (this.canvas.height / this.originData.length -
          (this.config.padding[0] +
            this.config.padding[2] +
            this.config.xLabel.font.size +
            this.config.xLabel.font.padding[0] +
            this.config.xLabel.font.padding[2] +
            this.config.yLabel.font.size / 2) *
            this.dpr) +
      (this.canvas.height * index) / this.originData.length
    );
  }
  //绘制坐标系
  drawCoordinateSystem(index) {
    // 绘制y轴
    if (this.config.yLabel.line.show) {
      for (let i = 0; i < this.yLabel[index].length; i++) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.config.yLabel.font.color;
        this.ctx.textAlign = this.yLabel[index][i].textAlign;
        this.ctx.textBaseline = this.yLabel[index][i].textBaseline;
        this.ctx.font =
          this.config.yLabel.font.size * this.dpr +
          "px " +
          this.config.yLabel.font.family;
        this.ctx.fillText(
          this.yLabel[index][i].value,
          this.yLabel[index][i].x,
          this.yLabel[index][i].y
        );
        this.ctx.closePath();
      }
    }
  }
}


function drawPath(path, ctx) {
  var Vector2 = function (x, y) {
    this.x = x;
    this.y = y;
  };
  Vector2.prototype = {
    "length": function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    "normalize": function () {
      var inv = 1 / this.length();
      return new Vector2(this.x * inv, this.y * inv);
    },
    "add": function (v) {
      return new Vector2(this.x + v.x, this.y + v.y);
    },
    "multiply": function (f) {
      return new Vector2(this.x * f, this.y * f);
    },
    "dot": function (v) {
      return this.x * v.x + this.y * v.y;
    },
    "angle": function (v) {
      return Math.acos(this.dot(v) / (this.length() * v.length())) * 180 / Math.PI;
    }
  };
  function getControlPoint(path) {
    var rt = 0.3;
    var i = 0, count = path.length - 2;
    var arr = [];
    for (; i < count; i++) {
      var a = path[i], b = path[i + 1], c = path[i + 2];
      var v1 = new Vector2(a.x - b.x, a.y - b.y);
      var v2 = new Vector2(c.x - b.x, c.y - b.y);
      var v1Len = v1.length(), v2Len = v2.length();
      var centerV = v1.normalize().add(v2.normalize()).normalize();
      var ncp1 = new Vector2(centerV.y, centerV.x * -1);
      var ncp2 = new Vector2(centerV.y * -1, centerV.x);
      if (ncp1.angle(v1) < 90) {
        var p1 = ncp1.multiply(v1Len * rt).add(b);
        var p2 = ncp2.multiply(v2Len * rt).add(b);
        arr.push(p1, p2)
      }
      else {
        var p1 = ncp1.multiply(v2Len * rt).add(b);
        var p2 = ncp2.multiply(v1Len * rt).add(b);
        arr.push(p2, p1)
      }
    }
    return arr;
  }
  var point = getControlPoint(path);
  return {
    point,
    path
  }

}