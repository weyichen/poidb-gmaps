import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UserProfileComponent } from './users/user-profile.component';
import { ProfileEditComponent } from './users/profile-edit.component';
import { LoginComponent } from './auth/login.component';

import { AuthService, AuthGuard, NavService, UserService } from './shared/index';

import { routing } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserProfileComponent,
    ProfileEditComponent,
    LoginComponent
  ],
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
  providers: [
    AuthService,
    AuthGuard,
    NavService,
    UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
