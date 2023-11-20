import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
directMessages = ['tere','yo', 'mis teed kah', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something']
}
