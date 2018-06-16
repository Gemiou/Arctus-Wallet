import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeshiftComponent } from './shapeshift.component';

describe('ShapeshiftComponent', () => {
  let component: ShapeshiftComponent;
  let fixture: ComponentFixture<ShapeshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
