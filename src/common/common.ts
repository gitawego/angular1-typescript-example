import * as angular from 'angular';
// import common elements angular modules
import CommonServices from './services/services';

// bundle common element angular moduels into container module
export default angular.module('app.common', [
  CommonServices.name
]);
