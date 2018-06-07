import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewcoinComponent } from './addnewcoin.component';

describe('AddnewcoinComponent', () => {
  let component: AddnewcoinComponent;
  let fixture: ComponentFixture<AddnewcoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewcoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
