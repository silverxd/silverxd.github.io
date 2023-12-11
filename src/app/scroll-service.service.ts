import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollSource = new Subject<number>();
  scroll$ = this.scrollSource.asObservable();

  updateScroll(scrollValue: number) {
    this.scrollSource.next(scrollValue);
  }
}