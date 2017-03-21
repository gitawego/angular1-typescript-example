import { StateService } from 'angular-ui-router';
import { Component, OnInit, Inject, Input } from 'ng-metadata/core';
import {StatefulComponent} from '../../common/core/StatefulComponent';
@Component({
  selector: 'country',
  moduleId: module.id,
  styles: [require('./country.scss')],
  template: require('./country.html').toString()
})
export class CountryComponent extends StatefulComponent implements OnInit {
  @Input() country: string;
  @Input() countryCode: string = '';
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('$state') protected $state: StateService
  ) {
    super();
  }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountryComponent', true);
    this.$log.debug('constructor');
  }
  onUpdate(countryCode: string) {
    this.$log.debug('onUpdate', countryCode);
    this.countryCode = countryCode;
  }
  countrySelected(country) {
    this.$log.debug('countrySelected', country);
    this.$state.go('map', {
      countryCode: country.alpha2Code
    });
  }
}
