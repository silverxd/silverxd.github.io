import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClickerService} from "../clicker/clicker.service";
import {Subscription, take} from "rxjs";

@Component({
  selector: 'app-credit-box',
  templateUrl: './credit-box.component.html',
  styleUrls: ['./credit-box.component.css']
})
export class CreditBoxComponent implements OnInit {
  debux: number;
  loading: boolean;
  perSecond: number
  private debuxSubscription: Subscription | undefined;
  upgrades: any

  constructor(private clickerService: ClickerService, private cdr: ChangeDetectorRef) {
    this.debux = 0;
    this.loading = true
    this.perSecond = 0
  }

  ngOnInit() {
    this.subscribeToGetDebux()
    this.subscribeToGetUpgrades()
    this.debuxSubscription = this.clickerService.debux$.subscribe(({debuxsend, anotherValue}) => {
      this.debux = debuxsend;
      this.perSecond = anotherValue || 0;
      this.loading = false
      this.cdr.detectChanges();
    });
  }

  subscribeToGetDebux() {
    this.clickerService.getDebux().subscribe((value) => {
      this.debux = value || 0;
      this.loading = false;
      this.cdr.detectChanges();
    })
  }

  subscribeToGetUpgrades() {
    this.clickerService.getUpgrades().pipe(take(1)).subscribe(value => {
      console.log('hei hopsti')
      this.upgrades = value;
      this.clickerService.firstCalc(this.upgrades);
      this.perSecond = this.clickerService.calculateTotalDebuxPerSec()
    });
  }

  addDebux(debuxValue: number, perSec: number) {
    this.debux = debuxValue;
    this.perSecond = perSec;
  }
}
