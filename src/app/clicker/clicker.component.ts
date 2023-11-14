import {Component, OnInit, Output} from '@angular/core';
import {ClickerService} from "./clicker.service";


@Component({
  selector: 'app-clicker',
  templateUrl: './clicker.component.html',
  styleUrls: ['./clicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClickerComponent implements OnInit {
  @Output() debux;  // Output for parent
  loading: boolean;

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
          this.loading = false;
        });
      }
    });
  }

  addDebux() {
    this.debux = this.debux + 1
    //this.service.addNewUser("62289836", "Jane", "Doe", true);
    this.service.addDebux(this.debux);
  }

}
