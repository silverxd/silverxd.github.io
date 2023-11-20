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
  selectedBox: string = 'Default'; // Default selected box
  content: any = {
    'Default': {
      title: 'Settings page',
      description: 'Customize everything to your liking!'
    },
    'Appearence': {
      title: 'Appearence Settings',
      description: 'Customize the visual appearence of your application.'
    },
    'Privacy': {
      title: 'Privacy Settings',
      description: 'Manage your privacy preferences and settings.'
    },
    'Status': {
      title: 'Status Settings',
      description: 'Configure your status and online/offline preferences.'
    }
  };

  constructor(private overlayService: OverlayService) {}

  closeOverlay() {
    this.overlayService.closeOverlay();
  }

  changeContent(box: string) {
    this.selectedBox = box;
  }

  isBoxSelected(box: string): boolean {
    return this.selectedBox === box;
  }
}
