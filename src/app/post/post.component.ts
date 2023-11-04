import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  username: string = "Silver";
  totalPosts: number = 2;
  allPosts: Array<Array<any>> = [['Silver', '11. Oktoober kell 19:46', 128, 95, 'pange saun sooja, Silver tuleb rekordeid purustama', 'https://media.discordapp.net/attachments/1146094400666091524/1161706521235832994/IMG_2645.jpg', 'https://media.discordapp.net/attachments/1149290454819553420/1164864763105390592/b61f156cac360ab208b71ce5102ee9c5_400x400.png', false],
  ['Rasmus', '11. Oktoober kell 21:25', 84, 52, 'Uued keycapsid!', 'https://ptpimg.me/y8v9a5.png', 'https://ptpimg.me/8n699g.jpg', true]];

  toggleLike(i: number) {
    if (this.allPosts[i][7] === true) {
      this.allPosts[i][7] = false;
      this.allPosts[i][2] -= 1;
    } else {
      this.allPosts[i][7] = true
      this.allPosts[i][2] += 1;
    };
  };
  postComment(i: number) {
      this.allPosts[i][3] += 1;
  };
};
