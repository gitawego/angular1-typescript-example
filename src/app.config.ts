import * as angular from 'angular';
import { STATES } from './states';
AppConfig.$inject = ['$locationProvider', 'logExProvider', '$compileProvider', '$mdIconProvider',
  '$stateProvider', '$urlServiceProvider', '$mdThemingProvider']

/**
 * Config function for Angular on the main App component
 *
 * @export
 * @param {*} $locationProvider Angular Location Provider
 * @param {*} logExProvider Angular Log Extender
 * @param {*} $compileProvider Angular Compiler Provider
 * @param {*} $mdIconProvider Angular Material Icon Provider
 */
export default function AppConfig($locationProvider: any, logExProvider: any, $compileProvider: any,
                                  $mdIconProvider: any, $stateProvider: any, $urlServiceProvider: any,
                                  $mdThemingProvider: any): void {
  $urlServiceProvider.rules.otherwise({ state: 'country' });
  STATES.forEach((state) => {
    $stateProvider.state(state);
  });
  $mdThemingProvider.definePalette('docs-blue', $mdThemingProvider.extendPalette('blue', {
    '50': '#DCEFFF',
    '100': '#AAD1F9',
    '200': '#7BB8F5',
    '300': '#4C9EF1',
    '400': '#1C85ED',
    '500': '#106CC8',
    '600': '#0159A2',
    '700': '#025EE9',
    '800': '#014AB6',
    '900': '#013583',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400'
  }));
  $mdThemingProvider.definePalette('docs-red', $mdThemingProvider.extendPalette('red', {
    'A100': '#DE3641'
  }));
  $mdThemingProvider.theme('default')
    .primaryPalette('docs-blue')
    .accentPalette('red');
  // determine environment
  let isDevEnvironment: boolean = false
  if (window.location.href.indexOf('localhost') > -1 || window.location.href.indexOf('127.0.0.1') >= 1) {
    isDevEnvironment = true
  }

  // debug and logging config
  logExProvider.enableLogging(true, false)
  logExProvider.useDefaultLogPrefix(false)
  logExProvider.overrideLogPrefix(function (className: string): string {
    let $injector: any = angular.injector(['ng'])
    let $filter: any = $injector.get('$filter')
    let separator: any = '::'
    let format: any = 'h:mm:ss'
    let now: any = $filter('date')(new Date(), format)
    return '' + now + (!angular.isString(className) ? '' : ' ' + className) + separator
  })

  // disable angular debug info if app is not running locally. This increases performance in production
  if (isDevEnvironment) {
    $compileProvider.debugInfoEnabled(true)
  } else {
    $compileProvider.debugInfoEnabled(false)
  }

  // enable browser back button
  $locationProvider.html5Mode(false)

  // set angualr material icon font set
  $mdIconProvider.defaultFontSet('Material Icons')
}

