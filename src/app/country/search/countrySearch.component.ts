import { Component, OnInit, Inject, Input, Output, EventEmitter } from 'ng-metadata/core';
import { StateService } from 'angular-ui-router';
import { AppState } from '../../../common/services/appState/appState';

@Component({
  selector: 'country-search',
  moduleId: module.id,
  styles: [require('./country-search.scss')],
  template: require('./country-search.html').toString(),
  providers: [
    AppState,
  ],
})
export class CountrySearchComponent implements OnInit {
  @Input() countryCode: string = '';
  @Output() onUpdate = new EventEmitter<{ countryCode: string }>();
  constructor(
    @Inject('$log') private $log: LogEx.ILogService
  ) { }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountrySearchComponent', false);
    this.$log.debug('constructor');
  }
  update(): void {
    this.onUpdate.emit({
      countryCode: this.countryCode
    });
  }
}
