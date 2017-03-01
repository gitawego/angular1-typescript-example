import { NgModule } from 'ng-metadata/core';
import { AsyncPipe } from 'ng-metadata/common';
import * as ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import * as ngMap from 'ngmap';
import 'LogUnobtrusiveExtension/dist/log-ex-unobtrusive';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { statesConfig } from './states.config';
import { CountryModule } from './country/country.module';
import { AppState } from '../common/services';
@NgModule({
  declarations: [
    AppComponent,
    AsyncPipe,
  ],
  imports: [
    'log.ex.uo',
    ngMaterial,
    uiRouter as any,
    ngMap,
    CountryModule,
  ],
  providers: [
    AppConfig,
    statesConfig,
    AppState,
  ]
})
export class AppModule {
}
