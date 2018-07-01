import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CryptoHelperService } from './crypto-helper.service';
import * as shapeshift from 'shapeshift.io';
import { Wallet, utils } from 'ethers';
import * as bigi from 'bigi';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class ShapeShiftHelperService {
  // tslint:disable-next-line:max-line-length
  SS_API_KEY: String = '7484d44af8a70175708bf99b57f60eb3b3e47429989fcaeca50b91f94c725d488ed7bdcf7b896aa17b7e19cb09d0d4201a3468032eca3b512f97ba5544352cbb';

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

  shiftTokens(deposit, receive, amount, receiveAddress ?: any) {
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
        returnAddress: backupAddress,
        apiKey: this.SS_API_KEY
      };
      if (receiveAddress !== undefined) {
        withdrawalAddress = receiveAddress;
      }
      observer.next({ depositAddress: '0x0000000000000000000000000000000000000000' });
      setTimeout(async () => {
        await new Promise((resolve, reject) => setTimeout(() => {resolve()}, 15000));
        observer.next({ txReceipt: { hash: '0xbcb283ab70f4fbf38404cf373530d92bab2910118e78ac67afeb312c0e7ce193' } });
        await new Promise((resolve, reject) => setTimeout(() => {resolve()}, 15000));
        observer.next('received');
        await new Promise((resolve, reject) => setTimeout(() => {resolve()}, 15000));
        observer.next({ finalReceipt: '0xdb4c71d99aaaa49f12a86022568005438aff7156691bc57a1e7e361b2b02e7fa' });
        observer.complete();
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
        amount: amount,
        apiKey: this.SS_API_KEY
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
