const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    libraryTarget: "commonjs2",
    library: "TimeSeriesInsightsChart",
    path: path.join(__dirname, 'output')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules", //不包括node_modules文件
        loader: "babel-loader",
      }
    ]
  }
}