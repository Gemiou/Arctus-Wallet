import { TestBed, inject } from '@angular/core/testing';

import { ShapeShiftHelperService } from './shapeshift-helper.service';

describe('ShapeshiftHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeShiftHelperService]
    });
  });

  it('should be created', inject([ShapeShiftHelperService], (service: ShapeShiftHelperService) => {
    expect(service).toBeTruthy();
  }));
});
