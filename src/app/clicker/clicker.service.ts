import {ChangeDetectorRef, Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {upgradesDefault} from "./upgrades-data";
import {BehaviorSubject, interval, map, Observable, of, Subscription, take} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ClickerService implements OnInit {
    debux: number
    loading = false;
    user: User | null
    upgrades: {
        name: string,
        cost: number,
        debuxPerSec?: number,
        debuxPerClick?: number,
        randomButton?: boolean,
        perClickX2?: boolean,
        filler?: boolean,
        perSecX2?: boolean,
        lowerMultipler?: boolean,
        canPrestige?: boolean,
        affordable: boolean,
        purchased: number | boolean,
        description: string
    }[]
    private purchasedUpgradesPerSec: { name: string, debuxPerSec: number }[] = [];
    private purchasedUpgradesPerClick: { name: string, debuxPerClick: number }[] = [];

    saveInterval:number;
    intervalSaveSubscription: Subscription | undefined;
    interval: Subscription | undefined;
    autosaveDate: Date;
    timeDifferenceInSeconds: number

    clickCount: number;
    maxClicks: number;

    costMultiplier: number;
    perSecMultiplier: number;
    perClickMultiplier: number;

    discountBought: boolean;

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

    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
        this.saveInterval = 60;
        this.user = null; // Before getting user the value is null
        this.debux = 0;
        this.upgrades = upgradesDefault; // Setting upgrades firstly as upgradesDefault
        this.autosaveDate = new Date();
        this.clickCount = 0;
        this.maxClicks = 2;
        this.timeDifferenceInSeconds = 0;

        this.costMultiplier = 0.3;
        this.perSecMultiplier = 1;
        this.perClickMultiplier = 1;

        this.discountBought = false
    }


    ngOnInit() {
        this.afAuth.authState.pipe(take(1)).subscribe((user) => {
            this.user = user;
            if (user) {
                this.startSaveInterval();
                this.startDebuxInterval();
                if (!this.firstCalcHasPerformed) {
                    this.getDebuxFromDatabase().pipe(take(1)).subscribe(value => {
                        this.debux = value | 0
                    });
                    this.getUpgradesFromDatabase().pipe(take(1)).subscribe(value => {
                        this.upgrades = value || upgradesDefault
                        this.firstCalc(this.upgrades);
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

    sendToDatabase() {
        if (this.user) {
            const dataToUpdate = {
                upgrades: this.upgrades,
                Debux: this.debux
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
        this.setDebux(this.debux, this.calculateTotalDebuxPerSec())
    }

    updateAffordability() {
        this.upgrades.forEach((upgrade) => {
            upgrade.affordable = upgrade.cost <= this.debux;
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
            // console.log(value.name, totalDebuxPerSec, totalDebuxPerClick)
            this.addUpgrade(value.name, totalDebuxPerSec, totalDebuxPerClick)
        }
    }

    buyUpgrade(upgrade: any): void {
        if (upgrade.affordable) {
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
            } else if (upgrade === this.upgrades[12] && this.upgrades[12].purchased != 0) {
                this.perClickMultiplier = this.perClickMultiplier * 2;
            } else if (upgrade === this.upgrades[15]) {
                this.costMultiplier = 0.25;
            } else if (upgrade === this.upgrades[13]) {
                this.discountBought = true;
                this.changePrices(0.5);
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
        filler?: boolean,
        perSecX2?: boolean,
        lowerMultipler?: boolean,
        canPrestige?: boolean,
        affordable: boolean,
        purchased: number | boolean,
        description: string
    }[], timeSend: number) {
        this.dataSubject.next({upgradesSend, timeSend})
    }

    changePrices(discount: number) {
        for (const dict in this.upgrades) {
            this.upgrades[dict].cost = this.upgrades[dict].cost * discount
        }
    }

    priceDefault() {
        for (const dict in this.upgrades) {
            this.upgrades[dict].cost = this.upgrades[dict].cost * 2
        } 
    }
}
