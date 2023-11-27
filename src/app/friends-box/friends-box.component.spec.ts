import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsBoxComponent } from './friends-box.component';

describe('FriendsBoxComponent', () => {
  let component: FriendsBoxComponent;
  let fixture: ComponentFixture<FriendsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendsBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
