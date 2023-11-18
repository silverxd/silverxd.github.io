import {Component, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {ClickerService} from "./clicker.service";
import {interval, Observable, of, take} from 'rxjs';


@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.component.html',
  styleUrls: ['./clicker.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ClickerComponent implements OnInit {
  debux: number;
  loading: boolean;

  upgradesObs$: Observable<any[]>
  upgrades: {
    name: string,
    cost: number,
    debuxPerSec?: number,
    affordable: boolean,
    purchased: number,
    description: string
  } []


  timeDifferenceInSeconds: number = 0;
  maxClicks: number = 2; // per save
  clickCount: number = 0;
  constructor(public service: ClickerService, private zone: NgZone, private cdr: ChangeDetectorRef) {
    this.debux = 0;
    this.loading = false;
    this.upgrades = this.service.upgradesDefault // To display upgrades right away
    this.upgradesObs$ = this.service.getUpgrades()

  }

  ngOnInit() {
    // Subscribe to only first upgrades change
    this.upgradesObs$.pipe(take(1)).subscribe(value => {
      this.upgrades = value
      this.service.firstCalc(this.upgrades)
    })
    // Subscribe to authentication state changes
    this.service.authState$.subscribe((user) => {
      if (user) {
        this.loading = true;
        // Fetch the initial debux value from the database

        this.service.getDebux().subscribe((value) => {
          this.debux = value || 0; // If the value is null or undefined, default to 0
          this.loading = false;

          interval(1000).subscribe(() => {
            this.zone.run(() => {
              this.debux += this.service.calculateTotalDebuxPerSec();
              this.updateAffordability(); // Update affordability so upgrades can open up
              this.service.addDebux(this.debux); // Update DeBux in the service
              this.cdr.detectChanges(); // Manually trigger change detection

              const currentTime = new Date();
              const timeDifferenceInMillis = currentTime.getTime() - this.service.autosaveDate.getTime();
              this.timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / (1000 * 1));
              if (this.timeDifferenceInSeconds == 30) {
                this.clickCount = 0;
              }
            });
          });
        });
      }
    });
  }


  addDebux() {
    this.debux = this.debux + 1;
    this.updateAffordability(); // Update affordability so upgrades can open up
    this.service.addDebux(this.debux);
  }

  updateAffordability() {
    this.upgrades.forEach((upgrade) => {
      upgrade.affordable = upgrade.cost <= this.debux;
    });
  }

  buyUpgrade(upgrade: any): void {
    if (upgrade.affordable && (this.debux - upgrade.cost) < upgrade.cost) {
      this.debux -= upgrade.cost; // Deduct the cost from user's DeBux
      upgrade.cost += 5; // Increase upgrades cost
      upgrade.purchased += 1; // Increase purchased amount
      this.service.buyUpgrade(upgrade.name, upgrade.debuxPerSec); // Call the buyUpgrade method in ClickerService
      upgrade.affordable = false; // Disable the button after purchase
      // You might want to implement logic to increase debuxPerSec or other effects here
      this.service.addDebux(this.debux); // Update DeBux in the service
      this.service.addUpgrades(this.upgrades)
    } else if (upgrade.affordable && (this.debux - upgrade.cost) >= upgrade.cost) {
      this.debux -= upgrade.cost; // Deduct the cost from user's DeBux
      upgrade.cost += 5; // Increase upgrades cost
      upgrade.purchased += 1; // Increase purchased amount
      this.service.buyUpgrade(upgrade.name, upgrade.debuxPerSec); // Call the buyUpgrade method in ClickerService
      // You might want to implement logic to increase debuxPerSec or other effects here
      this.service.addDebux(this.debux); // Update DeBux in the service
      this.service.addUpgrades(this.upgrades)
    } else {
      console.log('Not enough DeBux for this upgrade.');
    }
    this.updateAffordability(); // Update affordability so upgrades can open up
  }

  manualAutosave(){
    if (this.clickCount < this.maxClicks) {
      console.log(this.clickCount)
      this.service.autosave()
      this.clickCount ++;
    }
  }

}
