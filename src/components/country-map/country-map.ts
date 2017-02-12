import { IComponentOptions, Injectable, IControllerConstructor } from 'angular';
import './country-map.scss'

export interface CountryInfo {
  alpha2Code: string;
  name: string;
  nativeName: string;
  latlng: [number, number];
  [key: string]: any;
}
/**
 *  Component Definition
 *
 * @export
 * @implements {IComponentOptions}
 */
export class CountryMap implements IComponentOptions {

  /**
   * Controller used with Component
   *
   * @type {Function}
   */
  public controller: Injectable<IControllerConstructor> = CountryMapController

  /**
   * Template used with Component
   *
   * @type {string}
   */
  public template: string = require('./country-map.html').toString()

  /**
   * Object containing pairs Directive Bindings for Component
   *
   * @type {Object}
   */
  public bindings: { [binding: string]: string; } = {
    countryInfo: '<'
  }

}

/**
 * CountryMap - Controller
 *
 * @export
 * @class CountryMapController
 */
export class CountryMapController {

  /**
   * $inject to make angular DI minifiication safe
   *
   * @static
   * @type {Array<string>}
   */
  public static $inject: [string] = ['$log', 'AppState']
  public countryInfo: CountryInfo;
  /**
   * @param {*} $log Angular Log Service
   * @param {*} AppState
   */
  constructor(public $log: any, public AppState: any) {
    this.$log = $log.getInstance('CountryMap', true);
    this.$log.debug('constructor')
  }

  /**
   * life cycle hook (road to ng2)
   */
  public $onInit(): void {
    this.$log.debug('onInit')
  }
  public $onChanges(obj) {
    this.$log.debug('onchanges', obj);
  }

}
