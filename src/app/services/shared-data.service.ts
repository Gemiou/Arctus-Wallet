import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedDataService {
  // Observable string sources
  private shapeshiftModalStatus = new Subject<any>();
  private selectedCoin = new Subject<any>();
  public coinBalance = new BehaviorSubject<any>(0);
  // Observable string streams
  modalStatus$ = this.shapeshiftModalStatus.asObservable();
  coinToShift$ = this.selectedCoin.asObservable();
  balanceCoin$ = this.coinBalance.asObservable();
  // Service message commands
  getShapeshiftModalStatus(change: any) {
      this.shapeshiftModalStatus.next(change);
  }
  getSelectedCoin(change: any) {
      this.selectedCoin.next(change);
  }
  changeCoinBalance(change: any) {
    this.coinBalance.next(change);
  }
  constructor() { }

}
