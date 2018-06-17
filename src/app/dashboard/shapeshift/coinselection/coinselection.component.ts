import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CryptoHelperService } from '../../../services/crypto-helper.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { ShapeShiftHelperService } from '../../../services/shapeshift-helper.service';
import { keccak_256 } from 'js-sha3';


@Component({
  selector: 'app-coinselection',
  templateUrl: './coinselection.component.html',
  styleUrls: ['./coinselection.component.scss']
})
export class CoinSelectionComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();

  coins: Array<any>;
  selectedCoins: Array<any> = [];
  coinName: any = { class: '' };
  coinAbbr: any = { type: '' };

  constructor(private ch: CryptoHelperService, private SS: ShapeShiftHelperService, private shData: SharedDataService) { }

  ngOnInit() {
    this.coins = this.ch.coins;
    this.selectedCoins = JSON.parse( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) ).coins;
    const customCoins = this.selectedCoins.filter(el => !this.coins.some((innerEl) => innerEl.tokenAddress === el.tokenAddress));
    this.coins = customCoins.concat(this.coins);
    this.SS.getAvailableCoins(this.coins)
    .then((availableCoins) => {
      this.coins = this.coins.filter((el) => (<Array<any>>availableCoins).includes(el.type));
    })
    .catch((err) => {
      console.log(err);
      this.coins = [];
    });
  }

  selectCoin(e, index: any) {
    e.preventDefault();
    const pair = this.shData.shapeShiftPair.getValue();
    pair[1] = this.coins[index].type;
    this.shData.changeShapeShiftPair(pair);
  }


  alreadyExists(type: string) {
    return document.querySelector('.' + type + '-identifier') === null;
  }
}
