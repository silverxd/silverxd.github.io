import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SettingsComponent } from './settings/settings.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay) { }

  openOverlay() {
    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    };

    this.overlayRef = this.overlay.create(overlayConfig);

    const overlayPortal = new ComponentPortal(SettingsComponent);
    this.overlayRef.attach(overlayPortal);

    // Handle overlay backdrop click to close the overlay
    // this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());
  }

  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
