/**
 * @author: @AngularClass
 */

require('ts-node/register');
var helpers = require('./helpers');
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
let baseUrl = process.env.PROTRACTOR_HOST || 'localhost';
let basePort = process.env.PROTRACTOR_PORT || 8080;
let seleniumUrl = process.env.SELENIUM_GRID_ADDR || 'localhost';

function getUrl(baseUrl, port, restPart) {
  restPart = restPart || '';
  const url = 'http://' + baseUrl +
    (port ? (':' + port) : '') +
    restPart;
  console.log('baseUrl', url);
  return url;
}

const config = {
  baseUrl: getUrl(baseUrl, basePort),

  // use `npm run e2e`
  specs: [
    helpers.root('src/**/**.e2e.ts'),
    helpers.root('src/**/*.e2e.ts')
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: true,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: false,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function () {
    browser.ignoreSynchronization = true;
    jasmine.getEnv().addReporter(
      new Jasmine2HtmlReporter({
        savePath: 'coverage/screenshots'
      })
    );
    jasmine.getEnv().addReporter(
      new HtmlScreenshotReporter({
        captureOnlyFailedSpecs: true,
        pathBuilder: function (currentSpec, suites, browserCapabilities) {
          // will return chrome/your-spec-name.png
          return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
        },
        dest: 'coverage/screenshots',
      })
    );

    /* login actions here here */
    browser.driver.get(getUrl(baseUrl, basePort, '/#/login'));
    element.all(By.css('.login-input')).get(0).click();
    let password = "1234";

    const quantityKeyPad = element.all(By.tagName('kd-numeric-keypad')).get(0);

    for (var i = 0, len = password.length; i < len; i++) {
      quantityKeyPad.all(By.tagName('button')).get(+password[i] - 1).click();
    }

    browser.sleep(1000);
    return true;

    /*    return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /index/.test(url);
              });
        }, 10000);
    */
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
  useAllAngular2AppRoots: true,
  /** disabled when directConnect is true */
  seleniumAddress: getUrl(seleniumUrl, 4444, '/wd/hub')
};
exports.config = config;
