import { NgModule } from 'ng-metadata/core';
import * as ngMaterial from 'angular-material';
import * as uiRouter from 'angular-ui-router';
import * as ngMap from 'ngmap';
import * as logEx from 'LogUnobtrusiveExtension/dist/log-ex-unobtrusive';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { CountryModule } from './country/country.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ngMaterial,
    uiRouter as any,
    ngMap,
    logEx,
    AppConfig,
    CountryModule
  ],
  providers: [

  ]
})
export class AppModule {
}
