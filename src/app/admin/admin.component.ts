import {Component} from '@angular/core';


@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent {
    currentComponent: string = 'posts';
    constructor() {
    }

    showComponent(component: string): void {
        this.currentComponent = component;
    }
}

