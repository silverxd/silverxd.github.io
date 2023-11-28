import {Component} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";
import { OverlayService } from '../overlay.service';
import { AddFriendsComponent } from '../add-friends/add-friends.component';
import firebase from "firebase/compat";
import User = firebase.User;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: User | null;
  authState$: Observable<User | null>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private overlayService: OverlayService) {
    this.user = null;
    this.authState$ = this.afAuth.authState;
    this.authState$.subscribe((user) => {
      this.user = user;
    })
  }

  openAddFriends() {
    this.overlayService.openOverlay(AddFriendsComponent)
  }
}
