import { Component, OnInit, Inject } from 'ng-metadata/core';

@Component({
  selector: 'app',
  styles: [require('./app.scss')],
  template: `
    <div class="app">
      <ui-view></ui-view>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor(
    @Inject('$log') private $log: LogEx.ILogService,
    @Inject('AppState') private AppState: any
  ) { }

  ngOnInit() {
    this.$log = this.$log.getInstance('AppController', false);
    this.$log.debug('constructor');
  }

}
