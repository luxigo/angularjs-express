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
var GulpSass = require('gulp-sass');
var BrowserSync = require('browser-sync');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var fs = require('fs');
var extend = require('extend');

function browserSync(){
    BrowserSync.init(["client/app/css/bundle.css", "client/app/js/index.min.js","./client/app/index.html",'./client/app/views/**.html'], {
        watchOptions: {
          ignoreInitial: true
        },
        server: {
            baseDir: "./client/app/"
        },
        https: true
    });
}

function copy() {
   var streams=[];
   streams.push(gulp.src('./node_modules/bootstrap/dist/css/*')
   .pipe(gulp.dest('./client/app/css/')));
   return merge.apply(null,streams);
}

function sass() {
  return gulp.src([
    //'./node_modules/font-awesome/scss/font-awesome.scss',
    './client/app/sass/**.scss'
    ])
    .pipe(GulpSass({
      includePaths: [
        './node_modules/bootstrap/scss'
      ]
    }).on('error', GulpSass.logError))
    .pipe(gulp.dest('./client/app/css/'));
}

function scripts(callback){
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
}

function browserify(callback){
  require('./gulptasks/browserify.js')({callback: callback});
}

function browserify_ugly(callback){
  require('./gulptasks/browserify.js')({callback: callback, uglify: true});
}

function watchify(callback){
  require('./gulptasks/browserify.js')({callback: callback, watch: true});
}

function watch(done){
  gulp.watch("./client/app/sass/**.scss", function() {
    return gulp.series(sass)
  });
  done();
}

function dist(){
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
};

extend(true,exports,{
  build: gulp.series(
    copy,
    sass,
    scripts,
    browserify,
    dist
  ),
  build_ugly: gulp.series(
    copy,
    sass,
    scripts,
    browserify_ugly,
    dist
  ),
  run: gulp.series(
    copy,
    sass,
    scripts,
    watch,
    watchify,
    browserSync
  )
});

exports.default=exports.run;

