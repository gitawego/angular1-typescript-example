import { Component, OnInit, Inject, Input, Output, EventEmitter } from 'ng-metadata/core';
import { StateService } from 'angular-ui-router';


@Component({
  selector: 'country-list',
  moduleId: module.id,
  styles: [require('./country-map.scss')],
  template: require('./country-map.html').toString(),
})
export class CountrySearchComponent implements OnInit {
  @Input() countryCode: string = '';
  @Output() onUpdate = new EventEmitter<{ countryCode: string }>();
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('AppState') private AppState: any
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
