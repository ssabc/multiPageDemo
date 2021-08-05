let gulp = require('gulp');
const { src, dest, parallel, watch } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const less = require('gulp-less');
const fileInclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin');
const gulpEjs = require('gulp-ejs');
var inject = require('gulp-inject');
// var gulpJquery  = require('gulp-jquery');
const gulpJquery = require('gulp-jquery-mr');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const changed = require('gulp-changed');
/**
 * 定义源目录和输出目录
 * */
 var app = {
    'appSrc':'src/',
    'appBuild':'build/',
    'appDist':'dist/',
}

function html() {
    gulp.src('src/views/**/**/*.html')
    .pipe(changed("dist", { extension:'.html' }))
    .pipe(fileInclude({
        prefix: '@@',//变量前缀 @@include
        basepath: '@file',//引用文件路径
        indent: false //保留文件的缩进
    }))
    // .pipe(inject(gulp.src([app.appSrc + 'js/includes/page.js'])))
    .pipe(htmlmin({
        removeComments: true,               // 清除HTML注释
        collapseWhitespace: true,           // 压缩空格
        collapseBooleanAttributes: true,    // 省略布尔属性的值 <input checked="true"/> => <input checked>
        removeEmptyAttributes: true,        // 删除所有空格作属性值 <input id=""> => <input>
        removeScriptTypeAttributes: true,   // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,// 删除<style>和<link>的type="text/css"
        minifyJS: true,                     // 压缩页面JS
        minifyCSS: true                     // 压缩页面CSS
    }))
    .pipe(gulp.dest('dist/views')) //输出文件路径
}

function css() {
    return src('src/css/**/*.css')
      .pipe(minifyCSS())
      .pipe(dest('dist/css'))
}

function lessFn() {
    return src('src/css/**/*.less')
    .pipe( less() )
    .pipe(minifyCSS())
    .pipe(dest('dist/css'))
}

function libs() {
    return src('src/libs/**/*')
        .pipe(dest('dist/libs'))
}

function js() {
    return src(['src/js/**/*.js', '!src/js/libs/*'], { sourcemaps: false })
        .pipe(babel())
        .pipe(uglify())
        .pipe(dest('dist/js', { sourcemaps: false }))
}

/**
 * 4.注册了压缩图片的任务
 * */
 function image() {
    /**
     * 意思是读取src/image下所有的图片文件
     * ** ： 代表是src下的任意目录, 0个或者多个
     * */
    gulp.src(app.appSrc+'img/**/*')  /*读取图片文件*/
        .pipe( imagemin() )  /*将读取所有的图片文件进行压缩 */
        .pipe( gulp.dest(app.appDist+'img'))  /*再将读取压缩后的文件写到dist目录（没有会自动新建）*/
        .pipe(connect.reload()) //当内容发生改变时， 重新加载。
}

/**
 * 定义server任务
 * 搭建一个服务器。设置运行的构建目录
 * */
 function server() {
    /*1.设置web服务器*/
    connect.server({
        root: ['dist'],//服务器管理/运行哪个目录(默认是项目的根目录)
        livereload: true,  //是否热更新。
        port:9997  //指定web服务的端口号（默认是8080）
    })

    /*2.gulp监视文件，并且可以在文件发生改动时候做一些事情.
    *  参数一：监视的文件
    *  参数二: 在文件变动后执行的一个task任务
    * */
    watch(['src/views/**/**/*.html', 'src/includes/**/**/*.html'], html);
    watch(['src/js/**/*.js', '!src/js/libs/'], js);
    watch('src/img/*', image);
    watch('src/css/**/*.css', css);
    watch('src/css/*.less', lessFn);
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.lessFn = lessFn;
exports.image = image;

exports.default = parallel(html, css, lessFn, js, libs, image, server);