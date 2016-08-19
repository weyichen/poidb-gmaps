import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AuthService, AuthGuard, AdminGuard, NavService, UserService } from './index';

@NgModule({
	imports: [ CommonModule, HttpModule ],
	declarations: [ ],
	exports: [ CommonModule, FormsModule ]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [ 
				AuthService, 
				AuthGuard,
				AdminGuard,
				NavService, 
				UserService
			]
		}
	}
}