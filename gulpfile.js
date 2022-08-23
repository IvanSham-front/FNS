'use strict';
//общее
const gulp = require('gulp');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const del = require('del');
const concat = require('gulp-concat');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

//Css
const sass = require('gulp-sass');
const csso = require('gulp-csso');

//Img
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');

//html
const rigger = require('gulp-rigger');
const htmlmin = require('gulp-html-minifier');

//script 
const uglify = require('gulp-uglify-es').default;gulp 
const pipeline = require('readable-stream').pipeline;



function html() {
	return gulp.src('source/index.html')
	// .pipe(rigger())
	.pipe(htmlmin({collapseWhitespace: true, ignorePath: '/assets' }))
	.pipe(gulp.dest('build/'))
}

function styles() {
	return gulp.src('source/styles/styles.scss')
	.pipe(sass())
	.pipe(gulp.dest('build/styles'))
	.pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
	.pipe(rename('styles-min.css'))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream());
}

// const scriptsArr = ['source/scripts/jquery-3.5.1.min.js',
// 					'source/scripts/jquery.maskedinput.min.js',
// 					'source/scripts/swiper.min.js',
// 					'source/scripts/elems.js',
// 					'source/scripts/nav-scroll.js',
// 					'source/scripts/smooth-scroll.js',
// 					'source/scripts/modal-window.js',
// 					'source/scripts/swiper.js'
// 				]

function scripts() {
	return gulp.src('source/scripts/scripts.js')
	.pipe(concat('script.js'))
	.pipe(uglify())
	.pipe(gulp.dest('build/scripts/'))
	.pipe(browserSync.stream());
}

// function php() {
// 	return gulp.src('source/php/*.php')
// 	.pipe(gulp.dest('build/php'))
// }

gulp.task('del', function(){
	return del(['build/*'])
});

gulp.task('fonts' , function(){
	return gulp.src('source/fonts/*')
	.pipe(gulp.dest('build/fonts'))
});

const imgFiles = ['source/img/*.jpg', 'source/img/*.png'];

gulp.task('img', function() {
	return gulp.src(['source/img/*', '!source/img/sprites'])
	.pipe(imagemin())
	.pipe(gulp.dest('build/img'))
	.pipe(browserSync.stream());
});


gulp.task('webp', function() {
	return gulp.src(imgFiles)
	.pipe(webp())
	.pipe(gulp.dest('build/img'))
})

 
const config = {
    shape: {
        dimension: {         // Set maximum dimensions
            maxWidth: 500,
            maxHeight: 500
        },
        spacing: {         // Add padding
            padding: 0
        }
    },
    mode: {
        symbol: {
            dest : '.'
		},
		stack: {
			sprite: "../sprite.svg"  //sprite file name
		}
	}
};

gulp.task('svg-sprite', function() {
	return gulp.src('source/img/sprites/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite(config))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('build/img/'));
})
  
gulp.task('watch', function() {
	browserSync.init({
        server: {
            baseDir: './build'
        }
    });
	gulp.watch('source/styles/*.scss', styles);
	gulp.watch('source/styles/bem/*.scss', styles);
	// gulp.watch('source/scss/swiper/*.scss', styles);
	gulp.watch('source/scripts/*.js', scripts);
	gulp.watch('source/html/*.html',html)
	gulp.watch('source/*.html', html);
	gulp.watch('source/*.html').on('change', browserSync.reload);
});

gulp.task('html', html)
gulp.task('styles', styles);
gulp.task('scripts', scripts);
// gulp.task('php', php);
gulp.task('editImg', gulp.series('svg-sprite', gulp.parallel('img', 'webp')));

gulp.task('build', gulp.series('editImg', gulp.parallel('fonts', 'html', 'styles', 'scripts')));
gulp.task('prestart', gulp.series('del', 'build'));
gulp.task('start', gulp.series('prestart', 'watch'));