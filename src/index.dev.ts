// vendor imports
import * as angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
import 'LogUnobtrusiveExtension/dist/log-ex-unobtrusive';
import 'ngmap';
// app css
import './app.scss';

// app imports
import Common from './common/common';
import Components from './components/components';

import { App } from './app';
import AppConfig from './app.config';

// top level angular module for app
angular.module('app', [
  'log.ex.uo',
  'ngMaterial',
  'ngMap',
  'ui.router',
  Common.name,
  Components.name,
])
  .config(AppConfig)
  .value('$routerRootComponent', 'app') // top level router component, contains the intial routes and views
  .component('app', new App());

// start angular using code instead of ng-app declaration in the index.html
angular.bootstrap(document, ['app'], {
  strictDi: true,
});
