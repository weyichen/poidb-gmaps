import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
