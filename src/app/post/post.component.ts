import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from  '@angular/fire/compat/firestore';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import { PostService } from "./post.service";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit{
  loading: boolean;
  posts: any;
  
  constructor(public service: PostService, private store: AngularFirestore){
    this.loading = false;
  }
  
  ngOnInit(){
    // Subscribe to authentication state changes
    this.service.authState$.subscribe((user) => {
      if (user) {
        this.loading = true;
        // Fetch posts from the database
        this.service.getPosts().subscribe((value) => {
          this.posts = value || 0;
        });
        // Get the display names (and profile pictures?) for each post (DOES NOT WORK!!)
        this.service.getDisplaynames(this.posts).subscribe((value: any) => {
          this.posts = value;
          console.log(this.posts)
          this.loading = false;
        });
        
      }
    });
  }

  toggleLike(i: number) {
    // if (this.allPosts[i][7] === true) {
    //   this.allPosts[i][7] = false;
    //   this.allPosts[i][2] -= 1;
    // } else {
    //   this.allPosts[i][7] = true
    //   this.allPosts[i][2] += 1;
    // };
  };
  postComment(i: number) {
    // this.allPosts[i][3] += 1;
  };
};
