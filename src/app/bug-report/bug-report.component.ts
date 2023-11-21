import { Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.css'
})
export class BugReportComponent {
  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate!: TemplateRef<any>; // Reference to your dropdown content template
  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
  ) {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'dropdown-backdrop',
      panelClass: "mat-elevation-z8",
    });

    this.overlayRef.backdropClick().subscribe(() => this.toggleDropdown());
  }

  toggleDropdown() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    } else {
      const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
      this.overlayRef.attach(portal);
    }
  }
  
  closeOverlay() {
    this.overlayService.closeOverlay();
  }
}
