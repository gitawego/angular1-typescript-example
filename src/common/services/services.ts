// import common service classes
import * as angular from 'angular';
import { AppState } from './app-state/app-state';

// bind common service classes into angular services
export default angular.module('app.common.services', [])
  .service('AppState', AppState)
