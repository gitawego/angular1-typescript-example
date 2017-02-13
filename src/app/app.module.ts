import { NgModule } from 'ng-metadata/core';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { CountryModule } from './country/country.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CountryModule
  ],
  providers: [
    AppConfig
  ]
})
export class AppModule {
}
