import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { routing } from './app.routes';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpModule
    // MdSlideToggleModule,
    // MdButtonModule,
    // MdToolbarModule,
    // MdCardModule,
    // MdInputModule,
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
