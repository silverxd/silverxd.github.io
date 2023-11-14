import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ClickerService } from './clicker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.component.html',
  styleUrls: ['./clicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClickerComponent implements OnInit, OnDestroy{
  debux: number;
  debuxPerSec: number;
  upgrades: { name: string, cost: number, debuxPerSec: number }[];
  debuxPerSecSubscription: Subscription = new Subscription();

  constructor(private clickerService: ClickerService, private cdr: ChangeDetectorRef, private zone: NgZone) {
    this.debux = 0;
    this.debuxPerSec = 0;
    this.upgrades = this.clickerService.getUpgrades();
  }

  ngOnInit() {
    this.debuxPerSecSubscription = this.clickerService.startDebuxPerSecTimer().subscribe(debuxPerSec => {
      this.debux += this.debuxPerSec;
      this.zone.run(() => {
        this.debuxPerSec = debuxPerSec;
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    if (this.debuxPerSecSubscription) {
      this.debuxPerSecSubscription.unsubscribe();
    }
  }

  addDebux() {
    this.clickerService.addDebux(1);
    this.debux = this.clickerService.getDebux();
  }

  buyUpgrade(upgradeIndex: number) {
    const success = this.clickerService.buyUpgrade(upgradeIndex);
    if (success) {
      // Upgrade bought successfully
      this.debux = this.clickerService.getDebux();
      this.debuxPerSec = this.clickerService.getDebuxPerSec();
    } else {
      // Insufficient debux to buy the upgrade
      console.log('Insufficient debux to buy the upgrade.');
    }
  }
}
