import {Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayService} from '../overlay.service';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {SearchService} from "./search.service";
import {FriendRequestService} from "./friend-request.service";


@Component({
    selector: 'app-add-friends',
    templateUrl: './add-friends.component.html',
    styleUrl: './add-friends.component.css'
})
export class AddFriendsComponent implements AfterViewInit {
    @ViewChild('searchTemplate', {static: true}) searchTemplate!: TemplateRef<any>;
    @ViewChild('requestTemplate', {static: true}) requestTemplate!: TemplateRef<any>;
    private searchoverlayRef!: OverlayRef;
    private requestoverlayRef!: OverlayRef;

    topUsers: { pic: string; name: string; debux: string; }[] | undefined;
    people: { pic: string, name: string, debux: string }[] = []



    public searchIsOpen: boolean = false;
    public requestIsYes: boolean = false;
    public clickedPerson!: { pic: string, name: string, debux: string };


    searchResults: any[] | undefined;
    debounceTimer: any;
    searchTerm: string | undefined;

    constructor(
        private overlay: Overlay,
        private overlayService: OverlayService,
        private viewContainerRef: ViewContainerRef,
        private elementRef: ElementRef,
        private searchService: SearchService,
        private friendRequestService: FriendRequestService,
    ) {
    }

    ngAfterViewInit() {
        this.initializeSearch();
        this.initializeRequest();
        this.searchService.getTopUsersOnce()
            .then((data) => {
                this.topUsers = data;
                console.log(this.topUsers)
            })
            .catch((error) => {
                this.topUsers = [
                    {pic: "#C91CAD", name: "Sass", debux: "98k"},
                    {pic: "#41EF48", name: "Mattias", debux: "86k"},
                    {pic: "#EBB360", name: "Joonas", debux: "75k"},
                    {pic: "#5D675E", name: "Tormi", debux: "103k"}
                ]
                console.log('Error fetching users:', error)
            })
    }

    private initializeSearch() {
        const searchElement = this.elementRef.nativeElement.querySelector('.search');

        if (searchElement) {
            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(searchElement)
                .withPositions([
                    {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}
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

    openRequest(person: { pic: string, name: string, debux: string }) {
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

    isYes(person: any) {
        this.requestIsYes = true;
        this.friendRequestService.addFriend(person);
    }

    closeOverlay() {
        this.overlayService.closeOverlay();
    }


    onSearchInputChange(event: any) {
        this.searchTerm = event.target.value;
        if (this.searchTerm !== undefined && !this.searchoverlayRef.hasAttached()) {
            const portal = new TemplatePortal(this.searchTemplate, this.viewContainerRef);
            this.searchoverlayRef.attach(portal);
            this.searchIsOpen = true;
        } else if (this.people.length === 0) {
            this.requestoverlayRef.detach();
            this.requestIsYes = false;
        }

        // Clear the previous timer
        clearTimeout(this.debounceTimer);

        // Set a new timer to perform the search after 300 milliseconds
        this.debounceTimer = setTimeout(() => {
            this.searchService.searchUsers(this.searchTerm).subscribe((results: any[]) => {
                this.people = results;
            });
        }, 500);
    }

}
