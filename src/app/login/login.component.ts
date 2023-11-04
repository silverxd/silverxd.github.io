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
  isPage: string = 'login';
  public loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router, private headerComponent: HeaderComponent) {
    this.headerComponent.visible = false;

  }

  login() {
    this.authService.login(this.email, this.password)
    this.authService.loginFailed$.subscribe((loginFailed) => {this.loginFailed = loginFailed;});
  }
  register() {
    const requirementsNotMet = [];

    if (this.password.length < 8) {
      requirementsNotMet.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(this.password)) {
      requirementsNotMet.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(this.password)) {
      requirementsNotMet.push('at least one lowercase letter');
    }
    if (!/[!@#$%^&*]/.test(this.password)) {
      requirementsNotMet.push('at least one special character (!@#$%^&*).');
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
      alert('Email you entered is not correct')
    }
    if (requirementsNotMet.length === 0) {
      // Password meets the requirements, proceed with registration
      this.authService.register(this.email, this.password);
    } else {
      // Password does not meet the requirements, display an alert with error message
      const errorMessage = `Password should meet the following requirements: ${requirementsNotMet.join(', ')}`;
      alert(errorMessage);
    }
  }
  forgot(){
    this.authService.sendPasswordResetEmail(this.email)
  }
}
