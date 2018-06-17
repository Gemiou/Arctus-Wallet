import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinselectionComponent } from './coinselection.component';

describe('CoinselectionComponent', () => {
  let component: CoinselectionComponent;
  let fixture: ComponentFixture<CoinselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
