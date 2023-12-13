import { Component, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import User = firebase.User;

@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrl: './profile-box.component.css'
})
export class ProfileBoxComponent {
  authState$: Observable<User | null>;
  user: User | null;
  notification: boolean;
  message: boolean;
  notificationOpen: boolean;
  messageOpen: boolean;

  constructor(private afAuth: AngularFireAuth, private cdr: ChangeDetectorRef,) {
    this.user = null;
    this.authState$ = this.afAuth.authState;
    this.authState$.subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges();
    })
    this.notification = false;
    this.message = false;
    this.notificationOpen = false;
    this.messageOpen = false;
  }

  dynamicStyles(text: string | undefined | null): any {
    if (!text) {
      return
    }
    const textLength = text.length;
    if (text === this.user?.displayName && textLength > 15) {
      const fontSize = 1.3 - (textLength / 50);
  
      return {
        'font-size': `${fontSize}vw`,
        'white-space': 'nowrap',
        'overflow': 'hidden'
      };
    } else if (text === this.user?.email && textLength > 25) {
      const fontSize = 0.8 - (textLength / 50);
  
      return {
        'font-size': `${fontSize}vw`,
        'white-space': 'nowrap',
        'overflow': 'hidden'
      };
    }
  }

  toggleNotification(type: string) {
    this.notification = false
    if (type === 'o') {
      this.notificationOpen = true
    } else if (type === 'c') {
      this.notificationOpen = false
    }
  }

  toggleMessage(type: string) {
    this.message = false
    if (type === 'o') {
      this.messageOpen = true
    } else if (type === 'c') {
      this.messageOpen = false
    }
  }

  makeActive() {
    this.notification = true;
    this.message = true;
  }
}