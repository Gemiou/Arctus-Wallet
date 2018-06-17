import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { keccak_256 } from 'js-sha3';

import { CryptoHelperService } from '../../services/crypto-helper.service';
import { BlockchainAPIService } from '../../services/blockchain-api.service';
import { SharedDataService } from '../../services/shared-data.service';
import { ShapeShiftHelperService } from '../../services/shapeshift-helper.service';

import { Wallet, utils } from 'ethers';
import * as bigi from 'bigi';
import * as bitcoin from 'bitcoinjs-lib';
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
  availableSSCoins: Array<any> = [];
  balance: Number = 10;
  value: Number = 10000;
  selectedCoin: any = 0;
  sign: String = '$';
  USDtoEUR = 0;
  denomination: String;
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
    private shData: SharedDataService,
    private SS: ShapeShiftHelperService
  ) {
  }

  ngOnInit() {
    this.loadingBar.start();
    setTimeout(() => this.executeGetters(), 10);
  }

  toggleShapeshift() {
    this.shData.changeShapeShiftModalStatus(true);
    this.shData.changeShapeShiftPair(
      [
        this.coins[this.selectedCoin].type,
        this.availableSSCoins[0] === this.coins[this.selectedCoin].type ?
        this.availableSSCoins[1] :
        this.availableSSCoins[0]
      ]
    );
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
    this.getShapeShiftCoins();
    this.refreshUI(this.coins).subscribe(
      (obj) => {
        this.coins[(<any>obj).coin].balance =
          Number((<any>obj).balance === undefined ?
            this.coins[(<any>obj).coin].balance :
            parseInt((<any>obj).balance + '', 10) / Math.pow(10, this.coins[(<any>obj).coin].realDecimals));
        if ((<any>obj).value === 'N/A') {
          this.coins[(<any>obj).coin].value = 'N/A';
        } else {
          this.coins[(<any>obj).coin].value =
            Number((<any>obj).value === undefined ?
              this.coins[(<any>obj).coin].value :
              (<any>obj).value * this.coins[(<any>obj).coin].balance);
        }
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

  getShapeShiftCoins() {
    this.SS.getAvailableCoins(this.coins)
    .then((availableCoins) => {
      this.availableSSCoins = <Array<any>>availableCoins;
    })
    .catch((err) => {
      console.log(err);
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
          if (err.toString().indexOf('call exception') !== -1) {
            observer.next({
              coin: i,
              value: 'N/A'
            });
            alert(
              'WARNING: Token Contract of ' +
              this.coins[i].class +
              ' at address ' +
              this.coins[i].tokenAddress +
              ' does not exist or is not compatible with ERC-20. Remove it via the \'Add New Coin\' option.');
            this.coinsLoaded++;
            if (this.coinsLoaded === coins.length) {
              observer.complete();
            }
          } else {
            observer.error(err);
          }
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
    this.shData.changeCoinBalance(this.coins[index].balance / this.coins[index].decimals);
  }

  alreadyExists(type: string) {
    return document.querySelectorAll('.' + type + '-identifier').length === 0;
  }
}
