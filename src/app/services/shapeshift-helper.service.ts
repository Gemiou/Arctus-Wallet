import { Injectable } from '@angular/core';
import * as shapeshift from 'shapeshift.io';

@Injectable()
export class ShapeShiftHelperService {

  constructor() { }

  getAvailableCoins(currentCoins) {
    return new Promise((resolve, reject) => {
      shapeshift.coins((err, coinData) => {
        if (!err) {
          resolve(
            Object.keys(coinData)
            .filter(
              key => currentCoins.some((el) => el.type == key.toUpperCase()) && coinData[key].status == 'available'
            )
          );
        } else {
          reject(err);
        }
      });
    });
  }

  getPairInfo(deposit, receive) {
    return new Promise((resolve, reject) => {
      let pair = `${deposit}_${receive}`;
      shapeshift.marketInfo(pair, (err, marketInfo) => {
        if (!err) {
          resolve(marketInfo);
        } else {
          reject(err);
        }
      });
    });
  }

  
}
