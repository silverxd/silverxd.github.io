import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FriendRequestService} from "../add-friends/friend-request.service";
import {SearchService} from "../add-friends/search.service";
import {AuthService} from "../auth.service";
import {map, Observable, take} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-friends-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends-box.component.html',
  styleUrl: './friends-box.component.css'
})
export class FriendsBoxComponent {
  friends = [{'userUID':'default', 'displayName': 'Imaginary friend', 'status': true}]
  myFriends = Object.entries(this.friends);
  user: any
  requestNames: any = []
  requestsArray: any

  constructor(private friendsRequest: FriendRequestService, private search: SearchService, private authService: AuthService, private db: AngularFirestore, private cd: ChangeDetectorRef) {
    this.authService.user$
      .pipe(take(1))
      .subscribe(value => {
        this.user = value;
        this.friendsRequest.getFriendRequests(this.user.uid).pipe(take(1)).subscribe((data: any) => {
          this.requestsArray = data.requests
          console.log(this.requestsArray)
          this.requestsArray.forEach((userUID: any) => {
            this.getDisplayNameByUserUID(userUID).pipe(take(1)).subscribe((data) => {
              this.requestNames.push({'userUID': userUID, 'displayName': data})
              this.cd.detectChanges()
            })
          })
        })
        this.getUserData(this.user.uid).subscribe((userdata) => {
          this.friends = userdata.friends
          this.cd.detectChanges()
        })
      })
  }


  getDisplayNameByUserUID(userUID: any): Observable<number> {
    return this.db.doc(`User/${userUID}`).valueChanges().pipe(
      map((userData: any) => userData ? userData.displayName : undefined)
    );
  }

  acceptFriendRequest(userUID: any, displayName: any) {
    console.log(userUID, displayName)
    this.addFriend(userUID)
    this.addToYourFriends(userUID, displayName)
  }

  addFriend(userUID: any) {
    this.getUserData(userUID).pipe(take(1)).subscribe((userdata) => {
      this.friends = userdata.friends || undefined
      if (this.friends != undefined) {
        const data = {
          friends: this.friends.concat({'userUID': this.user.uid, 'displayName': this.user.displayName, 'status':false})
        };
        this.db.collection('User').doc(userUID).set(data, {merge: true})
      } else {
        const data = {
          friends: [{'userUID': this.user.uid, 'displayName': this.user.displayName, 'status':false}]
        }
        this.db.collection('User').doc(userUID).set(data, {merge: true})
      }
      this.removeRequest(userUID)
    });
  }

  addToYourFriends(userUID: any, displayName: any) {
    this.getUserData(this.user.uid).pipe(take(1)).subscribe((myData) => {
      const myFriends = myData.friends || undefined
      if (myFriends != undefined) {
        const data = {
          friends: this.friends.concat({'userUID': userUID, 'displayName': displayName, 'status':false})
        };
        this.db.collection('User').doc(this.user.uid).set(data, {merge: true})
      } else {
        const data = {
          friends: [{'userUID': userUID, 'displayName': displayName, 'status':false}]
        }
        this.db.collection('User').doc(this.user.uid).set(data, {merge: true})
      }
    })
  }
  removeRequest(userUID: string){
    this.requestNames = this.requestNames.filter((item: { userUID: string; }) => item.userUID !== userUID);
    this.requestsArray = this.requestsArray.filter((item: string) => item !== userUID);
    this.cd.detectChanges()
    console.log(this.requestNames, this.requestsArray)
    this.db.collection('User').doc(this.user?.uid).set({requests: this.requestsArray}, {merge: true})
  }

  getUserData(userUID: string): Observable<any> {
    return this.db.collection('User').doc(userUID).valueChanges();
  }
}
