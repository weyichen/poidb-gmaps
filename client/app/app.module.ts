import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './auth/login.component';

import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';

import { routing } from './app.routes';

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
		UsersModule
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
