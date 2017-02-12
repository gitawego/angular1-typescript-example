// import app component classes
import * as angular from 'angular';
import { Country } from './country/country';
import { CountrySearch } from './country-search/country-search';
import { CountryList } from './country-list/country-list';
import { CountryMap } from './country-map/country-map';

// bundle component classes into angular components
export default angular.module('app.components', [])
  .component('country', new Country())
  .component('countrySearch', new CountrySearch())
  .component('countryList', new CountryList())
  .component('countryMap', new CountryMap())
