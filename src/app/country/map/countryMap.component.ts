import {
  Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, SimpleChanges
} from 'ng-metadata/core';
import { StateService, UIRouterGlobals } from 'angular-ui-router';
import { AppState } from '../../../common/services';
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
export class CountryMapComponent implements OnInit, OnChanges {
  @Input() countryInfo: CountryInfo;
  @Input() countryCode: string;
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('$uiRouterGlobals') private $uiRouterGlobals: UIRouterGlobals,
    private appState: AppState
  ) { }

  ngOnInit() {
    this.$log = this.$log.getInstance('CountryMapComponent', true);
    this.$log.debug('ngOnInit');
  }
  ngOnChanges(changes: SimpleChanges) {
    this.$log.debug('changes', changes, this.$uiRouterGlobals);
    this.getCountry();
  }
  getParams() {
    return this.$uiRouterGlobals.params;
  }
  getCountry() {
    const params = this.getParams();
    if (params.countryCode) {
      this.appState.getCountry(params.countryCode)
        .then(resp => {
          this.countryInfo = resp;
        })
        .catch(err => this.$log.error(err));
    }
  }
}
