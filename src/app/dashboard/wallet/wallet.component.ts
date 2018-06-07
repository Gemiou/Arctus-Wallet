import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { keccak_256 } from 'js-sha3';

import { CryptoHelperService } from '../../services/crypto-helper.service';

import { Wallet, utils } from 'ethers';
import * as bigi from 'bigi';
import * as bitcoin from 'bitcoinjs-lib';
import * as $ from 'jquery';
import * as countUp from 'countup.js';
import { Observable } from 'rxjs/Observable';

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

  constructor(private ch: CryptoHelperService, private http: Http, private router: Router, private loadingBar: LoadingBarService) {
    if (this.ch.decryptKey() === null || this.ch.decryptKey() == "") {
      this.router.navigate(['/login/']);
    }
  }

  ngOnInit() {
    this.loadingBar.start();
    setTimeout(() => this.executeGetters(), 10);
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
        // console.log(this.coins[(<any>obj).coin]);
        this.coins[(<any>obj).coin].balance =
          Number((<any>obj).balance === undefined ?
            this.coins[(<any>obj).coin].balance :
            (<any>obj).balance / Math.pow(10, this.coins[(<any>obj).coin].realDecimals));
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
      (this.coins[this.selectedCoin].balance === undefined) ? 0 : this.coins[this.selectedCoin].balance,
      (this.coins[index].balance === undefined) ? 0 : this.coins[index].balance, this.coins[index].decimals,
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
  }

  alreadyExists(type: string) {
    return document.querySelectorAll('.'+type+'-identifier').length == 0;
  }
}
