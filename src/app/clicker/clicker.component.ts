import {Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {ClickerService} from "./clicker.service";
import {upgradesDefault} from "./upgrades-data";
import {Subscription} from "rxjs";
import { DOCUMENT } from '@angular/common';

import {
    firstLine,
    secondLine,
    thirdLine,
    fourthLine,
    fifthLine,
    sixthLine,
    seventhLine,
    eighthLine,
    ninthLine,
    tenthLine
} from './debug-data';

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
    snippet: string;
    firstLine: string[];
    secondLine: string[];
    thirdLine: string[];
    fourthLine: string[];
    fifthLine: string[];
    sixthLine: string[];
    seventhLine: string[];
    eighthLine: string[];
    ninthLine: string[];
    tenthLine: string[];

    dataSubscription: Subscription | undefined;


    constructor(public service: ClickerService, private cdr: ChangeDetectorRef, document: Document) {
        this.debux = 0;
        this.upgrades = upgradesDefault;
        this.time = 0;
        this.snippet = ""

        this.firstLine = firstLine;
        this.secondLine = secondLine;
        this.thirdLine = thirdLine;
        this.fourthLine = fourthLine;
        this.fifthLine = fifthLine;
        this.sixthLine = sixthLine;
        this.seventhLine = seventhLine;
        this.eighthLine = eighthLine;
        this.ninthLine = ninthLine;
        this.tenthLine = tenthLine;

    }

    ngOnInit() {
        this.subscribeToData()
        this.generateSnippet()
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

    randomChoice(arr: any[]){
        return arr[Math.floor(Math.random() * arr.length)]
    }

    generateSnippet() {
        this.snippet = 
            this.randomChoice(this.firstLine) + "\n" +
            this.randomChoice(this.secondLine) + "\n" +
            this.randomChoice(this.thirdLine) + "\n" +
            this.randomChoice(this.fourthLine) + "\n" +
            this.randomChoice(this.fifthLine) + "\n" +
            this.randomChoice(this.sixthLine) + "\n" +
            this.randomChoice(this.seventhLine) + "\n" +
            this.randomChoice(this.eighthLine) + "\n" +
            this.randomChoice(this.ninthLine)  + "\n" +
            this.randomChoice(this.tenthLine)
        
    }
}
