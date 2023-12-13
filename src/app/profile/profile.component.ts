import { Component, ViewChild, TemplateRef, ViewContainerRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { OverlayService } from '../overlay.service';
import { AddFriendsComponent } from '../add-friends/add-friends.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import firebase from 'firebase/compat/app';
import User = firebase.User;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfileComponent {
  @ViewChild('changeTemplate', { static: true }) changeTemplate!: TemplateRef<any>;
  @ViewChild('confirmTemplate', { static: true }) confirmTemplate!: TemplateRef<any>;
  @ViewChild('savedTemplate', { static: true }) savedTemplate!: TemplateRef<any>;
  @ViewChild('wrongTemplate', { static: true }) wrongTemplate!: TemplateRef<any>;
  @ViewChild('weakTemplate', { static: true }) weakTemplate!: TemplateRef<any>;
  private changeOverlayRef!: OverlayRef;
  private confirmOverlayRef!: OverlayRef;
  private savedOverlayRef!: OverlayRef;
  private wrongOverlayRef!: OverlayRef;
  private weakOverlayRef!: OverlayRef;
  settingsOpen: boolean;
  user: User | null;
  authState$: Observable<User | null>;
  type: string;
  currentPassword: string;
  newDisplayName: string;
  newEmail: string;
  newPassword: string;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private overlayService: OverlayService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    ) {
      this.settingsOpen = false
      this.user = null;
      this.type = ""
      this.authState$ = this.afAuth.authState;
      this.authState$.subscribe((user) => {
        this.user = user;
        this.cdr.detectChanges();
      })
      this.currentPassword = "";
      this.newDisplayName = "";
      this.newEmail = "";
      this.newPassword = "";
    }

  dynamicStyles(text: string | undefined | null): any {
    if (!text) {
      return {
        'font-size': '1.6vw',
      };
    }
    const textLength = text.length;
    if (textLength > 14) {
      const fontSize = 1.6 - (textLength / 40);
  
      return {
        'font-size': `${fontSize}vw`,
        'white-space': 'nowrap',
        'overflow': 'hidden'
      };
    }
  }

  updateDisplayName() {
    if (this.user) {
      this.user.updateProfile({displayName: this.newDisplayName,})
        .then(() => {
          this.db.collection('User').doc(this.user?.uid).set({displayName: this.newDisplayName}, {merge: true});
          this.cdr.detectChanges();
          this.toggleChange('');
          this.toggleSaved()
        })
        .catch((error) => {
          console.error('Error updating display name', error);
        });
    }
  }

  updateEmail() {
    if (this.user) {
      // Reauthenticate the user
      const credentials = firebase.auth.EmailAuthProvider.credential(
        this.user.email || '', // Use the user's current email
        this.currentPassword
      );

      this.user.reauthenticateWithCredential(credentials)
        .then(() => {
          // User has been reauthenticated, now update the email
          return this.user?.updateEmail(this.newEmail);
        })
        .then(() => {
          // Email updated successfully
          this.cdr.detectChanges();
          this.toggleChange('');
          this.toggleSaved();
        })
        .catch((error) => {
          console.error('Error updating email', error);
        });
    }
  }

  updatePassword() {
    if (this.user) {
      const credentials = firebase.auth.EmailAuthProvider.credential(
        this.user.email || '', // Use the user's email
        this.currentPassword
      );
      if (this.checkPassword()) {
        // Reauthenticate the user
        this.user.reauthenticateWithCredential(credentials)
          .then(() => {
            // User has been reauthenticated, now update the password
            return this.user?.updatePassword(this.newPassword);
          })
          .then(() => {
            // Password updated successfully
            this.cdr.detectChanges();
            this.toggleChange('');
            this.toggleSaved();
          })
          .catch((error) => {
            console.error('Error updating password', error);
          });
      } else {
        this.toggleWeak();
      }
    }
  }

  checkPassword() {
    const requirementsNotMet = [];

    if (this.newPassword.length < 8) {
      requirementsNotMet.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(this.newPassword)) {
      requirementsNotMet.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(this.newPassword)) {
      requirementsNotMet.push('at least one lowercase letter');
    }
    if (!/[!@#$%^&*]/.test(this.newPassword)) {
      requirementsNotMet.push('at least one special character (!@#$%^&*).');
    }
    if (requirementsNotMet.length === 0) {
      // Password meets the requirements, proceed with registration
      return true
    } else {
      // Password does not meet the requirements, display an alert with error message
      return false
    }
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
    this.initializeSaved();
    this.initializeWrong();
    this.initializeWeak();
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

  private initializeSaved() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  
        this.savedOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
        this.savedOverlayRef.backdropClick().subscribe(() => this.toggleSaved());
  }

  private initializeWrong() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  
        this.wrongOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
        this.wrongOverlayRef.backdropClick().subscribe(() => this.toggleWrong());
  }

  private initializeWeak() {
    const positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  
        this.weakOverlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: true,
          backdropClass: 'overlay-backdrop',
        });
        this.weakOverlayRef.backdropClick().subscribe(() => this.toggleWeak());
  }


  resetInputFields() {
    this.currentPassword = "";
    this.newDisplayName = "";
    this.newEmail = "";
    this.newPassword = "";
    this.cdr.detectChanges();
  }

  toggleChange(type: string) {
    if (type === 'password' || type === 'email') {
      this.afAuth.signInWithEmailAndPassword(this.user?.email || '', this.currentPassword).then(() => {
        const portal = new TemplatePortal(this.changeTemplate, this.viewContainerRef);
        this.changeOverlayRef.attach(portal);
        this.type = type
        this.toggleConfirm('')
      }).catch((error) => {
        this.toggleWrong()
      });
    } else if (this.changeOverlayRef.hasAttached()) {
      this.changeOverlayRef.detach();
      this.resetInputFields();
    } else {
      const portal = new TemplatePortal(this.changeTemplate, this.viewContainerRef);
      this.changeOverlayRef.attach(portal);
      this.type = type
    }
  }

  toggleConfirm(type: string) {
    if (type === 'c'){
      this.resetInputFields();
    }
    if (this.confirmOverlayRef.hasAttached()) {
      this.confirmOverlayRef.detach();
      
    } else {
      const portal = new TemplatePortal(this.confirmTemplate, this.viewContainerRef);
      this.confirmOverlayRef.attach(portal);
      this.type = type
    }
  }

  toggleSaved() {
    if (this.savedOverlayRef.hasAttached()) {
      this.savedOverlayRef.detach();
      this.resetInputFields();
    } else {
      const portal = new TemplatePortal(this.savedTemplate, this.viewContainerRef);
      this.savedOverlayRef.attach(portal);
    }
  }

  toggleWrong() {
    if (this.wrongOverlayRef.hasAttached()) {
      this.wrongOverlayRef.detach();
      this.resetInputFields();
    } else {
      const portal = new TemplatePortal(this.wrongTemplate, this.viewContainerRef);
      this.wrongOverlayRef.attach(portal);
    }
  }

  toggleWeak() {
    if (this.weakOverlayRef.hasAttached()) {
      this.weakOverlayRef.detach();
      this.newPassword = "";
      this.cdr.detectChanges();
    } else {
      const portal = new TemplatePortal(this.weakTemplate, this.viewContainerRef);
      this.weakOverlayRef.attach(portal);
    }
  }
}
