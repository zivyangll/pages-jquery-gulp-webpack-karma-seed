pages-jquery-gulp-webpack-karma
=========================================


该项目为编写多页面jquery应用的种子工程，其中包括

- 模块化工具： webpack
- 流程自动化： gulp
- 自动化测试： karma & jasmine
- 文档生成：   jsdoc
- 代码格式检查：jshint & htmlPrettify (sublime插件)
- 支持es6：    babel
- 支持scss：   gulp-sass
- 支持jade     gulp-jade
- 支持压缩：    gulp-htmlmin & Uglify
- 支持自动刷新： livereload
- 支持css前缀： gulp-autoprefixer
- 支持sourcemaps：gulp-sourcemaps
- 静态文件服务器：gulp-webserver  
- 已全局引入jquery

让应用跑起来
-------------------------
安装：npm install 安装依赖包 

运行：npm start  自动打开浏览器

测试：npm test   测试结果在test/index.html中

文档：gulp doc  文档在/doc/index.html中

项目目录说明
-------------------------
-- dist 项目打包目录
> -- srcipts：打包后的js以及sourcemap文件

  -- styles：打包后的css以及sourcemap文件

  -- images：压缩后的图片

  -- app： 压缩后的html

  -- fonts: 字体文件

-- doc 项目文档目录
> -- index.html 文档主页

-- node_modules 引用包

-- src 项目源码
> -- srcipts：每个页面的入口文件直接写在该目录下，引用的js防到二级目录中，如class目录。

  -- styles：scss源码

  -- images：图片

  -- app： jade页面
	
  -- fonts: 字体文件

-- test 项目测试
> -- coverage 覆盖率检测，结果在./coverage/**/index.html中

  -- index.html 测试结果
  
  -- *.js 测试代码


License
-------------------------
[MIT]

杨龙龙 ziv
-------------------------
- [Github]
- [home]
- [Email]


[MIT]: http://markdalgleish.mit-license.org
[Github]: https://github.com/yllziv
[home]: http://www.yanglonglong.com
[Email]: me@yanglonglong.com
