import { Component, OnInit, Inject, Input, Output, EventEmitter } from 'ng-metadata/core';
import { StateService } from 'angular-ui-router';
import { AppState } from '../../../common/services';

@Component({
  selector: 'country-list',
  moduleId: module.id,
  styles: [require('./country-list.scss')],
  template: require('./country-list.html').toString()
})
export class CountryListComponent implements OnInit {
  @Input() countries = [];
  @Input() countryCode: string = '';
  @Output() onCountry = new EventEmitter<{ country: any }>();
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('$state') private $state: StateService,
    private appState: AppState,
  ) {
    this.$log.debug('constructor');
  }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountryListComponent', true);
    this.$log.debug('ngOnInit');
    this.appState.ensureCountries().then((countries) => {
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
    this.appState.currentCountry(country);
    this.onCountry.emit(country);
  }
}
