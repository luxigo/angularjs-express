/*
* Copyright (c) 2018-2019 ALSENET SA
*
* Author(s):
*
*      Luc Deschenaux <luc.deschenaux@freesurf.ch>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var fs = require('fs');

gulp.task('browserSync',function(){
    browserSync.init(["client/app/css/bundle.css", "client/app/js/index.min.js","./client/app/index.html",'./client/app/views/**.html'], {
        watchOptions: {
          ignoreInitial: true
        },
        server: {
            baseDir: "./client/app/"
        },
        https: true
    });
});

gulp.task('copy', function () {
   var streams=[];
   streams.push(gulp.src('./node_modules/bootstrap/dist/css/*')
   .pipe(gulp.dest('./client/app/css/')));
   return merge.apply(null,streams);
});

gulp.task('sass', function () {

  return gulp.src([
    //'./node_modules/font-awesome/scss/font-awesome.scss',
    './client/app/sass/**.scss'
    ])
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest('./client/app/css/'));
});

gulp.task('scripts', function(callback){
  var output=[];
  var prefix=[
    '// this file is generated automatically, manual changes will be overwritten',
    'module.exports=function(app) {',
     '  app'
   ];
  var suffix=['}'];

  var componentTypes=[
    'service',
    'controller',
    'directive',
    'filter'
  ];

  componentTypes.forEach(function(componentType){
    fs.readdirSync('client/app/js/'+componentType+'s').forEach(function(filename){
      if (filename.match(/\.js$/)) {
        var filter=function(name){return name.replace(/\.js$/,'')};
        switch(componentType){
          case 'controller': filter=function(name){return name.substr(0,1).toUpperCase()+name.replace(/\.js$/,'').substr(1)+'Ctrl'};  break;
        }
        output.push('  .'+componentType+"('"+filter(filename)+"',require('./"+componentType+"s/"+filename+"'))");
      }
    });
  });

  fs.writeFile('client/app/js/scripts.js',prefix.concat(output).concat(suffix).join('\n'),callback);
});

gulp.task('browserify', gulp.series('scripts'), require('./gulptasks/browserify.js')());

gulp.task('browserify-ugly', gulp.series('scripts'), require('./gulptasks/browserify.js')({
  uglify: true
}));

gulp.task('watchify', gulp.series('scripts'), require('./gulptasks/browserify.js')({
  watch: true
}));

gulp.task('watch', function(done){
  gulp.watch("./client/app/sass/**.scss", gulp.series('sass'));
  done();
});

function callback(err,msg){
  if(err) throw err;
}

gulp.task('run', gulp.series(
    'copy',
    'sass',
    'watch',
    'watchify',
    'browserSync'
));

gulp.task('default', gulp.series('run'));

gulp.task('dist', function(){
   var streams=[];
   streams.push(gulp.src('./client/app/index.html')
   .pipe(gulp.dest('./dist/')));
   streams.push(gulp.src('./client/app/views/*')
   .pipe(gulp.dest('./dist/views/')));
   streams.push(gulp.src('./client/app/js/index.min.*')
   .pipe(gulp.dest('./dist/js/')));
   streams.push(gulp.src('./client/app/css/bundle.*')
   .pipe(gulp.dest('./dist/css/')));
   return merge.apply(null,streams);
});

gulp.task('build', gulp.series(
    'copy',
    'sass',
    'browserify',
    'dist'
));

gulp.task('build-ugly', gulp.series(
    'copy',
    'sass',
    'browserify-ugly',
    'dist'
));

