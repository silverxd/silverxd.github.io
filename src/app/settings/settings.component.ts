import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(private overlayService: OverlayService) {}

  closeOverlay() {
    this.overlayService.closeOverlay();
  }
}
