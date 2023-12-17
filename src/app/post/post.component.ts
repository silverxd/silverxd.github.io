import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore } from  '@angular/fire/compat/firestore';
import {AngularFireAuth} from "@angular/fire/compat/auth";
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

  constructor(public service: PostService, private store: AngularFirestore, private cd: ChangeDetectorRef, private overlayService: OverlayService){
    this.loading = false;
  }

  ngOnInit(){
    // Subscribe to authentication state changes
    this.service.authState$.subscribe((user) => {
      if (user) {
        this.loading = true;
        // Fetch posts from the database
        this.service.getPosts().subscribe((value) => {
          this.posts = value.sort((a, b) => a.timestamp - b.timestamp) || 0;
          this.loading = false;
          this.cd.detectChanges()
        });
      }
    });
  }

  toggleLike(post_id: number) {
    let amount_of_likes = parseInt(document.getElementById('n' + post_id.toString())?.textContent?.replace(/[^0-9]/g, '')!);
    if (document.getElementById(post_id.toString())?.getAttribute("src") == "assets/img/like_active.svg") {
      document.getElementById(post_id.toString())?.setAttribute("src", "assets/img/like_inactive.svg");
      if (amount_of_likes == 1) {
        document.getElementById('n' + post_id.toString())!.textContent = "0 likes";
      }
      if (amount_of_likes == 2) {
        document.getElementById('n' + post_id.toString())!.textContent = "1 like";
      } else {
        amount_of_likes -= 1;
        document.getElementById('n' + post_id.toString())!.textContent = amount_of_likes + " likes";
      }
    } else {
      document.getElementById(post_id.toString())?.setAttribute("src", "assets/img/like_active.svg");
      if (amount_of_likes == 0) {
        document.getElementById('n' + post_id.toString())!.textContent = "1 like";
      } else {
        amount_of_likes += 1;
        document.getElementById('n' + post_id.toString())!.textContent = amount_of_likes + " likes";
      }
    }
  };
  postComment(i: number) {
    // this.allPosts[i][3] += 1;
  };

  openCommentOverlay() {
    this.overlayService.openOverlay(CommentOverlayComponent);
  };
};
