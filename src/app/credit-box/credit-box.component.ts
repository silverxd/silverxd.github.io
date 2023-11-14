import {Component, OnInit} from '@angular/core';
import {ClickerService} from "../clicker/clicker.service";

@Component({
  selector: 'app-credit-box',
  templateUrl: './credit-box.component.html',
  styleUrls: ['./credit-box.component.css']
})
export class CreditBoxComponent implements OnInit {
  debux: number;
  loading: boolean;

  constructor(private clickerService: ClickerService) {
    this.debux = 0;
    this.loading = true
  }

  ngOnInit() {
    this.loading = true;
    this.clickerService.getDebux().subscribe((value) => {
      this.debux = value || 0;
      this.loading = false;
    })
  }
}
