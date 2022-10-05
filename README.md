# 时序见解封装
## 导入

`npm i time-series-insights-chart-base -S`

## 默认配置项

```javascript
{
  colors: ["#FF6410", "#00BAF1", "#00FF23", "#FE004C", "#0052DF", "#F9CA53"],
  padding: [10, 10, 0, 0],
  line: {
    pointsPow: 10,
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
      color: "#FFFFFF",
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
}
```

## 初始化图表
```javascript
this.timeSeriesInsightsChart = new TimeSeriesInsightsChart({
  canvas: this.$refs["canvasDom"],
  data: JSON.parse(JSON.stringify(this.data)),
  config: this.config,
  onMemuSelected: (type, data) => {
    // 菜单点击
  },
});
this.timeSeriesInsightsChart.setDataChangeListener((data) => {
  // 数据显示改变
});
// 初始化
this.timeSeriesInsightsChart.init(this.width, this.height);
// 设置是否可以同时选取
this.timeSeriesInsightsChart.setSameTimeSelect(this.sameTimeSelect);
// 开始绘制
this.timeSeriesInsightsChart.draw();
```

## 修改图表
```javascript
// 设置数据源
this.timeSeriesInsightsChart.setOriginData(JSON.parse(JSON.stringify(this.data)))
// 设置宽高
this.timeSeriesInsightsChart.initChart(this.width, this.height)
// 设置是否可以同时选取
this.timeSeriesInsightsChart.setSameTimeSelect(this.sameTimeSelect);
// 开始绘制
this.timeSeriesInsightsChart.draw();
```

## 其他方法直接看源码
