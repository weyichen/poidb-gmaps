import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './components/app.component';
import { appRouterProviders } from './app.routes';

bootstrap(AppComponent, [
  appRouterProviders,
  HTTP_PROVIDERS
])
.catch((err: any) => console.error(err));
