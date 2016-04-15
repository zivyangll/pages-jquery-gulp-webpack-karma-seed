var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'scripts');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'scripts', item);
        }
    });
    console.log(JSON.stringify(files));
    return files;
}

module.exports = {
  cache: true,
  devtool: "source-map", //生成sourcemap,便于开发调试
  entry: getEntry(),
  output: {
        path: path.join(__dirname, "dist/scripts/"),
        publicPath: "dist/scripts/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  },
  plugins: [
    new CommonsChunkPlugin('common.js'),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.ProvidePlugin({ // 默认所有文件引入jquery
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  externals: { // 定义全局变量
    // require('data') is external and available
    'anthor': 'yll'
  }
};
