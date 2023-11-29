import { Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-comment-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-overlay.component.html',
  styleUrl: './comment-overlay.component.css'
})
export class CommentOverlayComponent {

  constructor(
    private overlay: Overlay,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
  ) {}


  closeOverlay() {
    this.overlayService.closeOverlay();
  }
}
