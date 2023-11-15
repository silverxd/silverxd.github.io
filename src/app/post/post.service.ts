import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {from, map, Observable, of, switchMap, throttleTime, timer} from "rxjs";

interface Post {
  author_uid: string;
  comments: Array<any>;
  display_name: string;
  image_url: string;
  likes: Array<string>;
  profile_pic: string;
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
    if (this.user) {
      return this.db.collection<Post>('posts').valueChanges();
    } else {
      console.warn('User not authenticated.');
      return of([]);
    };
    /* or instead snapshotChanges() with map()
      return this.firestore.collection<Post>('posts')
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
  getDisplaynames(posts: any) {
    if (this.user) {
      for (let post of posts) {
        console.log(this.db.doc(`User/${post.author_uid}/displayName`).valueChanges().pipe().toString());
      };
      return posts;
    } else {
      console.warn('User not authenticated.'); // Use warn for non-critical issues
      return "Something has gone terribly wrong"; // Return a string
    };
  };
}
