import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() opened= false;
  @Input() visible = true;

  toggleSearch(): void {
    const searchBox = document.getElementById("search-bar");
    const moto = document.getElementById("header-moto");
    const logo = document.getElementById("header-logo");
    const menu = document.getElementById("header-menu");
    if (searchBox && moto && logo && menu) {
      searchBox.classList.toggle('active');
      moto.classList.toggle('inactive');
      logo.classList.toggle('inactive');
      menu.classList.toggle('inactive');
    }
  }
}
