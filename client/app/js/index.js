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

'use strict';

// force https... could use meta
if (window.location.protocol!='https:') {
  var href=window.location.href.replace(/[^:]+/,'https');
  window.location.assign(href);
}

var angular=require('angular');
window.jQuery=window.$=require('jquery');

var config=require('../../../config.json');

$('html').attr('ng-app',config.appName);
$('title').text(config.appName);

// TODO: (?) generate the code below from ../../../gulpfile.js using ../../../config.json and directories content.
require('../css/bootstrap.min.css');
require('../css/main.css');

require('bootstrap');
require('@uirouter/angularjs/release/angular-ui-router.js');
require('angular-ui-bootstrap');

var app=angular.module(config.appName,[
  'ui.router',
  'ui.bootstrap'
])

angular.module(config.appName)
.config(require('./config.js'))
.run(require('./app.js'))

require('./scripts.js')(app,config);

//.service('myService',require('./services/my-service.js'))
//.directive('my-directive',require('./directives/my-directive.js'))
//.controller('MainCtrl',require('./controllers/main.js'))
//.controller('HomeCtrl',require('./controllers/home.js'))
//.controller('OverlayCtrl',require('./controllers/overlay.js'))
//.filter('my-filter',require('./filters/my-filter.js'))
