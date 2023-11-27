import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-friends-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends-box.component.html',
  styleUrl: './friends-box.component.css'
})
export class FriendsBoxComponent {
  friends = {"Silver": true, "Rasmus": false, "Cool friend": true, "Keegi": false, "Kolmas": true, "neljas": true}
  myFriends = Object.entries(this.friends);
}
