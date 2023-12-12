import { Component, ElementRef, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";
import { OverlayService } from '../overlay.service';
import { AddFriendsComponent } from '../add-friends/add-friends.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import firebase from "firebase/compat";
import User = firebase.User;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild('changeTemplate', { static: true }) changeTemplate!: TemplateRef<any>;
  @ViewChild('confirmTemplate', { static: true }) confirmTemplate!: TemplateRef<any>;
  private changeOverlayRef!: OverlayRef;
  private confirmOverlayRef!: OverlayRef;
  settingsOpen: boolean;
  user: User | null;
  authState$: Observable<User | null>;
  type: string;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private overlayService: OverlayService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    ) {
      this.settingsOpen = false
      this.user = null;
      this.type = ""
      this.authState$ = this.afAuth.authState;
      this.authState$.subscribe((user) => {
        this.user = user;
      })
    }

  openAddFriends() {
    this.overlayService.openOverlay(AddFriendsComponent)
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen
  }

  ngAfterViewInit() {
    this.initializeChange();
    this.initializeConfirm();
  }

  private initializeChange() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  
        this.changeOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
  }

  private initializeConfirm() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  
        this.confirmOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
  }

  toggleChange(type: string) {
    if (type === 'password') {
      this.toggleConfirm()
    }
    if (this.changeOverlayRef.hasAttached()) {
      this.changeOverlayRef.detach();
    } else {
      const portal = new TemplatePortal(this.changeTemplate, this.viewContainerRef);
      this.changeOverlayRef.attach(portal);
      this.type = type
    }
  }

  toggleConfirm() {
    if (this.confirmOverlayRef.hasAttached()) {
      this.confirmOverlayRef.detach();
    } else {
      const portal = new TemplatePortal(this.confirmTemplate, this.viewContainerRef);
      this.confirmOverlayRef.attach(portal);
    }
  }
}
