import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { MapModule } from './map/map.module';

import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login.component';

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		routing,
		SharedModule.forRoot(),
		UsersModule,
		MapModule
	],
	providers: [
		Title
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
