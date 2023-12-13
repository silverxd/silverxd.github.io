import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FriendRequestService} from "../add-friends/friend-request.service";
import {SearchService} from "../add-friends/search.service";
import {AuthService} from "../auth.service";
import {Observable, take} from "rxjs";
import {MessagesService} from "../messages/messages.service";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";


@Component({
  selector: 'app-friends-box',
  templateUrl: './friends-box.component.html',
  styleUrl: './friends-box.component.css'
})
export class FriendsBoxComponent {
  friends: { userUID: any; displayName: any; status: boolean; chatID: string; profilepic: string }[] = []
  user: any
  requestNames: any = []
  requestsArray: any
  chatID: string

  constructor(private friendsRequest: FriendRequestService,
              private search: SearchService,
              private authService: AuthService,
              private db: AngularFirestore,
              private cd: ChangeDetectorRef,
              private messagesService: MessagesService,
              private router: Router) {

    this.chatID = ""
    this.authService.user$
      .pipe(take(1))
      .subscribe(value => {
        this.user = value;
        this.friendsRequest.getFriendRequests(this.user.uid).pipe(take(1)).subscribe((data: any) => {
          this.requestsArray = data.requests
          console.log(this.requestsArray)
          this.requestsArray.forEach((userUID: any) => {
            this.getDisplayNameByUserUID(userUID).pipe(take(1)).subscribe((data) => {
              this.requestNames.push({'userUID': userUID, 'displayName': data.displayName, 'profilepic': data.profilepic})
              this.cd.detectChanges()
            })
          })
        })
        this.getUserData(this.user.uid).pipe(take(1)).subscribe((userdata) => {
          userdata.friends.forEach((array: any) => {
            console.log(array)
            this.getUserData(array.userUID).pipe(take(1)).subscribe((user) => {
              array['profilepic'] = user.profilepic;
              this.friends.push(array)
            })
          })
          this.cd.detectChanges()
        })
      })
  }


  getDisplayNameByUserUID(userUID: any): Observable<any> {
    return this.db.doc(`User/${userUID}`).valueChanges()
  }

  acceptFriendRequest(userUID: any, displayName: any, profilepic: string) {
    console.log(userUID, displayName, profilepic)
    this.createChatBetweenUsers(userUID).then(chatID => {
      this.addFriend(userUID, chatID)
      this.addToYourFriends(userUID, displayName, chatID, profilepic)
    })
  }

  addFriend(userUID: any, chatID: string) {
    this.getUserData(userUID).pipe(take(1)).subscribe((userdata) => {
      this.friends = userdata.friends || undefined
      if (this.friends != undefined) {
        const data = {
          friends: this.friends.concat({
            'userUID': this.user.uid,
            'displayName': this.user.displayName,
            'status': false,
            'chatID': chatID,
            'profilepic': this.user.profilepic
          })
        };
        this.db.collection('User').doc(userUID).set(data, {merge: true})
      } else {
        const data = {
          friends: [{
            'userUID': this.user.uid,
            'displayName': this.user.displayName,
            'status': false,
            'chatID': chatID,
            'profilepic': this.user.profilepic
          }]
        }
        this.db.collection('User').doc(userUID).set(data, {merge: true})
      }
    })
    this.removeRequest(userUID)
  }

  addToYourFriends(userUID: any, displayName: any, chatID: string, profilepic: string) {
    this.getUserData(this.user.uid).pipe(take(1)).subscribe((myData) => {
      const myFriends = myData.friends || undefined
      if (myFriends != undefined) {
        const data = {
          friends: this.friends.concat({
            'userUID': userUID,
            'displayName': displayName,
            'status': false,
            'chatID': chatID,
            'profilepic': profilepic
          })
        };
        this.db.collection('User').doc(this.user.uid).set(data, {merge: true})
      } else {
        const data = {
          friends: [{
            'userUID': userUID,
            'displayName': displayName,
            'status': false,
            'chatID': chatID,
            'profilepic': profilepic
          }]
        }
        this.db.collection('User').doc(this.user.uid).set(data, {merge: true})
      }
    })
  }

  removeRequest(userUID: string) {
    this.requestNames = this.requestNames.filter((item: { userUID: string; }) => item.userUID !== userUID);
    this.requestsArray = this.requestsArray.filter((item: string) => item !== userUID);
    this.cd.detectChanges()
    this.db.collection('User').doc(this.user?.uid).set({requests: this.requestsArray}, {merge: true})
  }

  createChatBetweenUsers(userUID: string): Promise<any> {
    return this.db.collection('Chats').add({Users: [userUID, this.user.uid]})
      .then((docRef) => {
        return docRef.id;
      });
  }

  getUserData(userUID: string): Observable<any> {
    return this.db.collection('User').doc(userUID).valueChanges();
  }

  openChat(chatID: string, friendID: string) {
    console.log('want to open chat', chatID)
    if (this.router.url != '/messages') {
      console.log('navigating you to messages')
      this.router.navigate(['messages'])
    }
    this.chatID = chatID;
    this.messagesService.setChatId(chatID, friendID);
  }

}
