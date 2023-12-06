import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FriendsBoxComponent} from "../friends-box/friends-box.component";
import {Message, MessagesService} from "./messages.service";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule, PickerComponent, FriendsBoxComponent, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})

export class MessagesComponent implements OnInit {
  @Input() chatId!: string
  messages: Message[] = [];
  newMessage: string = '';
  directMessages = ['tere', 'yo', 'mis teed kah', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'something', 'hei hopsti', 'hei hopsti', 'hei hopsti', 'hei hopsti', 'hei hopsti', 'hei hopsti']
  isEmojiPickerVisible: boolean = false;

  constructor(private messageService: MessagesService) {

  }

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages(): void {
    this.messageService.getMessages('sjHQ471UGOo72k3pgjHG').subscribe((messages) => {
      this.messages = messages;
      console.log('done', messages[1])
      this.messages.forEach((messages) => {
        console.log('Message Content', messages.content)
      })
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const message: Message = {
        id: 'sjHQ471UGOo72k3pgjHG',
        senderId: 'currentUserId', // Replace with the actual sender ID
        content: this.newMessage,
        timestamp: new Date(), // Use JavaScript Date for the timestamp
      };

      this.messageService.sendMessage(message, 'sjHQ471UGOo72k3pgjHG').then(() => {
        this.newMessage = '';
      });
    }
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

