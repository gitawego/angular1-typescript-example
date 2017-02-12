/*
 * README
 * any changes to this file and you have to run `npm run dll` to generate the bundle
 *
 * Polyfills
 * Vendors
 * RxJS
 */

// Polyfills
function polyfills(env) {
  const cfg = [
    // zone.js
    //'reflect-metadata',
    //'es7-reflect-metadata',
    //'zone.js/dist/zone',
    'core-js/es6/symbol',
    'core-js/es6/object',
    'core-js/es6/function',
    'core-js/es6/parse-int',
    'core-js/es6/parse-float',
    'core-js/es6/number',
    'core-js/es6/math',
    'core-js/es6/string',
    'core-js/es6/date',
    'core-js/es6/array',
    'core-js/es6/regexp',
    'core-js/es6/map',
    'core-js/es6/set',
    'core-js/es6/weak-map',
    'core-js/es6/weak-set',
    'core-js/es6/typed',
    'core-js/es7/reflect',
    //'core-js/es6/reflect',
    // see issue https://github.com/AngularClass/angular2-webpack-starter/issues/709
    // import 'core-js/es6/promise';
    //'core-js/es7/reflect',
    // typescript helpers
    'ts-helpers'
  ];
  return cfg;
}

// Angular 2 and other Vendor imports
function vendors(env) {
  return [
    'rxjs',
    'jquery',
    'angular',
    //'ng-metadata/platform-browser-dynamic',
    //'ng-metadata/core',
    //'ng-metadata/common',
    'angular-material',
    'angular-ui-router',
    'ngmap',
    'LogUnobtrusiveExtension/dist/log-ex-unobtrusive',
    "core-decorators",
    'eventemitter2'
  ];
}

// RxJS
function rxjs(env) {
  return [
    'rxjs/Observable'
  ];
}
exports.polyfills = polyfills;
exports.vendors = vendors;
exports.rxjs = rxjs;
