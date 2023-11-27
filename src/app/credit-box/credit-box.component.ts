import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClickerService} from "../clicker/clicker.service";
import {Subscription} from "rxjs";

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

  constructor(private clickerService: ClickerService, private cdr: ChangeDetectorRef) {
    this.debux = 0;
    this.loading = true
    this.perSecond = 0
  }

  ngOnInit() {
    this.debuxSubscription = this.clickerService.debux$.subscribe(({debuxsend, anotherValue}) => {
      this.debux = debuxsend;
      this.perSecond = anotherValue || 0;
      this.loading = false
      this.cdr.detectChanges();
    });
  }
  ngOnDestroy() {
    if (this.debuxSubscription) {
      this.debuxSubscription.unsubscribe();
    }
  }
}
