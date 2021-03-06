var gulp = require('gulp'),
// jshint = require('gulp-jshint'),
    cleanCSS = require('gulp-clean-css'),
    less = require('gulp-less'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    through2 = require('through2'),
    exec = require('child_process').exec,
    fs = require('fs');


gulp.task('dist', ['minify-css', 'copy', 'copy-public'], function(){
});

gulp.task('prod', ['minify-css', 'copy', 'copy-public', 'uglify-js', 'uglify-public-js'], function(){
});
// 编译less
gulp.task('less', function(){
    return gulp.src(['src/less/*.less', '!src/less/variable.less'])
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        // .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('src/css'));
});

gulp.task('copy', function(){
    var start = './src/**';
    return gulp.src(start)
        .pipe(gulp.dest('dist'));
});
// copy public
gulp.task('copy-public', function(){
    var start = './public/**';
    return gulp.src(start)
        .pipe(gulp.dest('dist/public'));
});
// 压缩css
gulp.task('minify-css', ['less'], function(){
    return gulp.src(['!src/css/variable.css', 'src/css/*.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(gulp.dest('dist/css'));
});

// 合并
gulp.task('concat', ['minify-css'], function(){
    return gulp.src('src/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('uglify-js', function(){
    return gulp.src(['src/js/**/*.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('uglify-public-js', function(){
    return gulp.src(['public/js/*.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/public/js'));
});


gulp.task('script-to-src', function(){
    return gulp.src(['src/**/*.html']).pipe(through2.obj(function(file, enc, next){
        var stats = fs.statSync(file.path);
        
        if(stats.isFile() && fs.existsSync('./bin/combine_js.sh')){
            exec('bash ./bin/combine_js.sh script_to_js_src ' + file.path, function(error, stdout, stderr){
                if(error){
                    console.error(`exec error: ${error}`);
                    return;
                }
                // console.log(`stdout: ${stdout}`);
                // console.log(`stderr: ${stderr}`);
            });
        }

        next();
    })).pipe(gulp.dest('/test.dest'));
});

gulp.task('combine-js-src', function(){
    return gulp.src(['dist/view/**/*.html']).pipe(through2.obj(function(file, enc, next){
        var stats = fs.statSync(file.path);
        
        if(stats.isFile() && fs.existsSync('./bin/combine_js.sh')){
            exec('bash ./bin/combine_js.sh combine_dist_js ' + file.path, function(error, stdout, stderr){
                if(error){
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        }

        next();
    }));
});

// 检查js
/*gulp.task('lint', function () {
 gulp.src('src/js/js.js')
 .pipe(jshint())
 .pipe(jshint.reporter('default'));
 });*/

// 监视
gulp.task('watch', ['dist'], function(){
    gulp.watch('src/**/*.*', ['dist']);
});

// 默认task
gulp.task('default', ['watch'], function(){
    // 将你的默认的任务代码放在这
});
