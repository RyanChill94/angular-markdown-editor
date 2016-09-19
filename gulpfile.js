var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var jslint  = require('gulp-jslint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

//错误处理
var guitl = require('gulp-util');
var plumber = require('gulp-plumber');
var combine = require('stream-combiner2');

//配置路径
var path = {
    lessPath: 'FE/assets/styles/**.less',
    jsPath: 'FE/assets/js/**.js',
    angularJSPath: 'FE/api/**.js',
    indexPath: 'index.html',

    cleanPath: 'FE/dist/**',
    destLessPath: 'FE/dist/assets/styles',
    destJSPath: 'FE/dist/assets/js',
    destAngularJSPath : 'FE/dist/api'
}

//处理错误的方式
function log(err){
    var colors = guitl.colors;
    console.log('\n');
    guitl.log(colors.red('Error'));
    guitl.log('fileName : ' + colors.red(err.fileName));
    guitl.log('lineNumber : ' + colors.red(err.lineNumber));
    guitl.log('message : ' + colors.red(err.message));
    guitl.log('plugin : ' + colors.red(err.plugin));
    console.log('\n');
}


//清理文件夹
gulp.task('clean', function () {
    gulp.src(path.cleanPath, {read: false})
        .pipe(clean())
});

//监听文件变化
gulp.task('watchHTML', function () {
	gulp.src(path.indexPath)
		.pipe(livereload());
});

//监听变化
gulp.task('watch', function () {
    livereload.listen();

    gulp.watch(path.lessPath, ['lessCSS']);
    gulp.watch(path.angularJSPath, ['uglifyAngularJS']);
    gulp.watch(path.jsPath, ['uglifyJS']);
    gulp.watch(path.indexPath,['watchHTML']);

});

//编译less 压缩css 生成map文件
gulp.task('lessCSS', function () {
    var combined = combine.obj([
        gulp.src(path.lessPath),
        plumber(),
        sourcemaps.init(),
        less(),
        minifyCSS(),
        sourcemaps.write('./maps'),
        gulp.dest(path.destLessPath),
        livereload()
    ]);
    combined.on('error',log);
});

//压缩JS 生成map文件
gulp.task('uglifyJS', function () {
    var combined = combine.obj([
        gulp.src(path.jsPath),
        plumber(),
        sourcemaps.init(),
        rename('customer.min.js'),
        uglify(),
        sourcemaps.write('./maps'),
        gulp.dest(path.destJSPath),
        livereload()
    ]);
    combined.on('error',log);
});

//合并Angular 重命名 压缩 生成map文件
gulp.task('uglifyAngularJS', function () {
    var combined = combine.obj([
        gulp.src(path.angularJSPath),
        plumber(),
        sourcemaps.init(),
        concat('all.js'),
        gulp.dest(path.destAngularJSPath),
        rename('all.min.js'),
        uglify(),
        sourcemaps.write('./maps'),
        gulp.dest(path.destAngularJSPath),
        livereload()
    ]);
    combined.on('error',log);
});

gulp.task('default',['uglifyAngularJS','uglifyJS','lessCSS','watch']);