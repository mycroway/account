import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ProfileComponent } from './views/profile/profile.component';
import { LoginComponent } from './views/login/login.component';
import { CreateComponent } from './views/create/create.component';
import { VerifyComponent } from './components/create/verify/verify.component';
import { ForgotComponent } from './views/password/forgot/forgot.component';
import { TokenComponent } from './views/password/token/token.component'
import { ResetComponent } from './views/password/reset/reset.component'

const routes: Routes = [{
  path: '', 
  component: HomeComponent
}, {
  path: 'profile',
  component: ProfileComponent
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'create',
  component: CreateComponent
}, {
  path: 'verify',
  component: VerifyComponent
}, {
  path: 'password/forgot', 
  component: ForgotComponent
}, {
  path: 'password/token',
  component: TokenComponent
}, {
  path: 'password/reset',
  component: ResetComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
