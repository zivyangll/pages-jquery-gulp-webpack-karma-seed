// 载入插件
var gulp = require('gulp'),
  sass = require('gulp-sass'), // 编译并压缩sass
  jade = require('gulp-jade'), // 编译jade
  sourcemaps = require('gulp-sourcemaps'), // 生成sourcemap
  autoprefixer = require('gulp-autoprefixer'), // css前缀
  imagemin = require('gulp-imagemin'), // 最小化图片
  gutil = require('gulp-util') , // 如果有自定义方法，可能会用到
  shell = require("gulp-shell"), // 执行shell命令
  rev = require('gulp-rev'), // 添加md5
  revDel = require('rev-del'), // 删除md5冗余文件
  revCollector = require('gulp-rev-collector'), //替换html，css，js中引用的文件名
  htmlmin = require('gulp-htmlmin'), // 压缩html
  clean = require('gulp-clean'), // 清理文件夹
  webserver = require('gulp-webserver'), // 静态文件服务器
  notify = require('gulp-notify'), // 桌面通知
  cache = require('gulp-cache'), // 只压缩修改的图片，没有修改的图片直接从缓存文件读取
  livereload = require('gulp-livereload'), // 自动刷新
  Server = require('karma').Server, // karma测试
  webpack = require('webpack'), // 使用webpack打包工具
  webpackConfig = require('./webpack.config.js');

var revTask = { // 修改html中引用文件的版本，以及js和css文件中sourcemap文件的版本
  html: function() {
    gulp.src(['dist/**/*.json', 'src/app/*.jade'])
      .pipe(revCollector({ replaceReved: true }))
      .pipe(jade({ pretty: true}))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist/app'));
  },
  css: function() {
    gulp.src(['dist/styles/*.json', 'dist/styles/*.css'])
      .pipe(revCollector({ replaceReved: true }))
      .pipe(gulp.dest('dist/styles'));
  }
};
// 第一次运行default依赖其他任务完成，效率低，下面三个任务会单独抽出来执行
gulp.task('htmlrev', ['styles', 'scripts'], function() {
  revTask.html();
  revTask.css();
});

// 监测html时修改html
gulp.task('html', function() {
  revTask.html();
  gulp.watch(['dist/**', 'test/index.html']).on('change', livereload.changed);
});

// 监测样式时修改html
gulp.task('htmlcss', ['styles'], function() { // 监测css文件改变时依赖styles任务
  revTask.html();
  revTask.css();
  gulp.watch(['dist/**', 'test/index.html']).on('change', livereload.changed);
});

// 监测脚本时修改html
gulp.task('htmljs', ['scripts'], function() { // 监测js文件改变时依赖scripts任务
  gulp.watch(['dist/**', 'test/index.html']).on('change', livereload.changed);
});

// 样式处理
gulp.task('styles', function() {
  return gulp.src('src/styles/index.scss') // 转换为数据流
    .pipe(sourcemaps.init()) // 生成sourcemaps
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // 编译sass，压缩
    .pipe(autoprefixer({ browsers: ['last 4 versions'], cascade: false })) // 生成前缀
    .pipe(sourcemaps.write('.')) // 输出sourcemaps
    .pipe(rev())
    .pipe(gulp.dest('dist/styles')) // 输出css和map文件
    .pipe(rev.manifest('css-manifest.json'))
    .pipe(revDel({ dest: 'dist/styles' }))
    .pipe(gulp.dest('dist/styles')) // 输出rev对应文件，必须和revDel的目录一致才可以。
    .pipe(notify({ message: '样式完成' })); // 提示
});

// 脚本处理
var myDevConfig = Object.create(webpackConfig);
var devCompiler = webpack(myDevConfig);
gulp.task('scripts', function(callback) {
  devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:scripts", err);
        gutil.log("[webpack:scripts]", stats.toString({
            colors: true
        }));
        callback();
  });
});

// 图片处理
gulp.task('images', function() {
  return gulp.src('src/images/**/*') // 压缩图片:优化等级，无损压缩jpg图片，隔行扫描gif进行渲染，多次优化svg直到完全优化
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({
      message: '图片完成'
    }));
});

// 字体处理
gulp.task('copyfont',function(){
  return gulp.src('src/fonts/*')
     .pipe(gulp.dest('dist/fonts'));
});

// 静态文件服务器
gulp.task('webserver', ['htmlrev'], function() {
  gulp.src('')
    .pipe(webserver({
      port: 8888,
      directoryListing: true,
      open: 'http://localhost:8888/dist/app/index.html'
    }));
});

// 需要时生成文档：gulp jsdoc
gulp.task('doc', shell.task(['./node_modules/.bin/jsdoc src/scripts -r -d doc']));

// 需要测试时运行：gulp test
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
  console.log('http://localhost:8888/test/index.html');
});

// 清理
gulp.task('clean', function() {
  return gulp.src(['dist/*'], { read: false })
    .pipe(clean());
});

// 默认任务
gulp.task('default', ['clean'], function() {
  gulp.start('images', 'copyfont','webserver');
});

// 动态跟踪
gulp.task('watch', function() {
  gulp.start('default');
  // 看守所有html档
  gulp.watch('src/app/*.jade', ['html']);
  // 看守所有.scss档
  gulp.watch('src/styles/**/*.scss', ['styles', 'htmlcss']);
  // 看守所有.js档
  gulp.watch('src/scripts/**/*.js', ['scripts', 'htmljs']);
  // 看守所有图片档
  gulp.watch('src/images/**/*', ['images']);
  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  livereload.listen();
});
