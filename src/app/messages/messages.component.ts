import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  directMessages = ['tere', 'yo', 'mis teed kah', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something']

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    // Implement image upload logic using Firebase Storage
  }
}
