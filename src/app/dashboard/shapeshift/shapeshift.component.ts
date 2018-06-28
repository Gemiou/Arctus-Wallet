import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { ShapeShiftHelperService } from '../../services/shapeshift-helper.service';
import { CryptoHelperService } from '../../services/crypto-helper.service';
import { HtmlParser } from '@angular/compiler';

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
  amount: any = '0';
  decimals = 0;
  transactionStatus: String;
  transactionStatusDescription: String;
  userBalance: any;
  startedTransaction: Boolean = false;
  rate: any;
  shiftAddress: any;
  isError = false;
  hashHasReturned = false;
  advanced = false;
  constructor(
    private shData: SharedDataService,
    private chRef: ChangeDetectorRef,
    private SS: ShapeShiftHelperService,
    private ch: CryptoHelperService
  ) {
  }

  ngOnInit() {
    this.shData.shapeShiftPair$.subscribe(
      res => {
        this.depositCoin = res[0];
        this.receiveCoin = res[1];
        this.ch.coins.forEach((el, i) => {
          if (el.type === this.depositCoin) {
            this.decimals = el.realDecimals;
          }
        });
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
    console.log(this.amount);
    console.log(this.amount * Math.pow(10, this.decimals));
    this.SS.shiftTokens(
      this.depositCoin,
      this.receiveCoin,
      this.amount * Math.pow(10, this.decimals),
      !/^0x[a-fA-F0-9]{40}$/.test(this.shiftAddress) ? undefined : this.shiftAddress
    )
    .subscribe(
      (updateMsg) => {
          if (Object.keys(updateMsg).includes('depositAddress')) {
            // console.log('c1: ', updateMsg);
            this.transactionStatus = 'Sending ' + this.depositCoin;
            const depositAddress = (<any>updateMsg).depositAddress;
            // tslint:disable-next-line:max-line-length
            const depositAddressLink = '<a href="https://etherscan.io/address/' + depositAddress +
            '" target="_blank">' + depositAddress.slice(0, 12) + '...</a>';
            this.transactionStatusDescription =
            'Received confirmation from ShapeShift. Sending ' + this.depositCoin + ' to ' + depositAddressLink;
          } else
          if (Object.keys(updateMsg).includes('txReceipt')) {
            console.log('c2: ', updateMsg);
            this.transactionStatus = 'Sent ' + this.depositCoin;
            setTimeout(() => {
              this.transactionStatus = 'Waiting confirmation from ShapeShift';
            }, 1000);
            const hashTx = (<any>updateMsg).txReceipt.hash;
            const hashTxLink = '<a href="https://etherscan.io/tx/' + hashTx + '" target="_blank">' + hashTx.slice(0, 12) + '...</a>';
            this.transactionStatusDescription =
            'Successfully sent ' + this.depositCoin + ' to ShapeShifts address with transaction hash '
             + hashTxLink + '. Awaiting receipt confirmation from ShapeShift...';
          } else
          if (Object.keys(updateMsg).includes('finalReceipt')) {
            console.log('c3: ', updateMsg);
            this.transactionStatus = 'Sent ' +  this.depositCoin;
            setTimeout(() => {
              this.transactionStatus = 'Transaction Finished';
            }, 1000);
            const finalRep = (<any>updateMsg).finalReceipt;
            const finalRepLink = '<a href="https://etherscan.io/tx/' + finalRep + '" target="_blank">' + finalRep.slice(0, 12) + '...</a>';
            this.transactionStatusDescription = 'Successfully received ' + this.receiveCoin +
            ' from ShapeShift with transaction hash ' + finalRepLink;
            this.hashHasReturned = true;
          } else {
            console.log('def: ', updateMsg);
            this.transactionStatus = 'Received Confirmation from ShapeShift';
            setTimeout(() => {
              this.transactionStatus = 'Waiting ' + this.receiveCoin + ' from ShapeShift';
            }, 1000);
            this.transactionStatusDescription =
            'Received confirmation from ShapeShift. Awaiting ' + this.receiveCoin + ' transaction hash from ShapeShift...';
          }
      },
      (err) => {
        console.log(err);
        this.transactionStatusDescription = 'There was an error with your transaction. Please try again or contact us.';
        this.isError = true;
      },
      () => {

      }
    );
  }

  filterAmount(e) {
    let current = e.target.value;
    console.log(e);

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

  setMaxAmount() {
    if (this.userBalance < this.depositMax) {
      this.filterAmount({
        target: {
          value: this.userBalance + ''
        }
      });
    } else {
      this.filterAmount({
        target: {
          value: this.depositMax + ''
        }
      });
    }
  }
  setMinAmount() {
    if (this.userBalance >= this.depositMin) {
      this.filterAmount({
        target: {
          value: this.depositMin + ''
        }
      });
    }
  }
  filterAddress(e) {
    if (this.receiveCoin === 'BTC') {
      this.filterBTCAddress(e);
    } else {
      this.filterETHAddress(e);
    }
  }

  filterBTCAddress(e) {
    let current = e.target.value;
    current = current.replace(/[^a-zA-Z0-9]*/g, '').substring(0, 34);
    try {
      e.target.parentElement.classList.remove('has-danger');
      e.target.parentElement.classList.add('has-success');
    } catch (err) {
      e.target.parentElement.classList.add('has-danger');
      e.target.parentElement.classList.remove('has-success');
    }
    e.target.value = current;
    this.shiftAddress = current;
  }

  filterETHAddress(e) {
    let current = e.target.value.replace(/^0x/, '');
    current = current.replace(/[^a-fA-F0-9]*/g, '').substring(0, 40);
    e.target.value = '0x' + current;
    current = e.target.value;
    if (/^0x[a-fA-F0-9]{40}$/.test(current)) {
      e.target.parentElement.classList.remove('has-danger');
      e.target.parentElement.classList.add('has-success');
    } else {
      e.target.parentElement.classList.add('has-danger');
      e.target.parentElement.classList.remove('has-success');
    }
    this.shiftAddress = current;
  }
}
