import {Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @Input() visible = true
  constructor(public router: Router){}
  title = 'earn2post';
}
