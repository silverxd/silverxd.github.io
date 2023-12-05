import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "../auth.service";
import {Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {
  outgoingFriendRequest: { name: string, debux: number, uid: string } [] = []
  userUID: any

  constructor(private db: AngularFirestore, private authservice: AuthService) {
    this.authservice.user$.subscribe(value => {
      this.userUID = value?.uid;
    })
  }

  addFriend(person: any) {
    console.log('it works?')
    person["requestAccepted"] = false;
    this.outgoingFriendRequest.push(person)
    this.sendFriendRequest(person)
    console.log('activated')
  }

  sendFriendRequest(person: any) {
    this.getFriendRequests(person.userUID)
      .pipe(take(1))
      .subscribe((existing: any) => {
        let existingRequests = existing?.requests || undefined;
        if (existingRequests != undefined && !existingRequests.includes(this.userUID)) {
          const data = {
            requests: existingRequests.concat(this.userUID)
          };
          this.db.collection('User').doc(person.userUID).set(data, {merge: true})
        } else {
          const data = {
            requests: [this.userUID]
          }
          this.db.collection('User').doc(person.userUID).set(data, {merge: true})
        }
      })
  }


  getFriendRequests(userUID: string): Observable<any> {
    return this.db.collection('User').doc(userUID).valueChanges();
  }
}
