import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {from, map, Observable, of, switchMap, throttleTime, timer} from "rxjs";

interface Post {
  author_uid: string;
  comments: Array<any>;
  image_url: string;
  likes: Array<string>;
  text: string;
  timestamp: any;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  user: User | null;
  authState$: Observable<User | null>;
  

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user = null;
    this.authState$ = this.afAuth.authState;
    this.authState$.subscribe((user) => {
    this.user = user;
    });
  }
  getPosts(): Observable<Post[]> {
    return this.db.collection<Post>('posts').valueChanges();
  
    /* or instead snapshotChanges() with map()
      return this.firestore.collection<Employee>('employees')
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
        });
      )
    */
  };
}
