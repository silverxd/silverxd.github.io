import {Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {ClickerService} from "./clicker.service";
import {upgradesDefault} from "./upgrades-data";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-clicker',
    templateUrl: './clicker.component.html',
    styleUrls: ['./clicker.component.css'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ClickerComponent implements OnInit {
    debux: number;
    upgrades: any;
    time: number;
    snippet: any;

    dataSubscription: Subscription | undefined;


    constructor(public service: ClickerService, private cdr: ChangeDetectorRef) {
        this.debux = 0;
        this.upgrades = upgradesDefault;
        this.time = 0;
    }

    ngOnInit() {
        this.subscribeToData()
        this.service.generateSnippet()
    }

    subscribeToData() {
        if (!this.dataSubscription) {
            this.dataSubscription = this.service.data$.subscribe(({upgradesSend, timeSend}) => {
                this.upgrades = upgradesSend;
                this.time = timeSend;
                this.cdr.detectChanges();

            });
        }
    }
}
