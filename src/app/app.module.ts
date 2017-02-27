import { NgModule } from 'ng-metadata/core';
import * as ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import * as ngMap from 'ngmap';
import 'LogUnobtrusiveExtension/dist/log-ex-unobtrusive';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { provideState } from './app.states';
import { AppState } from '../common/services/appState/appState';
import { CountryModule } from './country/country.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ngMaterial,
    uiRouter as any,
    ngMap,
    'log.ex.uo',
    CountryModule,
  ],
  providers: [
    AppConfig,
    AppState,
    provideState,
  ]
})
export class AppModule {
}
