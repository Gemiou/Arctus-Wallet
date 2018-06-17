import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedDataService {
  private shapeshiftModalStatus = new Subject<any>();
  // ShapeShift Pair (As Array of 2 values)
  public shapeShiftPair = new BehaviorSubject<any>(['BTC', 'ETH']);
  public coinBalance = new BehaviorSubject<any>(0);
  // Observable string streams
  modalStatus$ = this.shapeshiftModalStatus.asObservable();
  shapeShiftPair$ = this.shapeShiftPair.asObservable();
  balanceCoin$ = this.coinBalance.asObservable();
  // Service message commands
  changeShapeShiftModalStatus(change: any) {
    this.shapeshiftModalStatus.next(change);
  }
  changeShapeShiftPair(change: any) {
    this.shapeShiftPair.next(change);
  }
  changeCoinBalance(change: any) {
    this.coinBalance.next(change);
  }
  constructor() { }

}
