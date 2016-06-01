var gulp            = require("gulp"),
    autoprefixer    = require("gulp-autoprefixer"),
    changed         = require("gulp-changed"),
    concat          = require("gulp-concat"),
    markdown        = require('gulp-markdown'),
    uglify          = require("gulp-uglify"),
    plumber         = require("gulp-plumber"),
    rename          = require("gulp-rename"),
    sourcemaps      = require("gulp-sourcemaps"),
    sass            = require('gulp-ruby-sass'),
    minifycss       = require('gulp-minify-css'),
    libs            = require("bower-files")(),
    browserSync     = require('browser-sync'),
    runSequence     = require('run-sequence'),
		del             = require("del"),
		child_process   = require('child_process'),
    reload          = browserSync.reload,
    project_dev_url = "local.sapayol.com/"; // Нour project's address in your dev environment

gulp.task('default',    ['sync', 'browserSync']);
gulp.task('libs',       ['css-vendor', 'js-vendor']);

gulp.task('build', function(callback) {
  runSequence('clean', ['css', 'css-vendor', 'js', 'js-vendor'], ['fonts'], callback);
});

gulp.task('build-prod', function(callback) {
  runSequence('clean', ['css-prod', 'css-vendor-prod','js-prod', 'js-vendor-prod'], 'css-combine', ['fonts'], callback);
});


//===========================================================================//
//                                 GLOBAL TASKS                              //
//===========================================================================//

gulp.task('clean', function() {
  del(['_site/css/**', '_site/js/**', '_site/fonts/**', '!_site/css', '!_site/js', '!_site/fonts']);
});

gulp.task('fonts', function() {
  return gulp.src(['resources/assets/fonts/**/*'])
    .pipe(plumber())
    .pipe(gulp.dest('_site/fonts/'));
});

gulp.task('blankTask', function() {
  return true;
});

gulp.task('sync', function() {
  gulp.watch('_assets/sass/**/*.scss',  ['css']);
  gulp.watch('_assets/js/**/*.js',      ['js']);
  gulp.watch('**/*.html',               ['jekyll', browserSync.reload]);
  gulp.watch('**/*.md',                 ['html', browserSync.reload]);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('html', function(cb) {
  runSequence('markdown', ['jekyll'], cb);
})

gulp.task('markdown', function() {
  return gulp.src('case_studies/sapayol.md')
    .pipe(markdown())
    .pipe(gulp.dest('case_studies/sapayol.html'));
});


gulp.task('jekyll', function (cb) {
  browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
	return child_process.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', cb);
});



//===========================================================================//
//                             CSS: Development Env                          //
//===========================================================================//

gulp.task('css', function() {
  return sass('_assets/sass/main.scss', {
    loadPath: ['bower_components/foundation-sites/scss/'],
    sourcemap: true,
    style: 'nested',
    trace: true,
    verbose: true
  })
    .pipe(plumber())
    .pipe(autoprefixer('last 5 version'))
    .on('error', function(err) {
      console.error('Error', err.message);
    })
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.stream());
});

gulp.task('css-vendor', function() {
  // return gulp.src(libs.match('!**/foundation.css').ext('css').files)
  return gulp.src(libs.ext('css').files)
    .pipe(plumber())
    .pipe(concat('vendor.css', { sourcesContent: true }))
    .pipe(gulp.dest('_site/css/'))
});




//===========================================================================//
//                             JS: Development Env                           //
//===========================================================================//

gulp.task('js', function() {
  return gulp.src('./_assets/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('_site/js/'));
});

gulp.task('js-vendor', function() {
  return gulp.src(libs.ext('js').files)
    .pipe(plumber())
    .pipe(uglify({ beautify: true, mangle: false }))
    .pipe(concat('vendor.js', { sourcesContent: true }))
    .pipe(gulp.dest('_site/js/'))
});




//===========================================================================//
//                            CSS: Production Env                            //
//===========================================================================//

gulp.task('css-prod', function() {
  return sass('resources/assets/sass/main.scss')
    .pipe(plumber())
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('_site/css'));
});

gulp.task('css-vendor-prod', function() {
  return gulp.src(libs.match('!**/foundation.css').ext('css').files)
    .pipe(plumber())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('_site/css/'))
});

gulp.task('css-combine', function() {
  return gulp.src(['_site/css/vendor.css', '_site/css/main.css'])
    .pipe(plumber())
    .pipe(concat('combo.css'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('_site/css/'))
});




//===========================================================================//
//                             JS: Production Env                            //
//===========================================================================//

gulp.task('js-prod', function() {
  return gulp.src('resources/assets/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify({ beautify: false, mangle: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('_site/js/'));
});

gulp.task('js-vendor-prod', function() {
  // return gulp.src(libs.match('!**/foundation.js').ext('js').files)
  return gulp.src(libs.ext('js').files)
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(uglify({ beautify: false, mangle: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('_site/js/'))
});


