import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBoxComponent } from './credit-box.component';

describe('CreditBoxComponent', () => {
  let component: CreditBoxComponent;
  let fixture: ComponentFixture<CreditBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditBoxComponent]
    });
    fixture = TestBed.createComponent(CreditBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
