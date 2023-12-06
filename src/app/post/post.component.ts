import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from  '@angular/fire/compat/firestore';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { PostService } from "./post.service";
import { OverlayService } from '../overlay.service';
import { CommentOverlayComponent } from '../comment-overlay/comment-overlay.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit{
  loading: boolean;
  posts: any;
  comments: any;
  
  constructor(public service: PostService, private CommentOverlay: CommentOverlayComponent, private overlayService: OverlayService){
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
  openCommentOverlay(i: string) {
    // Subscribe to authentication state changes
    this.service.authState$.subscribe((user) => {
      if (user) {
        this.loading = true;
        // Fetch comments from the database
        this.service.getComments(i).subscribe((value) => {
          this.CommentOverlay.comments = value // CommentOverlayComponent.comments = value || 0;
          console.log(value)
          this.loading = false;
          
        });
        this.overlayService.openOverlay(CommentOverlayComponent);
      }
    });
    
  };
};
