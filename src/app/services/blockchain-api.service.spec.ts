import { TestBed, inject } from '@angular/core/testing';

import { BlockchainAPIService } from './blockchain-api.service';

describe('BlockchainAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlockchainAPIService]
    });
  });

  it('should be created', inject([BlockchainAPIService], (service: BlockchainAPIService) => {
    expect(service).toBeTruthy();
  }));
});
