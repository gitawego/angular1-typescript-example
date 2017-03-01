import { platformBrowserDynamic } from 'ng-metadata/platform-browser-dynamic';
import { enableProdMode } from 'ng-metadata/core';
import { AppModule } from './app/app.module';

if (ENV === 'production') {
  enableProdMode();
}


platformBrowserDynamic().bootstrapModule(AppModule);
