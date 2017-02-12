import { IComponentOptions, Injectable, IControllerConstructor } from 'angular';
/**
 * Main Application - Component Definition
 *
 * @export
 * @class App
 * @implements {IComponentOptions}
 */
export class App implements IComponentOptions {

  /**
   * Controller used with Component
   *
   * @type {Function}
   */
  public controller: Injectable<IControllerConstructor> = AppController;

  /**
   * Template used with Component
   *
   * @type {string}
   */
  public template: string = require('./app.html').toString();

  /**
   * Object containing pairs Directive Bindings for Component
   *
   * @type {Object}
   */
  public bindings = {}

}

/**
 * App - Controller
 *
 * @export
 * @class AppController
 */
export class AppController {

  /**
   * $inject to make angular DI minifiication safe
   *
   * @static
   * @type {Array<string>}
   */
  public static $inject: Array<string> = ['$log', 'AppState']

  /**
   * @param {*} $log Angular Log Service
   * @param {*} appState App Services Convenience Service
   */
  constructor(public $log: LogEx.ILogService, public AppState: any) {
    this.$log = $log.getInstance('AppController', false)
    this.$log.debug('constructor')
  }

  /**
   * life cycle hooks
   * Called on each controller after all the controllers on an element have been constructed and had their bindings initialized (and before the pre & post linking functions for the directives on this element).
   */
  public $onInit(): void {
    this.$log.debug('onInit')
  }

  /**
   * Called whenever one-way bindings are updated.
   * The changesObj is a hash whose keys are the names of the bound properties that have changed, and the values are an object of the form { currentValue, previousValue, isFirstChange() }.
   * Use this hook to trigger updates within a component such as cloning the bound value to prevent accidental mutation of the outer value.
   */
  public $onChanges(changesObj: any): void {
    this.$log.debug('onChanges', changesObj)
  }

  /**
   * Called on a controller when its containing scope is destroyed.
   * Use this hook for releasing external resources, watches and event handlers.
   */
  public $onDestroy(): void {
    this.$log.debug('onDestroy')
  }

  /**
   * Called after this controller's element and its children have been linked.
   * Similar to the post-link function this hook can be used to set up DOM event handlers and do direct DOM manipulation.
   * Note that child elements that contain templateUrl directives will not have been compiled and linked since they are waiting for their template to load asynchronously and their own compilation and linking has been suspended until that occurs.
   * This hook can be considered analogous to the ngAfterViewInit and ngAfterContentInit hooks in Angular 2.
   * Since the compilation process is rather different in Angular 1 there is no direct mapping and care should be taken when upgrading.
   */
  public $postLink(): void {
    this.$log.debug('postLink')
  }

}
