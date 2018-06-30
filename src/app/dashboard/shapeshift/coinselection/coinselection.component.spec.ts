import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSelectionComponent } from './coinselection.component';

describe('CoinselectionComponent', () => {
  let component: CoinSelectionComponent;
  let fixture: ComponentFixture<CoinSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
