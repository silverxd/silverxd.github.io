import {AfterViewInit, Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminService} from "../admin.service";
import {Observable} from "rxjs";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {OverlayService} from "../../overlay.service";
import {TemplatePortal} from "@angular/cdk/portal";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
    selector: 'app-posts-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './posts-admin.component.html',
    styleUrl: './posts-admin.component.css'
})
export class PostsAdminComponent implements AfterViewInit {
    posts$: Observable<any[]>;
    @ViewChild('deleteTemplate', {static: true}) deleteTemplate!: TemplateRef<any>; // Reference to the cancel content template
    private deleteOverlayRef!: OverlayRef;

    openedpost: any;

    constructor(
        private overlay: Overlay,
        private adminService: AdminService,
        private viewContainerRef: ViewContainerRef,
        private db: AngularFirestore,
    ) {
        this.posts$ = this.adminService.getPosts();
        this.openedpost = []
    }

    ngAfterViewInit() {
        this.initializeDelete();
    }


    toggleDelete(post: any) {
        this.openedpost = post
        if (this.deleteOverlayRef.hasAttached()) {
            this.deleteOverlayRef.detach();
        } else {
            const portal = new TemplatePortal(this.deleteTemplate, this.viewContainerRef);
            this.deleteOverlayRef.attach(portal);
        }
    }

    private initializeDelete() {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        this.deleteOverlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: true,
            backdropClass: 'overlay-backdrop',
        });
    }

    delete(){
        this.toggleDelete('');
        this.db.collection('posts').doc(this.openedpost.document_id).delete()
    }
}
