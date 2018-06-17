import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedDataService {
  // Observable string sources
  private shapeshiftModalStatus = new Subject<any>();
  private selectedCoin = new Subject<any>();
  // Observable string streams
  modalStatus$ = this.shapeshiftModalStatus.asObservable();
  coinToShift$ = this.selectedCoin.asObservable();
  // Service message commands
  getShapeshiftModalStatus(change: any) {
    this.shapeshiftModalStatus.next(change);
  }
  getSelectedCoin(change: any) {
    this.selectedCoin.next(change);
}
  constructor() { }

}
