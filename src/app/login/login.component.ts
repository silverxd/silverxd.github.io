import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {AuthService} from "../auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  name: string = '';
  loginFailed: boolean = false;
  isPage: string = 'login';

  constructor(private authService: AuthService, private router: Router, private headerComponent: HeaderComponent) {
    this.headerComponent.visible = false;

  }

  login() {
    this.authService.login(this.email, this.password)
  }
  register() {
    this.authService.register(this.email, this.password)
  }
  forgot(){
    this.authService.sendPasswordResetEmail(this.email)
  }
}
