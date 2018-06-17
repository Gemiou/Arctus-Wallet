import { TestBed, inject } from '@angular/core/testing';

import { ShapeshiftHelperService } from './shapeshift-helper.service';

describe('ShapeshiftHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeshiftHelperService]
    });
  });

  it('should be created', inject([ShapeshiftHelperService], (service: ShapeshiftHelperService) => {
    expect(service).toBeTruthy();
  }));
});
