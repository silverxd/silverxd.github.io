import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {combineLatest, from, map, Observable, of, switchMap, throttleTime, timer} from "rxjs";

interface Post {
  author_uid: string;
  comments: Array<any>;
  display_name: string;
  document_id: string;
  image_url: string;
  likes: Array<string>;
  profile_pic: string;
  text: string;
  timestamp: any;
}
interface Comment {
  comment: string;
  comment_author_uid: string;
  display_name: string;
  comment_likes: Array<string>;
  profile_pic: string;
  timestamp: any;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  user: User | null;
  authState$: Observable<User | null>;
  posts$: Observable<Post[]> = of([]);
  comments$: Observable<Comment[]> = of([]);

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user = null;
    this.authState$ = this.afAuth.authState;
    this.authState$.subscribe((user) => {
    this.user = user;
    });
  }
  getPosts(): Observable<Post[]> {
    if (this.user) {
      this.posts$ = this.db
      .collection<Post>('posts')
      .valueChanges()
      .pipe(
        switchMap((posts) => 
          combineLatest(
            posts.map((post) =>
              this.db
              .doc(`User/${post.author_uid}`)
              .valueChanges()
              .pipe(
                map((user_temp: any) => ({
                  ...post, display_name: user_temp.displayName, profile_pic: user_temp.profilepic
                }))
              )
            )
          )
        )
      );
      return this.posts$
    } else {
      console.warn('User not authenticated.');
      return of([]);
    };
  };
  getComments(post_id: string): Observable<Comment[]> {
    if (this.user) {
      this.comments$ = this.db
      .collection<Comment>('posts/' + post_id + '/comments')
        .valueChanges()
          .pipe(switchMap((comments) => combineLatest(
            comments.map((comment) =>
            this.db
            .doc(`User/${comment.comment_author_uid}`)
            .valueChanges()
            .pipe(
              map((user_temp: any) => ({
                ...comment, display_name: user_temp.displayName, profile_pic: user_temp.profilepic
              }))
            )
          )
        )
      ));
      return this.comments$
    } else {
      console.warn('User not authenticated.');
      return of([]);
    };
  };
}
