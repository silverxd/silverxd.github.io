import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() opened= false;
  @Input() visible = true;
  isSearchVisible: boolean = true;

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }
}
