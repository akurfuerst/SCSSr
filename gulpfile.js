var gulp = require('gulp');

//  ================================================
//  Plugins
//  ================================================

var livereload = require('gulp-livereload')
var notify = require("gulp-notify")
var autoprefixer = require('autoprefixer-core')
var combineMq = require('gulp-combine-mq')
var nodeSass = require('node-sass');
var chalk = require('chalk');
var fs = require('fs')
var chokidar = require('chokidar')
var postcss   = require('postcss');
var processor = postcss([require('autoprefixer-core')({ browsers: ['last 6 versions', 'ie 9', 'android 4'] })]);
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var sprite = require('gulp-svg-sprite');

var iconfont = require('gulp-iconfont');


var runTimestamp = Math.round(Date.now()/1000);

//  ================================================
//  Tasks
//  ================================================

//  Default
gulp.task('default', [
    'sass'
]);

gulp.task('font', [
    'icon-font'
]);

gulp.task('sprite', [
    'image-sprite'
]);

//  Production
gulp.task('production', [
    'production-sass',
    //'combine-media-queries' // nicht ausgereift
]);


//  ------------------------------------------------
//  Sprite
//  ------------------------------------------------

gulp.task('image-sprite', function () {
    config = {
        dest: "./img",
        shape: {
            spacing: {
                padding: 20
            },
            dest: "./img/icons-super"
        },
        mode: {
            view: {
                sprite: "../../img/sprite.svg",
                dest: "scss/general/",
                layout: 'vertical',
                bust: false, // no hashtags in filename
                render: {
                    scss: true  // Activate SCSS output (with default options)
                }
            },

        }
    };


    gulp.src('img/sprite/*.svg')
        .pipe(sprite(config))
        .pipe(gulp.dest('.'));
});


//  ------------------------------------------------
//  Icon-Font
//  ------------------------------------------------

var fontName = 'icons';

gulp.task('icon-font', function(){
  gulp.src(['img/icons/*.svg'])
    .pipe(iconfontCss({
        fontName: fontName,
        normalize: true,
        path: 'scss/templates/icon-font.css',
        targetPath: '../../scss/general/_icons.scss',
        fontPath: 'css/webfonts/',
        className: 'font'
    }))
    .pipe(iconfont({
        fontName: fontName
    }))
    .pipe(gulp.dest('css/webfonts/'));
});


//  ------------------------------------------------
//  Sass
//  ------------------------------------------------

// just sass for development with sourcemaps, autoprefixer, notify
gulp.task('sass', function() {
    var cwd = __dirname

    livereload.listen();

    sassCompiler(cwd + '/scss/main.scss', cwd + '/css/main.css', 'nested', true)

    chokidar.watch(cwd + '/scss/**/*', {
        ignored: /[\/\\]\./, persistent: true
    }).on('change', function(path) {
        sassCompiler(cwd + '/scss/main.scss', cwd + '/css/main.css', 'nested', true)
    })
});

// compressed CSS
gulp.task('production-sass', function() {
    var cwd = __dirname
    sassCompiler(cwd + '/scss/main.scss', cwd + '/css/main.css', 'compressed', false)
});

// Combine all Mediaqueries together, prevent css bloat
gulp.task('combine-media-queries', ['production-sass'], function () {
    setTimeout(function() {
        return gulp.src('css/main.css')
        .pipe(combineMq({
            beautify: true
        }))
        .pipe(gulp.dest('css'));

    }, 100);
});


//  ------------------------------------------------
//  Functions
//  ------------------------------------------------

var sassCompiler = function(input, output, outputStyle, hasSourcemap) {

    var result = nodeSass.render({
        file: input,
        outputStyle: outputStyle,
        outFile: output,
        sourceComments: hasSourcemap,
        sourceMapEmbed: hasSourcemap,
        sourceMapContents: hasSourcemap,
        sourceMap: hasSourcemap, // or an absolute or relative (to outFile) path
        success: function(result) {

            notify().write('SCSS compiled in ' + result.stats.duration + 'ms');

            processor
                .process(result.css)
                .then(function (result) {
                    fs.writeFile(output, result.css, function(err) {
                        livereload.changed('/css/main.css')
                    });
                });

        },
        error: function(error) {
            console.log("SASS: \n");
            console.log(error)
            console.log("\n");

            return notify().write(error.message);
        },
    });

}


//  ------------------------------------------------
//  Watch
//  ------------------------------------------------

gulp.task('watch', function() {

    gulp.watch('scss/**/*.scss', ['sass']);

    livereload.listen();
    // Watch for changes in 'compiled' files
    gulp.watch('css/main.css', function (file) {
        livereload.changed(file);
    });

});



