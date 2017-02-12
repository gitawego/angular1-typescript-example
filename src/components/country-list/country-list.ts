
import { IComponentOptions, Injectable, IControllerConstructor } from 'angular';
import './country-list.scss'

/**
 *  Component Definition
 *
 * @export
 * @implements {IComponentOptions}
 */
export class CountryList implements IComponentOptions {

  /**
   * Controller used with Component
   *
   * @type {Function}
   */
  public controller: Injectable<IControllerConstructor> = CountryListController

  /**
   * Template used with Component
   *
   * @type {string}
   */
  public template: string = require('./country-list.html').toString()

  /**
   * Object containing pairs Directive Bindings for Component
   *
   * @type {Object}
   */
  public bindings: { [binding: string]: string; } = {
    onCountry: '&',
    countryCode: '<'
  }

  /**
   * Component Router lifecycle hook
   */
  public $canActivate: any = function (): boolean {
    return true
  }

}

/**
 * CountryList - Controller
 *
 * @export
 * @class CountryListController
 */
export class CountryListController {

  /**
   * $inject to make angular DI minifiication safe
   *
   * @static
   * @type {Array<string>}
   */
  public static $inject: [string] = ['$log', 'AppState'];
  public countries = [];
  // public searchPattern = '';
  public onCountry: Function;
  /**
   * @param {*} $log Angular Log Service
   * @param {*} AppState
   */
  constructor(public $log: any, public AppState: any) {
    this.$log = $log.getInstance('CountryList', true);
    this.$log.debug('constructor');
    AppState.ensureCountries().then((countries) => {
      this.countries = countries;
    });
    // appState.on('countryCode', (countryCode) => {
    //   this.searchPattern = countryCode;
    // });
  }
  /**
   * life cycle hook (road to ng2)
   */
  public $onInit(): void {
    this.$log.debug('onInit')
  }
  public filterByPattern(criteria: string) {
    return function (item: any) {
      if (!criteria) {
        return true;
      }
      return item.name.match(new RegExp(`^${criteria}`, 'i'));
    };
  }
  public showOnMap(country) {
    this.$log.debug('showOnMap', country);
    this.onCountry({
      country
    });
  }
}
