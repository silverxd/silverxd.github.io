import {ChangeDetectorRef, Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {upgradesDefault} from "./upgrades-data";
import {BehaviorSubject, interval, map, Observable, of, Subscription, take} from "rxjs";
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

@Injectable({
    providedIn: 'root',
})
export class ClickerService implements OnInit {
    debux: number;
    prestige: number;
    loading = false;
    user: User | null;
    upgrades: {
        name: string,
        cost: number,
        debuxPerSec?: number,
        debuxPerClick?: number,
        randomButton?: boolean,
        perClickX2?: boolean,
        minusFifty?: boolean,
        perSecX2?: boolean,
        lowerMultipler?: boolean,
        canPrestige?: boolean,
        affordable: boolean,
        onetime?: boolean,
        purchased: number,
        description: string
    }[]
    private purchasedUpgradesPerSec: { name: string, debuxPerSec: number }[] = [];
    private purchasedUpgradesPerClick: { name: string, debuxPerClick: number }[] = [];

    saveInterval:number;
    intervalSaveSubscription: Subscription | undefined;
    interval: Subscription | undefined;
    autosaveDate: Date;
    timeDifferenceInSeconds: number

    getDebuxSubscription: Subscription | undefined;
    getUpgradesSubscription: Subscription | undefined;
    getPrestigeSubscription: Subscription | undefined;

    clickCount: number;
    maxClicks: number;

    costMultiplier: number;
    perSecMultiplier: number;
    perClickMultiplier: number;
    discountBought: boolean;

    sidePannelOpen: boolean;
    randomDBsOpen: boolean;
    prestigeOpen: boolean;
    counter: number;

    firstCalcHasPerformed: boolean = false;

    debuxSubject = new BehaviorSubject<{ debuxSend: number; debuxPerSecSend: any }>({
        debuxSend: 0,
        debuxPerSecSend: 0
    });
    debux$ = this.debuxSubject.asObservable();

    dataSubject = new BehaviorSubject<{ upgradesSend: any; timeSend: number }>({
        upgradesSend: null,
        timeSend: 0
    });
    data$ = this.dataSubject.asObservable();

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

    linesList: any;
    snippet: string;
    line: any;


    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
        this.saveInterval = 60;
        this.counter = 61;
        this.user = null; // Before getting user the value is null
        this.debux = 0;
        this.prestige = 0;
        this.upgrades = upgradesDefault; // Setting upgrades firstly as upgradesDefault
        this.autosaveDate = new Date();
        this.clickCount = 0;
        this.maxClicks = 2;
        this.timeDifferenceInSeconds = 0;

        this.costMultiplier = 0.3;
        this.perSecMultiplier = 1;
        this.perClickMultiplier = 1;
        this.discountBought = false;

        this.sidePannelOpen = false;
        this.randomDBsOpen = false;
        this.prestigeOpen = false;

        this.firstLine = this.randomChoice(firstLine);
        this.secondLine = this.randomChoice(secondLine);
        this.thirdLine = this.randomChoice(thirdLine);
        this.fourthLine = this.randomChoice(fourthLine);
        this.fifthLine = this.randomChoice(fifthLine);
        this.sixthLine = this.randomChoice(sixthLine);
        this.seventhLine = this.randomChoice(seventhLine);
        this.eighthLine = this.randomChoice(eighthLine);
        this.ninthLine = this.randomChoice(ninthLine);
        this.tenthLine = this.randomChoice(tenthLine);

        this.snippet = "";
    }


    ngOnInit() {
        this.afAuth.authState.pipe(take(1)).subscribe((user) => {
            this.user = user;
            if (user) {
                this.startSaveInterval();
                this.startDebuxInterval();
                if (!this.firstCalcHasPerformed) {
                    this.getDebuxSubscription = this.getDebuxFromDatabase().pipe(take(1)).subscribe(value => {
                        this.debux = value | 0
                    });
                    this.getUpgradesSubscription = this.getUpgradesFromDatabase().pipe(take(1)).subscribe(value => {
                        this.upgrades = value || upgradesDefault
                        this.firstCalc(this.upgrades);
                    });
                    this.getPrestigeSubscription = this.getPrestigeFromDatabase().pipe(take(1)).subscribe(value => {
                        this.prestige = value | 0
                    });
                }
            }
        })
    }

    getDebuxFromDatabase(): Observable<number> {
        if (this.user) {
            return this.db.doc(`User/${this.user.uid}`).valueChanges().pipe(
                map((userData: any) => userData ? userData.Debux : undefined)
            );
        } else {
            console.warn('User not authenticated.'); // Use warn for non-critical issues
            return of(0); // Return an observable that completes immediately with undefined
        }
    }

    getUpgradesFromDatabase(): Observable<any | undefined> {
        if (this.user) {
            return this.db.doc(`User/${this.user.uid}`).valueChanges().pipe(
                map((userData: any) => userData ? userData.upgrades : undefined)
            );
        } else {
            console.warn('User not authenticated.');
            return of(undefined);
        }
    }

    getPrestigeFromDatabase(): Observable<number> {
        if (this.user) {
            return this.db.doc(`User/${this.user.uid}`).valueChanges().pipe(
                map((userData: any) => userData ? userData.Prestige : undefined)
            );
        } else {
            console.warn('User not authenticated.'); // Use warn for non-critical issues
            return of(0); // Return an observable that completes immediately with undefined
        }
    }

    sendToDatabase() {
        if (this.user) {
            const dataToUpdate = {
                upgrades: this.upgrades,
                Debux: this.debux,
                Prestige: this.prestige
            };
            this.db.collection('User').doc(this.user?.uid).set(dataToUpdate, {merge: true})
        }
    }


    startSaveInterval() {
        if (!this.intervalSaveSubscription) {
            this.intervalSaveSubscription = interval(this.saveInterval * 1000).subscribe(() => {
                this.autosave();
            })
        }
    }

    stopSaveInterval() {
        if (this.intervalSaveSubscription) {
            this.intervalSaveSubscription.unsubscribe();
            this.intervalSaveSubscription = undefined;
        }
    }

    autosave() {
        if (this.discountBought) {
            this.discountBought = false;
            this.priceDefault();
        }
        this.autosaveDate = new Date();
        this.sendToDatabase();
    }

    manualAutosave() {
        if (this.clickCount < this.maxClicks) {
            this.autosave()
            this.clickCount++;
        }
    }

    startDebuxInterval() {
        if (!this.interval) {
            this.interval = interval(1000).subscribe(() => {
                this.debux = this.debux + this.calculateTotalDebuxPerSec();
                this.updateAffordability();
                this.lastSaveTime();
                this.setDebux(this.debux, this.calculateTotalDebuxPerSec())
                this.setTimeAndUpgrades(this.upgrades, this.timeDifferenceInSeconds)
            });
        }
    }

    lastSaveTime() {
        const currentTime = new Date();
        const timeDifferenceInMillis = currentTime.getTime() - this.autosaveDate.getTime();
        this.timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / (1000 * 1));
        if (this.timeDifferenceInSeconds === 30) {
            this.clickCount = 0;
        }
    }


    clickDebux() {
        this.debux += this.calculateTotalDebuxPerClick() * this.perClickMultiplier;
        console.log(this.debux)
        this.updateAffordability();
        this.setDebux(this.debux, this.calculateTotalDebuxPerSec());
        this.changeOneLine();
        this.generateSnippet();
    }

    updateAffordability() {
        this.upgrades.forEach((upgrade) => {
            if (!upgrade.onetime || upgrade.purchased != 1) {
                upgrade.affordable = upgrade.cost <= this.debux;
            }
        });
    }

    firstCalc(upgrades: any) {
        this.firstCalcHasPerformed = true;
        let totalDebuxPerClick = 0;
        let totalDebuxPerSec = 0;
        for (const key in upgrades) {
            const value = upgrades[key]
            if (value.debuxPerSec != null) {
                totalDebuxPerSec = value.debuxPerSec * value.purchased;
            }
            if (value.debuxPerClick != null) {
                totalDebuxPerClick = value.debuxPerClick * value.purchased
            }
            if ((value.name === 'Automated Testing' || value.name === 'Progarm that solves every bug') && value.purchased === 1) {
                this.sidePannelOpen = true;
                if (value.name === 'Automated Testing') {
                    this.randomDBsOpen = true;
                } else {
                    this.prestigeOpen = true;
                }
            }
            // console.log(value.name, totalDebuxPerSec, totalDebuxPerClick)
            this.addUpgrade(value.name, totalDebuxPerSec, totalDebuxPerClick)
        }
    }

    buyUpgrade(upgrade: any): void {
        if (upgrade.onetime && upgrade.purchased === 1) {

        } else if (upgrade.affordable) {
            this.debux -= upgrade.cost; // Deduct the cost from user's DeBux
            if (this.discountBought) {
                this.discountBought = false;
                this.priceDefault()
            }
            upgrade.cost += Math.round(upgrade.cost * this.costMultiplier); // Increase upgrades cost
            upgrade.purchased += 1; // Increase purchased amount
            this.addUpgrade(upgrade.name, upgrade.debuxPerSec, upgrade.debuxPerClick); // Call the buyUpgrade method in ClickerService
            if ((this.debux - upgrade.cost) < upgrade.cost) {
                upgrade.affordable = false; // Disable the button after purchase
            }
            if (upgrade === this.upgrades[14] && this.upgrades[14].purchased != 0) {
                this.perSecMultiplier = this.perSecMultiplier * 2;
            } else if (upgrade === this.upgrades[11] && this.upgrades[11].purchased != 0) {
                this.sidePannelOpen = true;
                this.randomDBsOpen = true;
            } else if (upgrade === this.upgrades[12] && this.upgrades[12].purchased != 0) {
                this.perClickMultiplier = this.perClickMultiplier * 2;
            } else if (upgrade === this.upgrades[13]) {
                this.discountBought = true;
                this.changePrices(0.5);
            } else if (upgrade === this.upgrades[15]) {
                this.costMultiplier = 0.25;
            } else if (upgrade === this.upgrades[16] && this.upgrades[16].purchased != 0) {
                this.sidePannelOpen = true;
                this.prestigeOpen = true;
            }
            if (upgrade.onetime) {
                upgrade.affordable = true
            }
        } else {
            console.log('Not enough DeBux for this upgrade.');
        }
        // this.service.setDebux(this.debux, this.service.calculateTotalDebuxPerSec());
        this.updateAffordability(); // Update affordability so upgrades can open up
        this.setDebux(this.debux, this.calculateTotalDebuxPerSec())
    }

    addUpgrade(upgradeName: string, debuxPerSec: number, debuxPerClick: number): void {
        if (typeof debuxPerSec !== 'undefined' && debuxPerSec !== 0) {
            console.log('DebuxPerSec purchased')
            this.purchasedUpgradesPerSec.push({name: upgradeName, debuxPerSec});
        } else if (typeof debuxPerClick !== 'undefined' && debuxPerClick !== 0) {
            console.log('DebuxPerClick purchased')
            this.purchasedUpgradesPerClick.push({name: upgradeName, debuxPerClick});
        }
    }

    calculateTotalDebuxPerClick() {
        return this.purchasedUpgradesPerClick.reduce((total, upgrade) =>
            total + upgrade.debuxPerClick, 1
        );
    }

    calculateTotalDebuxPerSec(): number {
        return this.purchasedUpgradesPerSec.reduce((total, upgrade) =>
        total + (upgrade.debuxPerSec * this.perSecMultiplier), 0
        );
    }

    setDebux(debuxSend: number, debuxPerSecSend: number) {
        this.debuxSubject.next({debuxSend, debuxPerSecSend});
    }

    setTimeAndUpgrades(upgradesSend: {
        name: string,
        cost: number,
        debuxPerSec?: number,
        debuxPerClick?: number,
        randomButton?: boolean,
        perClickX2?: boolean,
        minusFifty?: boolean,
        perSecX2?: boolean,
        lowerMultipler?: boolean,
        canPrestige?: boolean,
        affordable: boolean,
        onetime?: boolean,
        purchased: number,
        description: string
    }[], timeSend: number) {
        this.dataSubject.next({upgradesSend, timeSend})
    }

    changePrices(discount: number) {
        for (const dict in this.upgrades) {
            this.upgrades[dict].cost = Math.round(this.upgrades[dict].cost * discount)
        }
    }

    priceDefault() {
        for (const dict in this.upgrades) {
            this.upgrades[dict].cost = this.upgrades[dict].cost * 2
        }
    }

    randomChoice(arr: any[]){
        return arr[Math.floor(Math.random() * arr.length)]
    }

    generateSnippet() {
        this.snippet =
            this.firstLine + "\n" +
            this.secondLine + "\n" +
            this.thirdLine + "\n" +
            this.fourthLine + "\n" +
            this.fifthLine + "\n" +
            this.sixthLine + "\n" +
            this.seventhLine + "\n" +
            this.eighthLine + "\n" +
            this.ninthLine  + "\n" +
            this.tenthLine
    }

    changeOneLine() {
        this.linesList = [
            this.firstLine,
            this.secondLine,
            this.thirdLine,
            this.fourthLine,
            this.fifthLine,
            this.sixthLine,
            this.seventhLine,
            this.eighthLine,
            this.ninthLine,
            this.tenthLine
        ]
        this.line = this.randomChoice(this.linesList);
        if (this.line === this.firstLine) {
            this.firstLine = this.randomChoice(firstLine)
        } else if (this.line === this.secondLine) {
            this.secondLine = this.randomChoice(secondLine)
        } else if (this.line === this.thirdLine) {
            this.thirdLine = this.randomChoice(thirdLine)
        } else if (this.line === this.fourthLine) {
            this.fourthLine = this.randomChoice(fourthLine)
        } else if (this.line === this.fifthLine) {
            this.fifthLine = this.randomChoice(fifthLine)
        } else if (this.line === this.sixthLine) {
            this.sixthLine = this.randomChoice(sixthLine)
        } else if (this.line === this.seventhLine) {
            this.seventhLine = this.randomChoice(seventhLine)
        } else if (this.line === this.eighthLine) {
            this.eighthLine = this.randomChoice(eighthLine)
        } else if (this.line === this.ninthLine) {
            this.ninthLine = this.randomChoice(ninthLine)
        } else if (this.line === this.tenthLine) {
            this.tenthLine = this.randomChoice(tenthLine)
        }
    }

    randomDBs() {
        if (this.counter === 61) {
            this.counter = this.counter - 1;

            this.debux += Math.floor(Math.random() * (10000 - 1 + 1) + 1);
            this.setDebux(this.debux, this.calculateTotalDebuxPerSec());
            this.updateAffordability();

            let intervalId = setInterval(() => {
                this.counter = this.counter - 1;
                console.log(this.counter)
                if(this.counter === 0) {
                    clearInterval(intervalId)
                    this.counter = 61;
                }
            }, 1000)
        }
    }

    clickPrestige() {
        this.getDebuxSubscription?.unsubscribe()
        this.getUpgradesSubscription?.unsubscribe()
        this.getPrestigeSubscription?.unsubscribe()
        this.prestige += 1;
        this.purchasedUpgradesPerSec = [];
        this.purchasedUpgradesPerClick = [];
        this.sidePannelOpen = false;
        this.prestigeOpen = false;
        this.randomDBsOpen = false;
        this.upgrades = upgradesDefault;
        this.debux = 0;
        this.autosave();
    }

}
