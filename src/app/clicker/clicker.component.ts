import { Component, OnInit, Output } from '@angular/core';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.component.html',
  styleUrls: ['./clicker.component.css']
})
export class ClickerComponent implements OnInit{
  @Output() debux;

  constructor() {
    this.debux = 0;
  }

  ngOnInit() {
  }

  addDebux() {
    this.debux = this.debux + 1
  }
}
