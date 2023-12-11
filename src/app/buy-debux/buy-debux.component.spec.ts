import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyDebuxComponent } from './buy-debux.component';

describe('BuyDebuxComponent', () => {
  let component: BuyDebuxComponent;
  let fixture: ComponentFixture<BuyDebuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyDebuxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyDebuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
