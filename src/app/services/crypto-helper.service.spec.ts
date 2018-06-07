import { TestBed, inject } from '@angular/core/testing';

import { CryptoHelperService } from './crypto-helper.service';

describe('CryptoHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoHelperService]
    });
  });

  it('should be created', inject([CryptoHelperService], (service: CryptoHelperService) => {
    expect(service).toBeTruthy();
  }));
});
