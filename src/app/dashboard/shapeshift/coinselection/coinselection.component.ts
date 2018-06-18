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
  coinName: any = { class: '' };
  coinAbbr: any = { type: '' };

  constructor(private ch: CryptoHelperService, private SS: ShapeShiftHelperService, private shData: SharedDataService) { }

  ngOnInit() {
    this.shData.isSelectingCoin$.subscribe(
      (res) => {
        if (res > 0) {
          this.coins = JSON.parse( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) ).coins;
          const currentSelection = this.shData.shapeShiftPair.getValue();
          this.SS.getAvailableCoins(this.coins)
          .then((availableCoins) => {
            this.coins = this.coins.filter(
              (el) => (<Array<any>>availableCoins).includes(el.type) &&
              !currentSelection.includes(el.type.toUpperCase())
            );
          })
          .catch((err) => {
            console.log(err);
            this.coins = [];
          });
        }
      }
    );
  }

  selectCoin(e, coin: any) {
    e.preventDefault();
    const pair = this.shData.shapeShiftPair.getValue();
    pair[this.shData.isSelectingCoin.getValue() - 1] = coin.type;
    this.shData.changeShapeShiftPair(pair);
    this.shData.changeSelectStatus(0);
  }


  alreadyExists(type: string) {
    return document.querySelector('.coin-' + type + '-identifier') === null;
  }
}
