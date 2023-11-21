import {Component, Input} from '@angular/core';
import {AuthService} from "../auth.service";
import { OverlayService } from '../overlay.service';
import { SettingsComponent } from '../settings/settings.component';
import { BugReportComponent } from '../bug-report/bug-report.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() opened= false;
  @Input() visible = true;

  constructor(private authService: AuthService, private overlayService: OverlayService) {}

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
  logOut() {
    this.authService.logout();
  }

  openSettings() {
    this.overlayService.openOverlay(SettingsComponent);
  }

  openBugReport() {
    this.overlayService.openOverlay(BugReportComponent);
  }
}
