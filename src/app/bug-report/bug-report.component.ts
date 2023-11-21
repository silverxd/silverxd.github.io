import { Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit } from '@angular/core';
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
export class BugReportComponent implements AfterViewInit {
  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate!: TemplateRef<any>; // Reference to your dropdown content template
  private overlayRef!: OverlayRef;
  problems: string[] = ['Transactions', 'Messages', 'Account', 'Credit', 'Posts', 'Other']
  problem_with: string = "Choose here..."
  public dropdownIsOpen: boolean = false

  constructor(
    private overlay: Overlay,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    this.initializeOverlay();
  }

  private initializeOverlay() {
    const dropdownElement = this.elementRef.nativeElement.querySelector('.dropdown');
    
    if (dropdownElement) {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(dropdownElement)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: true,
        backdropClass: 'dropdown-backdrop',
      });

      this.overlayRef.backdropClick().subscribe(() => this.toggleDropdown());
    }
  }


  toggleDropdown() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.dropdownIsOpen = false;
    } else {
      const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
      this.overlayRef.attach(portal);
      this.dropdownIsOpen = true;
    }
  }
  
  closeOverlay() {
    this.overlayService.closeOverlay();
  }

  changeDropdownDisplayHover(name: string) {
    this.problem_with = name
  }

  changeDropdownDisplayClick(name: string) {
    this.problem_with = name
    this.toggleDropdown()
  }
}
