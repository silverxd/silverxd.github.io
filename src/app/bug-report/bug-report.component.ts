import {AngularFirestore} from "@angular/fire/compat/firestore";

export interface Bug {
  topic: string;
  customText: string;
  timestamp: Date;
}

import { Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-bug-report',
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.css'
})
export class BugReportComponent implements AfterViewInit {
  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate!: TemplateRef<any>; // Reference to the dropdown content template
  @ViewChild('cancelTemplate', { static: true }) cancelTemplate!: TemplateRef<any>; // Reference to the cancel content template
  @ViewChild('sendTemplate', { static: true }) sendTemplate!: TemplateRef<any>; // Reference to the cancel content template
  private dropdownoverlayRef!: OverlayRef;
  private cancelOverlayRef!: OverlayRef;
  private sendOverlayRef!: OverlayRef;

  problems: string[] = ['Transactions', 'Messages', 'Account', 'Credit', 'Posts', 'Other'];
  problem_with: string = "Choose here...";
  public dropdownIsOpen: boolean = false;

  public sendIsYes: boolean = false;

  userInput: string = '';

  constructor(
    private overlay: Overlay,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private db: AngularFirestore,
  ) {}

  ngAfterViewInit() {
    this.initializeDropdown();
    this.initializeCancel();
    this.initializeSend();
  }

  private initializeDropdown() {
    const dropdownElement = this.elementRef.nativeElement.querySelector('.dropdown');

    if (dropdownElement) {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(dropdownElement)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}
        ]);

      this.dropdownoverlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: true,
        backdropClass: 'dropdown-backdrop',
      });

      this.dropdownoverlayRef.backdropClick().subscribe(() => this.toggleDropdown());
    }
  }

  private initializeCancel() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();

        this.cancelOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
  }

  private initializeSend() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();

        this.sendOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
  }

  toggleDropdown() {
    if (this.dropdownoverlayRef.hasAttached()) {
      this.dropdownoverlayRef.detach();
      this.dropdownIsOpen = false;
    } else {
      const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
      this.dropdownoverlayRef.attach(portal);
      this.dropdownIsOpen = true;
    }
  }

  toggleCancel() {
    if (this.cancelOverlayRef.hasAttached()) {
      this.cancelOverlayRef.detach();
    } else {
      const portal = new TemplatePortal(this.cancelTemplate, this.viewContainerRef);
      this.cancelOverlayRef.attach(portal);
    }
  }

  toggleSend() {
    if (this.sendOverlayRef.hasAttached()) {
      this.sendOverlayRef.detach();
    } else {
      const portal = new TemplatePortal(this.sendTemplate, this.viewContainerRef);
      this.sendOverlayRef.attach(portal);
    }
  }

  changeDropdownDisplayHover(name: string) {
    this.problem_with = name;
  }

  changeDropdownDisplayClick(name: string) {
    this.problem_with = name;
    this.toggleDropdown();
  }

  cancelYes() {
    if (this.cancelOverlayRef) {
      this.cancelOverlayRef.detach();
      this.cancelOverlayRef.dispose();
    }
    this.closeOverlay();
  }

  sendYes() {
    this.sendIsYes = !this.sendIsYes
    this.sendReportToDatabase(this.userInput, this.problem_with)
  }

  closeOverlay() {
    this.overlayService.closeOverlay();
  }

  sendReportToDatabase(userInput: string, problem: string) {
    const bug: Bug = {
      topic: problem,
      customText: userInput,
      timestamp: new Date(),
    }
    this.db.collection('Bugs').add(bug)
      .then(() => {
      console.log('Bug report has been successfully sent to admins.')
    })
      .catch((error) => {
        console.log('Error on sending report', error)
      })
  }
}
