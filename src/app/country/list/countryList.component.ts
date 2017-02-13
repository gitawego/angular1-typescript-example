import { Component, OnInit, Inject, Input, Output, EventEmitter } from 'ng-metadata/core';
import { StateService } from 'angular-ui-router';

@Component({
  selector: 'country-list',
  moduleId: module.id,
  styles: [require('./country-list.scss')],
  template: require('./country-list.html').toString(),
})
export class CountryListComponent implements OnInit {
  @Input() countries = [];
  @Input() countryCode: string = '';
  @Output() onCountry = new EventEmitter<{ country: any }>();
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('AppState') private AppState: any,
    @Inject('$state') private $state: StateService
  ) { }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountryListComponent', false);
    this.$log.debug('constructor');
    this.AppState.ensureCountries().then((countries) => {
      this.countries = countries;
    });
  }
  filterByPattern(criteria: string) {
    return function (item: any) {
      if (!criteria) {
        return true;
      }
      return item.name.match(new RegExp(`^${criteria}`, 'i'));
    };
  }
  public showOnMap(country) {
    this.$log.debug('showOnMap', country);
    this.onCountry.emit({
      country
    });
  }
}
