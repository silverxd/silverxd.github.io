import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private headerComponent: HeaderComponent, private authService: AuthService) {
    this.headerComponent.visible = true;
  }
  logout(){
    this.authService.logout()
  }
}
