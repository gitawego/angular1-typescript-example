import { IComponentOptions, Injectable, IControllerConstructor } from 'angular';
import { StateService } from 'angular-ui-router';
import './country.scss'

/**
 *  Component Definition
 *
 * @export
 * @class home
 * @implements {IComponentOptions}
 */
export class Country implements IComponentOptions {

  /**
   * Controller used with Component
   *
   * @type {Function}
   */
  public controller: Injectable<IControllerConstructor> = CountryController

  /**
   * Template used with Component
   *
   * @type {string}
   */
  public template: string = require('./country.html').toString()

  /**
   * Object containing pairs Directive Bindings for Component
   *
   * @type {Object}
   */
  public bindings: { [binding: string]: string; } = {
    country: '<'
  }

  /**
   * Component Router lifecycle hook
   */
  public $canActivate: any = function (): boolean {
    return true
  }

}

/**
 * country - Controller
 *
 * @export
 * @class HomeController
 */
export class CountryController {

  /**
   * $inject to make angular DI minifiication safe
   *
   * @static
   * @type {Array<string>}
   */
  public static $inject: [string] = ['$log', 'AppState', '$state']
  public countryCode = '';
  public country: any;
  // public country: any = null;
  /**
   * @param {*} $log Angular Log Service
   * @param {*} AppState App State
   */
  constructor(public $log: any, public AppState: any, public $state: StateService) {
    this.$log = $log.getInstance('Country', true);
    this.$log.debug('constructor');
  }

  /**
   * life cycle hook (road to ng2)
   */
  public $onInit(): void {
    this.$log.debug('onInit');
    this.$log.debug('country', this.country);
    // if (this.country) {
    //   this.countryCode = this.country.alpha2Code;
    //   this.onUpdate(this.countryCode);
    // }
  }
  public onUpdate(countryCode) {
    this.$log.debug('onUpdate', countryCode);
    // this.AppState.emit('countryCode', countryCode);
    this.countryCode = countryCode;
  }
  public countrySelected(country) {
    // this.country = country;
    this.$state.go('map', {
      countryCode: country.alpha2Code
    });
  }
}
