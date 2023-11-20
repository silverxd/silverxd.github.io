import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.css'
})
export class BugReportComponent {
  constructor(private overlayService: OverlayService) {}
  
  closeOverlay() {
    this.overlayService.closeOverlay();
  }
}
