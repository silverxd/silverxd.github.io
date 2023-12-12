import {AfterViewInit, ChangeDetectorRef, Component, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {AuthService} from "../auth.service";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {AdminService} from "../admin/admin.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {TemplatePortal} from "@angular/cdk/portal";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {take} from "rxjs";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
    @ViewChild('addTemplate', {static: true}) addTemplate!: TemplateRef<any>;
    private addOverlayRef!: OverlayRef;

    pictureToSend: string | null = null;
    imageForm: FormGroup;
    fileSizeExceedsLimit: boolean = false;
    textToSend: string = ''
    user: any;
    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private db: AngularFirestore,
        private cd: ChangeDetectorRef,
        private headerComponent: HeaderComponent,
        private authService: AuthService,
        private fb: FormBuilder,
        private storage: AngularFireStorage,
        private auth: AuthService) {
        this.imageForm = this.fb.group({
            image: ['']
        });
        this.headerComponent.visible = true;
        this.pictureToSend = '';
        this.auth.user$.subscribe(value => {
            this.user = value?.uid;
        })
    }

    logout() {
        this.authService.logout()
    }

    ngAfterViewInit() {
        this.initializeAdd();
    }

    toggleAdd() {
        if (this.addOverlayRef.hasAttached()) {
            this.addOverlayRef.detach();
        } else {
            const portal = new TemplatePortal(this.addTemplate, this.viewContainerRef);
            this.addOverlayRef.attach(portal);
        }
    }

    private initializeAdd() {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        this.addOverlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: true,
            backdropClass: 'overlay-backdrop'
        });
    }


    onFileSelected(event: any): void {
        const file = event.target.files[0];

        if (file) {
            // Check if the selected file size exceeds the limit (5 MB in this example)
            this.fileSizeExceedsLimit = file.size > 7 * 1024 * 1024;

            if (!this.fileSizeExceedsLimit) {
                // Display selected image preview
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.pictureToSend = e.target.result;
                };
                reader.readAsDataURL(file);

                // Set the selected file in the reactive form
                this.imageForm.get('image')?.setValue(file);
            } else {
                // Clear the selected file and show an error message if needed
                this.imageForm.get('image')?.setValue(null);
                // You may display an error message to the user
            }
        }
        console.log(this.textToSend)
    }

    async sendPost(): Promise<void> {
        // Your existing logic for sending text post...

        // Upload the selected image to Firebase Storage
        const imageFile = this.imageForm.get('image')?.value;

        if (imageFile) {
            const filePath = `images/${new Date().getTime()}_${imageFile.name}`;
            const storageRef = this.storage.ref(filePath);
            const uploadTask = this.storage.upload(filePath, imageFile);

            // Get the download URL when the upload is complete
            uploadTask.then(() => {
                storageRef.getDownloadURL().pipe(take(1)).subscribe(url => {
                    // Now 'url' contains the download URL of the uploaded image
                    const data = {
                        author_uid: this.user,
                        image_url: url,
                        text: this.textToSend,
                        timestamp: new Date()
                    }
                    this.db.collection('posts').add(data)
                    console.log('Image URL:', url);
                    this.toggleAdd()
                });
            });
        }
    }
}
