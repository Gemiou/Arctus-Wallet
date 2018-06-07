import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CryptoHelperService } from '../../../services/crypto-helper.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnChanges {

  @Input() address: string;
  @Input() amount: number;
  @Input() coin: string;
  info = '';


  QRCode = '';
  isValid = false;

  public amountfromparent = 0;
  constructor(private ch: CryptoHelperService ) { }

  ngOnChanges(changeRecord: SimpleChanges) {
    let decimals = 0;
    this.ch.coins.forEach((el) => {
      if (el.type === this.coin) {
        decimals = el.realDecimals;
      }
    });
    if (this.coin !== 'ETH' && this.coin !== 'BTC') {
      this.isValid = false;
      this.info = 'Non-ETH/BTC transfers are not supported yet via a QR Code';
      return;
      // this.QRCode += '&mode=contract_function&functionSignature=';
    } else if (this.coin === 'ETH') {
      this.amount = changeRecord.amount.currentValue * Math.pow(10, decimals);
      this.QRCode = 'ethereum:' + this.address + '?value=' + this.amount;
      this.info = 'QR Code generated for ' + (this.amount / Math.pow(10, decimals)) + ' ' + this.coin;
    } else {
      this.amount = changeRecord.amount.currentValue;
      this.QRCode = 'bitcoin:' + this.address + '?value=' + this.amount;
      this.info = 'QR Code generated for ' + this.amount + ' ' + this.coin;
    }
    if (this.amount > 0) {
      this.isValid = true;
    } else {
      this.isValid = false;
      this.info = 'Enter a non-zero amount of ' + this.coin + ' to receive';
    }
  }
}
