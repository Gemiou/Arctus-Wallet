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

  shiftTokens(deposit, receive, amount) {
    return new Observable((observer) => {
      const pair = `${deposit}_${receive}`;
      let backupAddress;
      let withdrawalAddress;
      switch (deposit.toUpperCase()) {
        case 'BTC': {
          backupAddress = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
          break;
        }
        default: {
          backupAddress = (new Wallet(this.ch.decryptKey())).getAddress();
        }
      }
      switch (receive.toUpperCase()) {
        case 'BTC': {
          withdrawalAddress = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
          break;
        }
        default: {
          withdrawalAddress = (new Wallet(this.ch.decryptKey())).getAddress();
        }
      }
      const options = {
        returnAddress: backupAddress
      };
      shapeshift.shift(withdrawalAddress, pair, options, (err, returnData) => {
        if (!err) {
          const depositAddress = returnData.deposit;
          observer.next({ depositAddress: depositAddress });
          shapeshift.status(depositAddress, (err2, status, data) => {
            if (status === 'no_deposits') {
              this.ch.sendTransaction(deposit.toUpperCase(), amount, depositAddress)
              .then((txReceipt) => {
                observer.next({ txReceipt: txReceipt });
                let ticks = 0;
                const timerID = setInterval(() => {
                  if (ticks % 8 === 0) {
                    shapeshift.status(depositAddress, (err4, innerStatus, innerData) => {
                      if (innerStatus === 'received') {
                        observer.next('received');
                      } else if (innerStatus === 'complete') {
                        observer.next({ finalReceipt: innerData.transaction });
                        clearInterval(timerID);
                        observer.complete();
                      } else if (innerStatus === 'failed') {
                        observer.error(err4);
                      }
                    });
                  }
                  ticks++;
                }, 1000);
              })
              .catch((err3) => {
                observer.error(err3);
              });
            } else {
              observer.error(err2);
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
        case 'BTC': {
          backupAddress = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
          break;
        }
        default: {
          backupAddress = (new Wallet(this.ch.decryptKey())).getAddress();
        }
      }
      const options = {
        returnAddress: backupAddress,
        amount: amount
      };
      shapeshift.shift(withdrawalAddress, pair, options, (err, returnData) => {
        if (!err) {
          resolve({
            type: deposit.toUppwerCase(),
            depositAmount: returnData.depositAmount,
            depositAddress: returnData.deposit,
            expiration: returnData.expiration,
            quotedRate: returnData.quotedRate
          });
        } else {
          reject(err);
        }
      });
    });
  }

  honorPreciseQuote(dataPack) {
    return new Observable((observer) => {
      const { type, depositAmount, depositAddress } = dataPack;
      shapeshift.status(depositAddress, (err, status, data) => {
        if (status === 'no_deposits') {
          this.ch.sendTransaction(type, depositAmount, depositAddress)
          .then((txReceipt) => {
            observer.next(txReceipt);
            let ticks = 0;
            const timerID = setInterval(() => {
              if (ticks % 8 === 0) {
                shapeshift.status(depositAddress, (innerError, innerStatus, innerData) => {
                  if (innerStatus === 'received') {
                    observer.next('received');
                  } else if (innerStatus === 'complete') {
                    observer.next(innerData.transaction);
                    clearInterval(timerID);
                    observer.complete();
                  } else if (innerStatus === 'failed') {
                    observer.error(innerError);
                  }
                });
              }
              ticks++;
            }, 1000);
          })
          .catch((promiseError) => {
            observer.error(promiseError);
          });
        } else {
          observer.error(err);
        }
      });
    });
  }
}
