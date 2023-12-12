import {Component, Input, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import {AuthService} from "../auth.service";
import { OverlayService } from '../overlay.service';
import { SettingsComponent } from '../settings/settings.component';
import { BugReportComponent } from '../bug-report/bug-report.component';
import { ScrollService } from '../scroll-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  @Input() opened= false;
  @Input() visible = true;
  @ViewChild('matSidenavContent', { read: ElementRef }) matSidenavContent: ElementRef | undefined;

  constructor(private authService: AuthService, private overlayService: OverlayService, private scrollService: ScrollService) {}

  ngAfterViewInit() {
    // Ensure matSidenavContent is defined before subscribing to the scroll events
    if (this.matSidenavContent) {
      this.matSidenavContent.nativeElement.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  @HostListener('window:resize')
  onResize() {
    // Handle window resize events if needed
  }

  handleScroll(event: Event) {
    // Handle scroll events here
    const scrollValue = (event.target as HTMLElement).scrollTop;
    console.log('Scroll value:', scrollValue);
    this.scrollService.updateScroll(scrollValue);
  }

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
