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
  name: string = '';
  loginFailed: boolean = false;
  isPage: string = 'login';
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
  register() {
    // Create a new user object with the desired fields
    if (this.username.length >= 6 && this.password.length >= 6) {

      const newUser = {
        fields: {
          Name: this.name,
          Username: this.username, // You can add more fields as needed
          Password: this.password,
        },

      };

      // Send a POST request to create the new user
      this.airtableService.createUser(newUser).subscribe(
        (response) => {
          // Registration successful, you can add further handling
          console.log('User registered successfully:', response);

          // Optionally, you can navigate the user to the login page after successful registration
          this.router.navigate(['/login']);
        },
        (error) => {
          // Handle registration failure, e.g., display an error message
          alert('Registration failed:');
        }
      );
    } else {
      alert('Enter more than 6 characters')
    }
  }
  forgot(){
    alert('This function is in development')
  }
}
