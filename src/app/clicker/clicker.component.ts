import {Component, OnInit} from '@angular/core';
import {ClickerService} from "./clicker.service";


@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.component.html',
  styleUrls: ['./clicker.component.css'],
})
export class ClickerComponent implements OnInit {
  debux: number;
  loading: boolean;
  upgrades: {name: string, cost: number, debuxPerSec: number, affordable: boolean, purchased: number, description: string}[] = [
    { name: 'Multithreading', cost: 10, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Increase processing power by utilizing multiple threads.' },
    { name: 'Optimization Algorithms', cost: 100, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Enhance efficiency through advanced code optimization techniques.' },
    { name: 'Parallel Processing', cost: 1000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Enable simultaneous execution for faster processing.' },
    { name: 'Overclocking', cost: 10000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Push the CPU to run faster, boosting processing power.' },
    { name: 'Hardware Upgrades', cost: 100000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Install better processors or RAM to increase overall performance.' },
    { name: 'Cooling Systems', cost: 1000000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Optimize cooling mechanisms to sustain higher processing speeds.' },
    { name: 'Syntax Highlighting', cost: 1, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Boost click effectiveness with highlighted code segments.' },
    { name: 'Code Formatting', cost: 10, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Improve the appearance of code to enhance click impact.' },
    { name: 'Auto-Completion', cost: 100, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Increase code suggestion accuracy to amplify your clicks.' },
    { name: 'GUI Enhancements', cost: 1000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Upgrade the interface for a more responsive and impactful clicking experience.' },
    { name: 'Mouse Acceleration', cost: 10000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Improve click effectiveness by enhancing mouse sensitivity.' },
    { name: 'ChatGPT Evolution', cost: 1000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Upgrade ChatGPT to a more advanced version, increasing its problem-solving capabilities and assistance in debugging.' },
    { name: 'Automated Testing', cost: 10000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Develop a robust automated testing system that quickly identifies and reports bugs, making debugging more efficient.' },
    { name: 'Code Refactoring AI', cost: 100000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Integrate AI-driven code refactoring to automatically improve code structure and readability during the debugging process.' },
    { name: 'Codebase Analysis', cost: 1000000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Unlock in-depth analysis tools that provide insights into code quality, performance, and potential issues, aiding in targeted debugging efforts.' },
    { name: 'Tabnine', cost: 10000000, debuxPerSec: 1, affordable: false, purchased: 0,
      description: 'Upgrade Tabnine\'s capabilities, allowing it to suggest code snippets and completions at an accelerated rate, improving coding speed and accuracy.' },
  ];

  constructor(public service: ClickerService) {
    this.debux = 0;
    this.loading = false;
  }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.service.authState$.subscribe((user) => {
      if (user) {
        this.loading = true;
        // Fetch the initial debux value from the database
        this.service.getDebux().subscribe((value) => {
          this.debux = value || 0; // If the value is null or undefined, default to 0
          this.updateAffordability(); // Check and update upgrade affordability
          this.loading = false;
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
      upgrade.affordable = false; // Disable the button after purchase
      // You might want to implement logic to increase debuxPerSec or other effects here
      this.service.addDebux(this.debux); // Update DeBux in the service
    } 
    else if (upgrade.affordable && (this.debux - upgrade.cost) >= upgrade.cost) {
      this.debux -= upgrade.cost; // Deduct the cost from user's DeBux
      upgrade.cost += 5; // Increase upgrades cost
      upgrade.purchased += 1; // Increase purchased amount
      // You might want to implement logic to increase debuxPerSec or other effects here
      this.service.addDebux(this.debux); // Update DeBux in the service
    }
    else {
      console.log('Not enough DeBux for this upgrade.');
    }
    this.updateAffordability(); // Update affordability so upgrades can open up
  }
}
