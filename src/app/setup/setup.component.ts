import { Component, OnInit } from '@angular/core';
import { CryptoHelperService } from '../services/crypto-helper.service';
import { Router } from '@angular/router';
import { keccak_256 } from 'js-sha3';
import { Wallet } from 'ethers';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  coins: Array<any>;
  clicked: boolean;
  selectedCoins: Array<any> = [];
  coinName: any = { class: '' };
  coinAbbr: any = { type: '' };

  constructor(private ch: CryptoHelperService, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit() {
    this.coins = this.ch.coins;
  }

  selectCoin(e, coin: any, index: any) {
    e.preventDefault();
    if (this.coins[index].selected === undefined) {
      this.selectedCoins.push(coin);
      this.coins[index].selected = true;
    } else if (this.coins[index].selected) {
      this.selectedCoins = this.selectedCoins.filter(item => item.class !== coin.class);
      this.coins[index].selected = false;
    } else {
      this.selectedCoins.push(coin);
      this.coins[index].selected = true;
    }
  }

  saveSettings() {
    const obj = {
      coins: this.selectedCoins
    };
    this.coins.forEach(function(el) { el.selected = false; });
    localStorage.setItem('preferences-' + keccak_256( this.ch.decryptKey() ), JSON.stringify(obj));
    this.router.navigate(['dashboard/wallet/']);
  }

  toJSON() {
    const obj = {
      coins: this.selectedCoins
    };
    localStorage.setItem('preferences-' + keccak_256( this.ch.decryptKey() ), JSON.stringify(obj));
    const p_key = this.ch.decryptKey();
    const password = localStorage.getItem('pass');
    const wallet = new Wallet(p_key);
    this.loadingBar.start();
    const encryptPromise = wallet.encrypt(password);
    encryptPromise.then((json) => {
      this.loadingBar.complete();
      json = JSON.parse(json);
      json.dashSettings = JSON.parse( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) );
      json = JSON.stringify(json);
      const toDownload = new Blob([json], { type: 'application/json' });
      const link = window.URL.createObjectURL(toDownload);
      const a = <HTMLAnchorElement>document.createElement('a');
      a.href = link;
      a.download = 'keystore.json';
      a.click();
      this.clicked = true;
    });
  }

  alreadyExists(type: string) {
    return document.querySelector('.' + type + '-identifier') === null;
  }

  toggleCustomCoinModal($event) {
    if ($event.target !== $event.currentTarget) {
      return;
    }
    document.querySelector('.overlay').classList.toggle('active');
    document.querySelector('#custom-coin-modal').classList.toggle('active');
  }

  filterAddress(e) {
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
  }

  addCustomToken($event) {
    const tokenAddress = (<HTMLInputElement>document.querySelector('.token-address')).value;
    const tokenSymbol = (<HTMLInputElement>document.querySelector('.token-symbol')).value;
    const tokenDecimals = (<HTMLInputElement>document.querySelector('.token-decimals')).value;
    const token = {
       'class': tokenSymbol,
       'type': tokenSymbol,
       'icon': '',
       'urlIndex': 2,
       'decimals': parseInt(tokenDecimals, 10) > 4 ? 4 : tokenDecimals,
       'realDecimals': tokenDecimals,
       'pipe': '1.1-4',
       'tokenAddress': tokenAddress
    };
    this.coins.unshift(token);
    this.selectedCoins.unshift(token);
    this.coins[0].selected = true;
    this.toggleCustomCoinModal($event);
  }
}
