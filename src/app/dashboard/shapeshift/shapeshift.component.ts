import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { ShapeShiftHelperService } from '../../services/shapeshift-helper.service';

@Component({
  selector: 'app-shapeshift',
  templateUrl: './shapeshift.component.html',
  styleUrls: ['./shapeshift.component.scss']
})
export class ShapeshiftComponent implements OnInit {
  depositCoin: String;
  receiveCoin: String;
  calculatedRate: String;
  depositMin: String;
  depositMax: String;
  minerFee: String;
  amount: any = '';
  transactionStatus: String;
  transactionStatusDescription: String;
  userBalance: any;
  startedTransaction: Boolean = false;
  constructor(private shData: SharedDataService, private chRef: ChangeDetectorRef, private SS: ShapeShiftHelperService) {
  }

  ngOnInit() {
    this.shData.shapeShiftPair$.subscribe(
      res => {
        this.depositCoin = res[0];
        this.receiveCoin = res[1];
        this.SS.getPairInfo(this.depositCoin, this.receiveCoin)
        .then((pairInfo) => {
          this.calculatedRate = (<any>pairInfo).rate;
          this.depositMin = (<any>pairInfo).minimum;
          this.depositMax = (<any>pairInfo).limit;
          this.minerFee = (<any>pairInfo).minerFee;
          this.chRef.detectChanges();
        })
        .catch((err) => {
          console.log(err);
        });
      }
    );
    this.shData.balanceCoin$.subscribe(
      res => {
        this.userBalance = res;
        console.log(res);
      }
    );
    this.userBalance = this.shData.coinBalance.getValue();
  }

  closeModal() {
    this.shData.changeShapeShiftModalStatus(false);
  }

  selectCoin(type) {
    this.shData.changeSelectStatus(type);
  }

  swapCoins() {
    this.shData.changeShapeShiftPair(this.shData.shapeShiftPair.getValue().reverse());
  }

  executeTransaction() {
    this.startedTransaction = true;
    this.transactionStatus = 'Executing Transaction';
    this.transactionStatusDescription = 'Requesting confirmation from ShapeShift API...';
    // this.SS.shiftTokens(this.depositCoin, this.receiveCoin, this.amount)
    // .subscribe(
    //   (updateMsg) => {
    //     switch (updateMsg) {
    //       case Object.keys(updateMsg).includes('depositAddress'): {
    //         this.transactionStatus = `Sending ${this.depositCoin}`;
    //         // tslint:disable-next-line:max-line-length
    //         this.transactionStatusDescription = `Received confirmation from ShapeShift. Sending ${this.depositCoin} to ${(<any>updateMsg).depositAddress}...`;
    //         break;
    //       }
    //       case Object.keys(updateMsg).includes('txReceipt'): {
    //         this.transactionStatus = `Sent ${this.depositCoin}`;
    //         setTimeout(() => {
    //           this.transactionStatus = 'Waiting confirmation from ShapeShift';
    //         }, 1000);
    //         // tslint:disable-next-line:max-line-length
    //         this.transactionStatusDescription = `Successfully sent ${this.depositCoin} to ShapeShift's address with transaction hash ${(<any>updateMsg).txReceipt}. Awaiting receipt confirmation from ShapeShift...`;
    //         break;
    //       }
    //       case Object.keys(updateMsg).includes('finalReceipt'): {
    //         this.transactionStatus = `Sent ${this.depositCoin}`;
    //         setTimeout(() => {
    //           this.transactionStatus = 'Waiting confirmation from ShapeShift';
    //         }, 1000);
    //         // tslint:disable-next-line:max-line-length
    //         this.transactionStatusDescription = `Successfully sent ${this.depositCoin} to ShapeShift's address with transaction hash ${(<any>updateMsg).txReceipt}. Awaiting receipt confirmation from ShapeShift...`;
    //         break;
    //       }
    //       default: {
    //         this.transactionStatus = 'Received Confirmation from ShapeShift';
    //         setTimeout(() => {
    //           this.transactionStatus = `Waiting ${this.receiveCoin} from ShapeShift`;
    //         }, 1000);
    //         // tslint:disable-next-line:max-line-length
    //         this.transactionStatusDescription = `Received confirmation from ShapeShift. Awaiting ${this.receiveCoin} transaction hash from ShapeShift...`;
    //       }
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {

    //   }
    // );
  }

  filterAmount(e) {
    let current = e.target.value;
    current = current.replace(/$[^0-9.,]*/g, '');
    while (current.indexOf(',') !== current.lastIndexOf(',')) {
      current = current.substring(0, current.indexOf(',')) + current.substring(current.indexOf(',') + 1);
    }
    while (current.indexOf('.') !== current.lastIndexOf('.')) {
      current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
    }
    if (current.indexOf(',') > current.indexOf('.')) {
      current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
    } else {
      current = current.substring(0, current.indexOf(',')) + current.substring(current.indexOf(',') + 1);
    }
    if (current.indexOf('0') === 0 && current.length > 1) {
      current = current.substring(1);
    }
    e.target.value = current;
    this.amount = current.replace(/,/, '.');
  }
}
