import { IQService, IPromise } from 'angular';
import { EventEmitter2 } from 'eventemitter2';
import * as _ from 'lodash';
import { Inject, Injectable } from 'ng-metadata/core';

export interface CountryInfo {
  alpha2Code: string;
  name: string;
  nativeName: string;
  latlng: [number, number];
  [key: string]: any;
}
/**
 *
 * @export
 * @class AppState
 */
@Injectable()
export class AppState extends EventEmitter2 {
  private countryInfo: CountryInfo = null;
  protected initialized = false;
  private countryUrl: string = 'https://restcountries-v1.p.mashape.com/all';
  private countries: any[] = [];
  /**
   * @param {$log} $log - Angular logging Service.
   */
  constructor(
    @Inject('$log') private $log: any,
    @Inject('$http') private $http: any,
    @Inject('$q') private $q: IQService
  ) {
    super();
    this.$log = $log.getInstance('AppServices', true);
    this.$log.debug('constructor');
    this.getCountries().then((resp) => {
      this.countries = resp.data;
      this.$log.debug('country', this.countries);
      this.initialized = true;
      this.emit('initialized');
    });
  }
  public findCountry(code: string) {
    return _.find(this.countries, {
      alpha2Code: code
    });
  }
  public currentCountry(countryInfo?: CountryInfo) {
    if (countryInfo) {
      this.countryInfo = countryInfo;
    }
    return this.countryInfo;
  }
  public ensureCountries(): IPromise<any> {
    return new this.$q((resolve, reject) => {
      if (this.initialized) {
        resolve(this.countries);
      } else {
        this.once('initialized', () => {
          resolve(this.countries);
        });
      }
    });

  }
  public getCountry(code: string): IPromise<any> {
    return this.ensureCountries()
      .then(() => this.findCountry(code));
  }
  public getCountries(): IPromise<any> {
    return this.$http({
      method: 'GET',
      url: this.countryUrl,
      headers: {
        'X-Mashape-Key': 'l5eMXwY6d3mshmvnljsx6GVH9YWxp1IsKhsjsnSAZ5yXpYiGRl',
        'Content-Type': 'application/json'
      }
    });
  }
}
