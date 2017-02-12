/**
 * @author: @AngularClass
 */
var webpack = require('webpack');
var helpers = require('./helpers');
var webdriverConfig = {
  hostname: process.env.SELENIUM_GRID_ADDR || 'localhost',
  port: 4444
    // user: 'USERNAME',
    // pwd: 'APIKEY'
};

module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js')({
    ENV: 'test'
  });

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',
    // hostname: 'localhost',
    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      './dist/dll/polyfills.bundle.js',
      './dist/dll/vendors.bundle.js',
      './config/spec-bundle.js',
      // paths loaded via module imports
      //'./src/tests.entry.ts',
      //'./dist-test/main.bundle.js',
      //{ pattern: './src/**/*.ts', included: false, watched: false },
      //{pattern: './dist-tsc/**/*.map', included: false, watched: false}
    ],
    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      //'./src/**/*.ts':['webpack','sourcemap'],
      'config/spec-bundle.js': ['webpack','sourcemap']

    },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,
    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha', 'coverage'],
    // coverageReporter: {
    //   type: 'in-memory'
    // },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
          type: 'text-summary'
        },
        { type: 'json', subdir: '.', file: 'coverage-final.json' },
        // {
        //   type: 'lcov',
        //   subdir: '.'
        // }
      ]
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: {
      noInfo: true
    },
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },
    //plugins: ['karma-coverage', 'karma-remap-coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      'ChromeGrid'
    ],

    customLaunchers: {
      ChromeTravisCi: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      ChromeGrid: {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'chrome',
        //platform: 'LINUX',
        //maxInstances: 1,
        //acceptSslCerts: true,
        // version: '53',
        name: 'Karma',
        pseudoActivityInterval: 30000
      }
    },

    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['ChromeTravisCi'];
  }
  if (process.env.KARMA_HOSTNAME) {
    configuration.hostname = process.env.KARMA_HOSTNAME;
  }

  config.set(configuration);
};
