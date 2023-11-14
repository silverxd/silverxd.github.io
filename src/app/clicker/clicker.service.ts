import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {from, map, Observable, of, switchMap, throttleTime, timer} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClickerService {
  user: User | null;
  authState$: Observable<User | null>;

  private debuxValue: number | undefined;
  private debuxChangesQueue: number[] = [];
  private readonly saveInterval = 60 * 1000; // Autosave every 60 seconds

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

  addDebux(debux: number): void {
    // Add the change to the queue
    this.debuxChangesQueue = [debux]; // How many clicks/changes are made between autosave intervals.
    // this.debuxChangesQueue.push(debux) to add to list. This use this, when per/sec upgrades. This save items in batch
    this.debuxValue = debux; // To show the value change right away to user.
  }

  private startAutosave(): void {
    // Use throttleTime to limit the frequency of save operations
    timer(0, this.saveInterval) //  regular intervals (this.saveInterval).
      .pipe(
        switchMap(() => this.autosave()), // The switchMap operator is used to switch to the result of the autosave method.
        throttleTime(this.saveInterval) // The throttleTime operator limits the frequency of autosave operations to prevent excessive calls.
      )
      .subscribe();
  }

  private autosave(): Observable<void> {
    // If user is authenticated and there are changes to the value.

    if (this.user && this.debuxChangesQueue.length > 0) {
      // Sums up the elements in array to the variable totalDebux
      const totalDebux = this.debuxChangesQueue.reduce((acc, value) => acc + value, 0);
      console.log('this is the changed amount' + totalDebux)

      // Send the totalDebux value to the Database
      return from(this.db.doc(`User/${this.user.uid}`).update({Debux: totalDebux})).pipe(
        map(() => {
          // Clear the queue after a successful write
          this.debuxChangesQueue = [];
        })
      );
    } else {
      return of(undefined); // No user or nothing to save
    }
  }


  getDebux(): Observable<number | undefined> {
    if (this.user) {
      return this.db.doc(`User/${this.user.uid}`).valueChanges().pipe(
        map((userData: any) => userData ? userData.Debux : undefined)
      );
    } else {
      console.warn('User not authenticated.'); // Use warn for non-critical issues
      return of(undefined); // Return an observable that completes immediately with undefined
    }
  }
}
