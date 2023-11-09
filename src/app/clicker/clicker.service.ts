import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClickerService {
  private debux: number = 0;
  private debuxPerSec: number = 0;
  private upgrades: { name: string, cost: number, debuxPerSec: number }[] = [
    { name: 'Multithreading', cost: 10, debuxPerSec: 1 },
    // Add more upgrades as needed
  ];

  getDebux(): number {
    return this.debux;
  }

  getDebuxPerSec(): number {
    return this.debuxPerSec;
  }

  addDebux(amount: number): void {
    this.debux += amount;
  }

  buyUpgrade(upgradeIndex: number): boolean {
    const upgrade = this.upgrades[upgradeIndex];
    if (this.debux >= upgrade.cost) {
      this.debux -= upgrade.cost;
      this.debuxPerSec += upgrade.debuxPerSec;
      return true; // Upgrade successfully bought
    }
    return false; // Insufficient debux
  }

  getUpgrades(): { name: string, cost: number, debuxPerSec: number }[] {
    return this.upgrades;
  }

  startDebuxPerSecTimer(): Observable<number> {
    return interval(1000).pipe(
      map(() => {
        this.debux += this.debuxPerSec;
        return this.debuxPerSec;
      })
    );
  }
}
