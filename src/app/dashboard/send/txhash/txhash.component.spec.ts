import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxhashComponent } from './txhash.component';

describe('TxhashComponent', () => {
  let component: TxhashComponent;
  let fixture: ComponentFixture<TxhashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxhashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxhashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
