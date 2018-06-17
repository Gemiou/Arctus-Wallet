import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { keccak_256 } from 'js-sha3';

import { CryptoHelperService } from '../../services/crypto-helper.service';
import { BlockchainAPIService } from '../../services/blockchain-api.service';
import { SharedDataService } from '../../services/shared-data.service';

import { Wallet, utils } from 'ethers';
import * as bigi from 'bigi';
import * as bitcoin from 'bitcoinjs-lib';
import * as countUp from 'countup.js';
import { Observable } from 'rxjs/Observable';
import * as shapeshift from 'shapeshift.io';

// import * as Chartjs from 'chart.js';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  coins: Array<any> = [{
    type: ''
  }];
  balance: Number = 10;
  value: Number = 10000;
  selectedCoin: any = 0;
  sign: String = '$';
  USDtoEUR = 0;
  denomination: String;
  test: Array<any> = [];
  coinName: any = { class: '' };
  coinAbbr: any = { type: '' };
  generatedAddresses: any = {};
  showLoading = true;
  coinsLoaded = 0;
  shapeShiftModalStatus: Boolean = false;

  constructor(
    private ch: CryptoHelperService,
    private bc: BlockchainAPIService,
    private http: Http,
    private router: Router,
    private loadingBar: LoadingBarService,
    private shData: SharedDataService
  ) {
  }

  shapeshift() {

    shapeshift.coins(function (err, coinData) {
      console.log('shapeshift', coinData);
    });


    const withdrawalAddress = 'YOUR_LTC_ADDRESS';
    const pair = 'btc_ltc';

    // if something fails
    const options = {
      returnAddress: 'YOUR_BTC_RETURN_ADDRESS'
    };

    shapeshift.shift(withdrawalAddress, pair, options, (err, returnData) => {

      // ShapeShift owned BTC address that you send your BTC to
      const depositAddress = returnData.deposit;

      // you need to actually then send your BTC to ShapeShift
      // you could use module `spend`: https://www.npmjs.com/package/spend
      // spend(SS_BTC_WIF, depositAddress, shiftAmount, function (err, txId) { /.. ../ })

      // this.ch.sendTransaction(pair.split('_')[0],

      shapeshift.status(depositAddress, function (err, status, data) {
        console.log(status); // => should be 'received' or 'complete'
      });


      // later, you can then check the deposit status


    });
  }

  ngOnInit() {
    this.loadingBar.start();
    setTimeout(() => this.executeGetters(), 10);
  }

  toggleShapeshift() {
    this.shapeShiftModalStatus = true;
    this.shData.getShapeshiftModalStatus(true);
    this.shData.getSelectedCoin(this.coins[this.selectedCoin].type);
    // data from child
  }
  async executeGetters() {
    const preferences = JSON.parse( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) );
    for (let i = 0; i < preferences.coins.length; i++) {
      const address = this.generateAddress(preferences.coins[i].type);
      preferences.coins[i].address = address;
    }
    this.coins = preferences.coins;
    this.getUSDPrice();
    this.refreshUI(this.coins).subscribe(
      (obj) => {
        this.coins[(<any>obj).coin].balance =
          Number((<any>obj).balance === undefined ?
            this.coins[(<any>obj).coin].balance :
            parseInt((<any>obj).balance+'') / Math.pow(10, this.coins[(<any>obj).coin].realDecimals));
        this.coins[(<any>obj).coin].value =
          Number((<any>obj).value === undefined ?
            this.coins[(<any>obj).coin].value :
            (<any>obj).value * this.coins[(<any>obj).coin].balance);
      },
      (err) => console.log(err),
      () => {
        this.createCountUp(this.selectedCoin);
        this.showLoading = false;
        this.loadingBar.complete();
        // this.ch.updateCoins(this.coins);
      }
    );
  }

  getUSDPrice() {
    this.http.get('https://free.currencyconverterapi.com/api/v5/convert?q=USD_EUR&compact=y').subscribe(price => {
      this.USDtoEUR = JSON.parse((<any>price)._body).USD_EUR.val;
    });
  }

  refreshUI(coins: Array<any>) {
    return new Observable((observer) => {
      for (let i = 0; i < coins.length; i++) {
        this.ch.getCoinBalance(this.coins[i].urlIndex, this.coins[i].address, this.coins[i].tokenAddress).then((res) => {
          const containerObj = {
            coin: i,
            balance: res
          };
          observer.next(containerObj);
          return this.ch.getCoinValue(this.coins[i].urlIndex, this.coins[i].tokenAddress);
        }).then((res) => {
          const containerObj = {
            coin: i,
            value: res
          };
          observer.next(containerObj);
          this.coinsLoaded++;
          if (this.coinsLoaded === coins.length) {
            observer.complete();
          }
        }).catch((err) => {
          observer.error(err);
        });
      }
    });
  }

  generateAddress(type: String) {
    switch (type) {
      case 'ETH': {
        if (this.generatedAddresses.ETH === undefined) {
          this.generatedAddresses.ETH = (new Wallet(this.ch.decryptKey())).getAddress();
        }
        return this.generatedAddresses.ETH;
      }
      case 'BTC': {
        if (this.generatedAddresses.BTC === undefined) {
          this.generatedAddresses.BTC = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
        }
        return this.generatedAddresses.BTC;
      }
      default: {
        if (this.generatedAddresses.ETH === undefined) {
          this.generatedAddresses.ETH = (new Wallet(this.ch.decryptKey())).getAddress();
        }
        return this.generatedAddresses.ETH;
      }
    }
  }

  createCountUp(index) {
    const options = {
      useEasing: true,
      useGrouping: true,
      separator: ',',
      decimal: '.'
    };
    const countAntimation = new countUp(
      'count-up',
      (isNaN(parseFloat(this.coins[this.selectedCoin].balance))) ? 0 : this.coins[this.selectedCoin].balance,
      (isNaN(parseFloat(this.coins[index].balance))) ? 0 : this.coins[index].balance, this.coins[index].decimals,
      1.5,
      options
    );
    if (!countAntimation.error) {
      countAntimation.start();
    } else {
      console.error(countAntimation.error);
    }
  }

  makeActive(index: any) {
    this.createCountUp(index);
    this.selectedCoin = index;
    this.shData.changeCoinBalance(this.coins[index].balance/this.coins[index].decimals);
  }

  alreadyExists(type: string) {
    return document.querySelectorAll('.'+type+'-identifier').length === 0;
  }
}
