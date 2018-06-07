import { Component, OnInit} from '@angular/core';
import { CryptoHelperService } from '../../services/crypto-helper.service';
import { Router } from '@angular/router';
import { keccak_256 } from 'js-sha3';

@Component({
  selector: 'app-addnewcoin',
  templateUrl: './addnewcoin.component.html',
  styleUrls: ['./addnewcoin.component.scss']
})
export class AddnewcoinComponent implements OnInit {

  coins: Array<any>;
  selectedCoins: Array<any> = [];
  coinName: any = { class: '' };
  coinAbbr: any = { type: '' };


  constructor(private ch: CryptoHelperService, private router: Router) { }

  ngOnInit() {
    this.coins = this.ch.coins;
    this.selectedCoins = JSON.parse( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) ).coins;
    for (let i = 0; i < this.selectedCoins.length; i++) {
      for (let j = 0; j < this.coins.length; j++) {
        if (this.selectedCoins[i].type === this.coins[j].type) {
          this.coins[j].selected = true;
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
    this.router.navigate(['/dashboard/wallet/']);
  }

  alreadyExists(type: string) {
    return document.querySelectorAll('.'+type+'-identifier').length == 0;
  }
}
