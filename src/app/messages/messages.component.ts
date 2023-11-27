import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FriendsBoxComponent} from "../friends-box/friends-box.component";


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule, PickerComponent, FriendsBoxComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent {
  directMessages = ['tere', 'yo', 'mis teed kah', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'hei hopsti', 'hei hopsti', 'hei hopsti', 'hei hopsti', 'hei hopsti', 'hei hopsti']
  isEmojiPickerVisible: boolean = false;

  constructor() {

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    // Implement image upload logic using Firebase Storage
  }


  toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  handleEmojiClick(event: any) {
    // Handle the selected emoji
    console.log('Selected Emoji:', event.emoji);
  }
}

