import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { AdminComponent } from "./admin/admin.component";
import { ClickerComponent } from './clicker/clicker.component';
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'home', component: HomeComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'clicker', component: ClickerComponent},
  { path: 'profile', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
