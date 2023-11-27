import { Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../overlay.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';


@Component({
  selector: 'app-add-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-friends.component.html',
  styleUrl: './add-friends.component.css'
})
export class AddFriendsComponent {
  @ViewChild('searchTemplate', { static: true }) searchTemplate!: TemplateRef<any>;
  private searchoverlayRef!: OverlayRef;

  people: {pic: string, name: string, debux: string}[] = [
    {pic: "#C91CAD", name: "Sass", debux: "98k"},
    {pic: "#41EF48",name: "Mattias", debux: "86k"},
    {pic: "#EBB360",name: "Joonas", debux: "75k"},
    {pic: "#5D675E",name: "Tormi", debux: "103k"},
  ]
  public searchIsOpen: boolean = false;

  constructor(
    private overlay: Overlay,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    this.initializeSearch();
  }

  private initializeSearch() {
    const searchElement = this.elementRef.nativeElement.querySelector('.search');
    
    if (searchElement) {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(searchElement)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}
        ]);

      this.searchoverlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: true,
      });

      this.searchoverlayRef.backdropClick().subscribe(() => this.toggleSearch());
    }
  }

  toggleSearch() {
    if (this.searchoverlayRef.hasAttached()) {
      this.searchoverlayRef.detach();
      this.searchIsOpen = false;
    } else {
      const portal = new TemplatePortal(this.searchTemplate, this.viewContainerRef);
      this.searchoverlayRef.attach(portal);
      this.searchIsOpen = true;
    }
  }


  closeOverlay() {
    this.overlayService.closeOverlay();
  } 

}
