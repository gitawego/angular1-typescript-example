import { IComponentOptions, Injectable, IControllerConstructor, IController } from 'angular';
import './country-search.scss'

/**
 *  Component Definition
 *
 * @export
 * @class home
 * @implements {IComponentOptions}
 */
export class CountrySearch implements IComponentOptions {

  /**
   * Controller used with Component
   *
   * @type {Function}
   */
  public controller: Injectable<IControllerConstructor> = CountrySearchController

  /**
   * Template used with Component
   *
   * @type {string}
   */
  public template: string = require('./country-search.html').toString()

  /**
   * Object containing pairs Directive Bindings for Component
   *
   * @type {Object}
   */
  public bindings: { [binding: string]: string; } = {
    countryCode: '<',
    onUpdate: '&'
  }

  /**
   * Component Router lifecycle hook
   */
  public $canActivate: any = function (): boolean {
    return true
  }

}

/**
 * CountrySearch - Controller
 *
 * @export
 * @class CountrySearchController
 */
export class CountrySearchController implements IController {

  /**
   * $inject to make angular DI minifiication safe
   *
   * @static
   * @type {Array<string>}
   */
  public static $inject: [string] = ['$log', 'AppState'];
  public countryCode: string;
  public onUpdate: Function;
  /**
   * @param {*} $log Angular Log Service
   * @param {*} AppState
   */
  constructor(public $log: any, public AppState: any) {
    this.$log = $log.getInstance('CountrySearch', true);
    this.$log.debug('constructor');
  }

  /**
   * life cycle hook (road to ng2)
   */
  public $onInit(): void {
    this.$log.debug('onInit');
  }
  // public $onChanges(obj){
  //   this.$log.debug('---', obj);
  // }

  public update(): void {
    this.onUpdate({
      countryCode: this.countryCode
    });
  }
}
