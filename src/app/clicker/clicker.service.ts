import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {BehaviorSubject, from, map, Observable, of, switchMap, throttleTime, timer} from "rxjs";
import {ClickerComponent} from "./clicker.component";

@Injectable({
  providedIn: 'root',
})
export class ClickerService {
  user: User | null;
  authState$: Observable<User | null>;
  upgradesUpdated: any;
  autosaveDate = new Date()
  upgradesDefault: {
    name: string,
    cost: number,
    debuxPerSec?: number,
    debuxPerClick?: number,
    affordable: boolean,
    purchased: number,
    description: string
  }[] = [
    {
      name: 'Multithreading', cost: 10, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Increase processing power by utilizing multiple threads.'
    },
    {
      name: 'Optimization Algorithms', cost: 100, debuxPerSec: 10, affordable: false, purchased: 0,
      description: 'Enhance efficiency through advanced code optimization techniques.'
    },
    {
      name: 'Parallel Processing', cost: 1000, debuxPerSec: 100, affordable: false, purchased: 0,
      description: 'Enable simultaneous execution for faster processing.'
    },
    {
      name: 'Overclocking', cost: 10000, debuxPerSec: 1000, affordable: false, purchased: 0,
      description: 'Push the CPU to run faster, boosting processing power.'
    },
    {
      name: 'Hardware Upgrades', cost: 100000, debuxPerSec: 10000, affordable: false, purchased: 0,
      description: 'Install better processors or RAM to increase overall performance.'
    },
    {
      name: 'Cooling Systems', cost: 1000000, debuxPerSec: 100000, affordable: false, purchased: 0,
      description: 'Optimize cooling mechanisms to sustain higher processing speeds.'
    },
    {
      name: 'Syntax Highlighting', cost: 1, debuxPerClick: 1, affordable: false, purchased: 0,
      description: 'Boost click effectiveness with highlighted code segments.'
    },
    {
      name: 'Code Formatting', cost: 10, debuxPerClick: 10, affordable: false, purchased: 0,
      description: 'Improve the appearance of code to enhance click impact.'
    },
    {
      name: 'Auto-Completion', cost: 100, debuxPerClick: 100, affordable: false, purchased: 0,
      description: 'Increase code suggestion accuracy to amplify your clicks.'
    },
    {
      name: 'GUI Enhancements', cost: 1000, debuxPerClick: 1000, affordable: false, purchased: 0,
      description: 'Upgrade the interface for a more responsive and impactful clicking experience.'
    },
    {
      name: 'Mouse Acceleration', cost: 10000, debuxPerClick: 10000, affordable: false, purchased: 0,
      description: 'Improve click effectiveness by enhancing mouse sensitivity.'
    },
    {
      name: 'ChatGPT Evolution', cost: 1000, affordable: false, purchased: 0,
      description: 'Upgrade ChatGPT to a more advanced version, increasing its problem-solving capabilities and assistance in debugging.'
    },
    {
      name: 'Automated Testing', cost: 10000, affordable: false, purchased: 0,
      description: 'Develop a robust automated testing system that quickly identifies and reports bugs, making debugging more efficient.'
    },
    {
      name: 'Code Refactoring AI', cost: 100000, affordable: false, purchased: 0,
      description: 'Integrate AI-driven code refactoring to automatically improve code structure and readability during the debugging process.'
    },
    {
      name: 'Codebase Analysis', cost: 1000000, affordable: false, purchased: 0,
      description: 'Unlock in-depth analysis tools that provide insights into code quality, performance, and potential issues, aiding in targeted debugging efforts.'
    },
    {
      name: 'Tabnine', cost: 10000000, affordable: false, purchased: 0,
      description: 'Upgrade Tabnine\'s capabilities, allowing it to suggest code snippets and completions at an accelerated rate, improving coding speed and accuracy.'
    },
  ];
  private debuxValue: number = 0;
  private readonly saveInterval = 60; // Autosave every 60 seconds
  private purchasedUpgradesPerSec: { name: string, debuxPerSec: number }[] = [];
  private purchasedUpgradesPerClick: { name: string, debuxPerClick: number }[] = [];

  private debuxSubject = new BehaviorSubject<{ debuxsend: number; anotherValue: any }>({
    debuxsend: 0,
    anotherValue: null
  });
  debux$ = this.debuxSubject.asObservable()

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user = null;
    this.authState$ = this.afAuth.authState;
    this.authState$.subscribe((user) => {
      this.user = user;
      // Start the autosave timer when the user is authenticated
      if (user) {
        this.startAutosave();
      }
    });
  }

  buyUpgrade(upgradeName: string, debuxPerSec: number, debuxPerClick: number): void {
    if (typeof debuxPerSec !== 'undefined' && debuxPerSec !== 0) {
      console.log('DebuxPerSec purchased')
      this.purchasedUpgradesPerSec.push({name: upgradeName, debuxPerSec});
    } else if (typeof debuxPerClick !== 'undefined' && debuxPerClick !== 0) {
      console.log('DebuxPerClick purchased')
      this.purchasedUpgradesPerClick.push({name: upgradeName, debuxPerClick});
    }
  }

  calculateTotalDebuxPerClick(): number {
    return this.purchasedUpgradesPerClick.reduce((total, upgrade) =>
      total + upgrade.debuxPerClick, 1
    );
  }

  calculateTotalDebuxPerSec(): number {
    return this.purchasedUpgradesPerSec.reduce((total, upgrade) =>
      total + upgrade.debuxPerSec, 0
    );
  }

  firstCalc(upgrades: any) {
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
      this.buyUpgrade(value.name, totalDebuxPerSec, totalDebuxPerClick)
    }
  }

  addDebux(debux: number): void {
    // this.debuxChangesQueue.push(debux) to add to list. This use this, when per/sec upgrades. This save items in batch
    this.debuxValue = debux; // To show the value change right away to user.
  }

  addUpgrades(upgrades: any) {
    this.upgradesUpdated = upgrades
  }

  private startAutosave(): void {
    // Use throttleTime to limit the frequency of save operations
    timer(0, this.saveInterval * 1000) //  regular intervals (this.saveInterval).
      .pipe(
        switchMap(() => this.autosave()), // The switchMap operator is used to switch to the result of the autosave method.
        throttleTime(this.saveInterval) // The throttleTime operator limits the frequency of autosave operations to prevent excessive calls.
      )
  }

  autosave(): Observable<void> {
    // If user is authenticated and there are changes to the value.
    if (this.user && this.debuxValue != 0) {
      // Creates a dict or batch to send the data in one write.
      const updateData: any = {
        Debux: this.debuxValue,
      };

      if (this.upgradesUpdated) {
        updateData.upgrades = this.upgradesUpdated
      }

      this.autosaveDate = new Date();
      this.setDebux(this.debuxValue, this.calculateTotalDebuxPerSec());

      return from(this.db.doc(`User/${this.user?.uid}`).update(updateData)).pipe(
        map(() => {
          // Clear the queue after a successful write

          this.debuxValue = 0;
          console.log('cleared')
        })
      );
    } else {
      return of(undefined); // No user or nothing to save
    }
  }


  getDebux(): Observable<number | undefined> {
    return this.authState$.pipe(
      switchMap((user) => {
        if (this.user) {
          return this.db.doc(`User/${this.user.uid}`).valueChanges().pipe(
            map((userData: any) => userData ? userData.Debux : undefined)
          );
        } else {
          console.warn('User not authenticated.'); // Use warn for non-critical issues
          return of(undefined); // Return an observable that completes immediately with undefined
        }
      })
    );
  }

  sendUpgrades(upgradesIn: any) {
    const userDocRef = this.db.collection('User').doc(this.user?.uid);
    userDocRef.set({upgrades: upgradesIn}, {merge: true});

  }

  getUpgrades(): Observable<any[]> {
    return this.authState$.pipe(
      switchMap((user) => {
        if (user) {
          const userDocRef = this.db.collection('User').doc(user.uid);
          return userDocRef.valueChanges().pipe(
            map((userUID: any) => userUID ? userUID.upgrades || this.upgradesDefault : [])
          );
        } else {
          console.warn('User not authenticated.');
          return of([]); // Return an observable that completes immediately with an empty array
        }
      })
    );
  }

  setDebux(debuxsend: number, anotherValue: number) {
    console.log('sending')
    this.debuxSubject.next({debuxsend, anotherValue});
  }

}
