import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminService} from "../admin.service";
import {Observable} from "rxjs";
import {AppModule} from "../../app.module";

@Component({
    selector: 'app-posts-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './posts-admin.component.html',
    styleUrl: './posts-admin.component.css'
})
export class PostsAdminComponent {
    posts$: Observable<any[]>;

    constructor(private adminService: AdminService) {
        this.posts$ = this.adminService.getPosts();
    }
}
