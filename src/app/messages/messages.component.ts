import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FriendsBoxComponent} from "../friends-box/friends-box.component";
import {Message, MessagesService} from "./messages.service";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink, MatFormFieldModule, MatInputModule, PickerComponent, FriendsBoxComponent, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})

export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messages: Message[] = [];
  newMessage: string = '';
  isEmojiPickerVisible: boolean = false;
  user: any
  client: any
  chatID: string
  friendID: string
  friend: any

  constructor(private messageService: MessagesService, private authService: AuthService, private cd: ChangeDetectorRef) {
    this.chatID = ''
    this.friend = {'displayName': ''}
    this.friendID = 'Imaginary Friend'
    this.authService.user$.subscribe(value => {
      this.user = value
      if (this.user) {
        this.messageService.getFriend(this.user.uid).subscribe((user) => {
          this.client = user
        })
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight
      this.cd.detectChanges()
    } catch (err) {
      console.error(err);
    }
  }

  ngOnInit(): void {
    this.messageService.chatId$.subscribe((chatId) => {
      this.chatID = chatId
      if (this.chatID) {
        this.fetchMessages(this.chatID)
      }
    })
    this.messageService.friendID.subscribe((friendID) => {
      this.friendID = friendID
      if (this.friendID) {
        console.log('works')
        this.messageService.getFriend(this.friendID).subscribe((friend) => {
          this.friend = friend
          this.ngAfterViewChecked()
        })
      }
    })
  }

  fetchMessages(chatId: string): void {
    this.messageService.getMessages(chatId).subscribe((messages) => {
      this.messages = messages;
      this.ngAfterViewChecked()
    });
  }

  sendMessage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (this.chatID != '') {
      if (this.newMessage.trim() !== '') {
        const message: Message = {
          id: this.chatID,
          senderId: this.user.uid, // Replace with the actual sender ID
          content: this.newMessage,
          timestamp: new Date(), // Use JavaScript Date for the timestamp
        };
        this.newMessage = '';
        this.messageService.sendMessage(message, this.chatID).then(() => {
          this.scrollToBottom()
        });
      }
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

