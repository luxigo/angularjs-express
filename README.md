# angularjs-express

AngularJS webapp skeleton, with optional express backend

The gulpfile.js features automated (re)build of scripts/stylesheets and browser synchronization using:

- browserify allowing to require() npm/yarn packages and to generate a single javacript file
- babelify to deal with flavours of javascript and target given platforms
- sass to generate a single css file
- watchify to rebuild the javascript and css files automatically when a source file is modified
- uglify to reduce the size of the final javascript file
- browserify to display the result in your browser and reload the page when the served files are modified

## Copyright

 Copyright (c) 2018 ALSENET SA

 Author(s):

      Luc Deschenaux <luc.deschenaux@freesurf.ch>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

## Quickstart
```
yarn
gulp
```

## Configuration
The application name can be modified in ./config.json.

The content of this file is accessible as $scope.config or $rootscope.config

## State based css rules
The body has the class of the current state name in lowercase, prefixed with an underscore and words separed by hyphen. eg: '_my-state' for 'myState'

## Transitions
'transitionStart' and 'transitionSuccess' messages are posted to the parent window when there is one.

The window is listening to 'transition' messages allowing a parent or child window to switch to another state.

See client/app/js/app.js

## Overlay
The rootScope is listening to 'showOverlay' and 'hideOverlay' events and will pass them the parent window if there is one.

See client/app/js/controllers/overlay.js and client/app/views/overlay.html
