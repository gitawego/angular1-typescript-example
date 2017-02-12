/**
 * @author: @AngularClass
 */

/*
 * When testing with webpack and ES6, we have to do some extra
 * things to get testing to work right. Because we are gonna write tests
 * in ES6 too, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it will compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */
Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

// Typescript emit helpers polyfill
require('ts-helpers');
require('angular');
require('angular-mocks');


var testContext = require.context("../src", true, /\.spec\.ts/);
testContext.keys().forEach(function(path) {
  try {
    testContext(path);
  } catch (err) {
    console.error('[ERROR] WITH SPEC FILE: ', path);
    console.log(err.stack);
  }
});
