import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {AirtableService} from "../airtable.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  loginFailed: boolean = false;
  constructor(private airtableService: AirtableService, private router: Router, private headerComponent: HeaderComponent) {
    this.headerComponent.visible = false;

  }



  login() {
    this.airtableService.getUserByUsername(this.username).subscribe((user) => {
      if (user.records.length === 1 && user.records[0].fields.Password === this.password) {
        // Password is valid, navigate to the "home" component
        this.router.navigate(['/home']);
      } else if (this.username === 'admin' && this.password === 'admin'){
        this.router.navigate(['/admin'])
      } else {
        this.loginFailed = true;
      }
    });
  }
}
//
