import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  showHeader: boolean = false;
  constructor(private router: Router, private headerComponent: HeaderComponent) {
    this.headerComponent.visible = false;

  }



  login() {
    // Check if username and password meet your criteria for validation
    if (this.username.length >= 6 && this.password.length >= 6) {
      // You can add more validation logic here if needed
      this.router.navigate(['home']); // Route to the "home" page
    } else if (this.username == 'admin' && this.password =='admin') {
      this.router.navigate(['admin']);
    }
    else {
      alert('There should be more than 6 characters'); // Show an alert for invalid input
    }
  }
}
