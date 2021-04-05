import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ProfileComponent } from './views/profile/profile.component';
import { LoginComponent } from './views/login/login.component';
import { CreateComponent } from './views/create/create.component';
import { VerifyComponent } from './components/create/verify/verify.component';

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
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
