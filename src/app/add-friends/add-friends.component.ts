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
export class AddFriendsComponent implements AfterViewInit {
  @ViewChild('searchTemplate', { static: true }) searchTemplate!: TemplateRef<any>;
  @ViewChild('requestTemplate', { static: true }) requestTemplate!: TemplateRef<any>;
  private searchoverlayRef!: OverlayRef;
  private requestoverlayRef!: OverlayRef;

  people: {pic: string, name: string, debux: string}[] = [
    {pic: "#C91CAD", name: "Sass", debux: "98k"},
    {pic: "#41EF48",name: "Mattias", debux: "86k"},
    {pic: "#EBB360",name: "Joonas", debux: "75k"},
    {pic: "#5D675E",name: "Tormi", debux: "103k"},
  ]
  public searchIsOpen: boolean = false;
  public requestIsYes: boolean = false;
  public clickedPerson!: {pic: string, name: string, debux: string};

  constructor(
    private overlay: Overlay,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    this.initializeSearch();
    this.initializeRequest();
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
        backdropClass: 'transparent-backdrop'
      });

      this.searchoverlayRef.backdropClick().subscribe(() => this.toggleSearch());
    }
  }

  private initializeRequest() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  
        this.requestoverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
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

  openRequest(person: {pic: string, name: string, debux: string}) {
    this.clickedPerson = person
    this.toggleRequest()
  }

  toggleRequest() {
    if (this.requestoverlayRef.hasAttached()) {
      this.requestoverlayRef.detach();
      this.requestIsYes = false;
    } else {
      const portal = new TemplatePortal(this.requestTemplate, this.viewContainerRef);
      this.requestoverlayRef.attach(portal);
    }
  }

  isYes() {
    this.requestIsYes = true;
  }

  closeOverlay() {
    this.overlayService.closeOverlay();
  } 

}
