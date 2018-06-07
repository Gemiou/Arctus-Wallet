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
    return document.querySelectorAll('.'+type+'-identifier').length == 0;
  }
}
