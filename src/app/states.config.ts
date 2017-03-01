import { IQService, IPromise } from 'angular';
//import { AppState } from '../common/services/appState/appState';
const countryState = {
  name: 'country',
  url: '/country',
  component: 'country'
};
const mapState = {
  name: 'map',
  url: '/map/{countryCode}',
  component: 'countryMap',
  parent: countryState,
  resolve: {
    countryInfo: ['$transition$', '$q',
      ($transition$, $q: IQService): IPromise<any> => {
        const code = $transition$.params().countryCode;
        return new $q((resolve, reject) => {
          if (!code) {
            resolve();
          } else {
            //AppState.getCountry(code).then(resolve, reject);
          }
        });
      }
    ]
  }
};
// state.config.ts

// we need to manually annotate DI
statesConfig.$inject = ['$stateProvider', '$urlServiceProvider'];
export function statesConfig($stateProvider, $urlServiceProvider) {

  // For any unmatched url, redirect to /state1
  $urlServiceProvider.rules.otherwise({ state: 'country' });

  // Now set up the states
  $stateProvider.state(countryState);
  $stateProvider.state(mapState);
}
