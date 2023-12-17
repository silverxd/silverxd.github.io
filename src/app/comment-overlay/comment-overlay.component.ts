import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';

@Component({
  selector: 'app-comment-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-overlay.component.html',
  styleUrl: './comment-overlay.component.css'
})
export class CommentOverlayComponent {

  constructor(
    private overlayService: OverlayService,
  ) {}
  // comments: any;

  comments = [{'comment': 'See kommentaar ei ole kahjuks (aja ja Silveri oskuste puudumise tõttu) laetud andmebaasist! :(', 'profile_pic': "https://media.discordapp.net/attachments/1149290454819553420/1164864763105390592/b61f156cac360ab208b71ce5102ee9c5_400x400.png", "display_name": "Silver", "timestamp": "19/11/2023, 5:46 AM", },
  {'comment': 'Fun fact, Rasmus lasi kogu postituste baasi eelviimase sprindi ajal õhku :D', 'profile_pic': "https://media.discordapp.net/attachments/1149290454819553420/1164864763105390592/b61f156cac360ab208b71ce5102ee9c5_400x400.png", "display_name": "Silver", "timestamp": "20/11/2023, 4:20 AM", }]
  
  closeOverlay() {
    this.overlayService.closeOverlay();
  }
}
