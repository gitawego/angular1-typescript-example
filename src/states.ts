import { IQService, IPromise } from 'angular';
import { AppState } from './common/services/app-state/app-state';
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
    countryInfo: ['AppState', '$transition$', '$q',
      (AppState: AppState, $transition$, $q: IQService): IPromise<any> => {
        const code = $transition$.params().countryCode;
        return new $q((resolve, reject) => {
          if (!code) {
            resolve();
          } else {
            AppState.getCountry(code).then(resolve, reject);
          }
        });
      }
    ]
  }
};
export const STATES: any[] = [countryState, mapState];
