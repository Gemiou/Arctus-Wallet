import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CryptoHelperService } from './crypto-helper.service';
import * as shapeshift from 'shapeshift.io';
import { Wallet, utils } from 'ethers';
import * as bigi from 'bigi';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class ShapeShiftHelperService {

  constructor(private ch: CryptoHelperService) { }

  getAvailableCoins(currentCoins) {
    return new Promise((resolve, reject) => {
      shapeshift.coins((err, coinData) => {
        if (!err) {
          resolve(
            Object.keys(coinData)
            .filter(
              key => currentCoins.some((el) => el.type === key.toUpperCase()) && coinData[key].status === 'available'
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
      const pair = `${deposit}_${receive}`;
      shapeshift.marketInfo(pair, (err, marketInfo) => {
        if (!err) {
          resolve(marketInfo);
        } else {
          reject(err);
        }
      });
    });
  }

  shiftTokens(withdrawalAddress, deposit, receive, amount) {
    return new Observable((observer) => {
      const pair = `${deposit}_${receive}`;
      let backupAddress;
      switch (deposit.toUpperCase()) {
        case 'ETH': {
          backupAddress = (new Wallet(this.ch.decryptKey())).getAddress();
        }
        case 'BTC': {
          backupAddress = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
        }
      }
      const options = {
        returnAddress: backupAddress
      };
      shapeshift.shift(withdrawalAddress, pair, options, (err, returnData) => {
        if (!err) {
          let depositAddress = returnData.deposit;
          observer.next(depositAddress);
          shapeshift.status(depositAddress, (err, status, data) => {
            if (status === 'no_deposits') {
              this.ch.sendTransaction(deposit.toUpperCase(), amount, depositAddress)
              .then((txReceipt) => {
                observer.next(txReceipt);
                let ticks = 0;
                const timerID = setInterval(() => {
                  if (ticks % 8 === 0) {
                    shapeshift.status(depositAddress, (err, status, data) => {
                      if (status === 'received') {
                        observer.next('received');
                      } else if (status === 'complete') {
                        observer.next(data.transaction);
                        observer.complete();
                      } else if (status === 'failed') {
                        observer.error(data.error);
                      }
                    });
                  }
                  ticks++;
                }, 1000)
              })
              .catch((err) => {
                observer.error(err);
              });
            } else {
              observer.error(data.error);
            }
          });
        } else {
          observer.error(err);
        }
      });
    });
  }

  requestPreciseQuote(withdrawalAddress, deposit, receive, amount) {
    return new Promise((resolve, reject) => {
      const pair = `${deposit}_${receive}`;
      let backupAddress;
      switch (deposit.toUpperCase()) {
        case 'ETH': {
          backupAddress = (new Wallet(this.ch.decryptKey())).getAddress();
        }
        case 'BTC': {
          backupAddress = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
        }
      }
      const options = {
        returnAddress: backupAddress,
        amount: amount
      };
      shapeshift.shift(withdrawalAddress, pair, options, (err, returnData) => {
        if (!err) {
          resolve({ type: deposit.toUppwerCase(), depositAmount: returnData.depositAmount, depositAddress: returnData.deposit, expiration: returnData.expiration, quotedRate: returnData.quotedRate });
        } else {
          reject(err);
        }
      });
    });
  }

  honorPreciseQuote(dataPack) {
    return new Observable((observer) => {
      let { type, depositAmount, depositAddress, expiration, quotedRate } = dataPack;
      shapeshift.status(depositAddress, (err, status, data) => {
        if (status === 'no_deposits') {
          this.ch.sendTransaction(type, depositAmount, depositAddress)
          .then((txReceipt) => {
            observer.next(txReceipt);
            let ticks = 0;
            const timerID = setInterval(() => {
              if (ticks % 8 === 0) {
                shapeshift.status(depositAddress, (err, status, data) => {
                  if (status === 'received') {
                    observer.next('received');
                  } else if (status === 'complete') {
                    observer.next(data.transaction);
                    observer.complete();
                  } else if (status === 'failed') {
                    observer.error(data.error);
                  }
                });
              }
              ticks++;
            }, 1000)
          })
          .catch((err) => {
            observer.error(err);
          });
        } else {
          observer.error(data.error);
        }
      });
    });
  }
}
