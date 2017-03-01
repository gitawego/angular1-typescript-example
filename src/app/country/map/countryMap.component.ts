import { Component, OnInit, Inject, Input, Output, EventEmitter } from 'ng-metadata/core';
import { StateService } from 'angular-ui-router';
export interface CountryInfo {
  alpha2Code: string;
  name: string;
  nativeName: string;
  latlng: [number, number];
  [key: string]: any;
}

@Component({
  selector: 'country-map',
  moduleId: module.id,
  styles: [require('./country-map.scss')],
  template: require('./country-map.html').toString()
})
export class CountryMapComponent implements OnInit {
  @Input() countryInfo: CountryInfo;
  constructor(
    @Inject('$log') private $log: LogEx.ILogService
  ) { }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountryMapComponent', true);
    this.$log.debug('ngOnInit');
  }

}
