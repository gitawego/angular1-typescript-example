import { Component, OnInit, Inject, Input } from 'ng-metadata/core';
import { StateService } from 'angular-ui-router';

@Component({
  selector: 'country',
  moduleId: module.id,
  styles: [require('./country.scss')],
  template: require('./country.html').toString(),
})
export class CountryComponent implements OnInit {
  @Input() country: string;
  @Input() countryCode: string = '';
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('AppState') private AppState: any,
    @Inject('$state') private $state: StateService
  ) { }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountryComponent', false);
    this.$log.debug('constructor');
  }
  onUpdate(countryCode: string) {
    this.$log.debug('onUpdate', countryCode);
    // this.AppState.emit('countryCode', countryCode);
    this.countryCode = countryCode;
  }
  countrySelected(country) {
    // this.country = country;
    this.$state.go('map', {
      countryCode: country.alpha2Code
    });
  }
}