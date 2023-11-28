import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
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

  debuxFirstSubscription: Subscription | undefined;
  debuxSubscription: Subscription | undefined;
  upgrades: any

  constructor(private clickerService: ClickerService, private cdr: ChangeDetectorRef) {
    this.debux = 0;
    this.loading = true
    this.perSecond = 0
  }

  ngOnInit() {
    //this.subscribeToGetFirstDebux()
    // this.subscribeToGetUpgrades()
    this.subscribeToGetDebux()
  }


  subscribeToGetDebux() {
    if (!this.debuxSubscription) {
      console.log('again');
      // Check if debux data has already been fetched
      if (!this.debux) {
        this.debuxSubscription = this.clickerService.debux$.subscribe(({debuxSend, debuxPerSecSend}) => {
          this.debux = debuxSend;
          this.perSecond = debuxPerSecSend || 0;
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    }
  }




  ngOnDestroy() {
    if (this.debuxSubscription) {
      this.debuxSubscription.unsubscribe();
    }
    if (this.debuxFirstSubscription) {
      this.debuxFirstSubscription.unsubscribe();
    }
  }

}
