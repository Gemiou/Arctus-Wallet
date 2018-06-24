import { Component, OnInit } from '@angular/core';
import { CryptoHelperService } from '../../services/crypto-helper.service';
import { Router } from '@angular/router';
import { keccak_256 } from 'js-sha3';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-addnewcoin',
  templateUrl: './addnewcoin.component.html',
  styleUrls: ['./addnewcoin.component.scss']
})
export class AddnewcoinComponent implements OnInit {
  coins: Array<any>;
  downloadedJSON: Boolean = false;
  selectedCoins: Array<any> = [];
  coinName: any = { class: '' };
  coinAbbr: any = { type: '' };
  shouldHaveJSON: Boolean = true;
  searchActive: Boolean = false;

  constructor(private ch: CryptoHelperService, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit() {
    this.coins = this.ch.coins;
    this.selectedCoins = JSON.parse( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) ).coins;
    const customCoins = this.selectedCoins.filter(el => !this.coins.some((innerEl) => innerEl.tokenAddress === el.tokenAddress));
    this.coins = customCoins.concat(this.coins);
    for (let i = 0; i < this.selectedCoins.length; i++) {
      for (let j = 0; j < this.coins.length; j++) {
        if (this.selectedCoins[i].type === this.coins[j].type) {
          this.coins[j].selected = true;
          break;
        }
      }
    }
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

  alreadyExists(coin: any, coinArray: any) {
    return coinArray.some((el) => el.type == coin.type);
  }

  toggleCustomCoinModal($event) {
    this.searchActive = false;
    if ($event.target !== $event.currentTarget && !this.isMobile()) {
      return;
    }
    document.querySelector('.overlaytwo').classList.toggle('active');
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

  isMobile() {
    return document.querySelectorAll('.mobile').length !== 0;
  }
  mobileSearch() {
    this.searchActive = !this.searchActive;
  }
}
