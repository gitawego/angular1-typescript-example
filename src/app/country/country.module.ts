import { NgModule } from 'ng-metadata/core';
import { CountryComponent } from './country.component';
import { CountrySearchComponent } from './search/countrySearch.component';
import { CountryMapComponent } from './map/countryMap.component';
import { CountryListComponent } from './list/countryList.component';

@NgModule({
  declarations: [
    CountryComponent,
    CountrySearchComponent,
    CountryMapComponent,
    CountryListComponent
  ]
})
export class CountryModule {
}
