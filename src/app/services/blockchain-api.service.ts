import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class BlockchainAPIService {

  constructor(private http: Http) { }

  getTXInfo(address) {
    const options = new RequestOptions({ headers: null, withCredentials: false });
    return this.http.get(`https://blockchain.info/el/unspent?cors=true&active=${address}`, options).toPromise();
  }

  getBalance(address) {

  }

  calculateTransaction(unspent, wallet, targetAddress, amount) {
    this.http.get('https://bitcoinfees.earn.com/api/v1/fees/recommended').toPromise()
    .then((feesPerSpeed) => {
      const feePerKByte = JSON.parse((<any>feesPerSpeed)._body).halfHourFee;
      const tx = new bitcoin.TransactionBuilder();
      for (let i = 0; i < unspent.length; i++) {
        for (let j = i + 1; j < unspent.length; j++) {
          if (unspent[i].value < unspent[j].value) {
            const temp = unspent[i];
            unspent[i] = unspent[j];
            unspent[j] = temp;
          }
        }
      }
      let total = 0;
      const outs = 2;
      let ins;
      for (ins = 0; ins < unspent.length; ins++) {
        total += unspent[ins].value;
        tx.addInput(unspent[ins].tx_hash_big_endian, unspent[ins].tx_output_n);
        if (total > amount + (this.getTXByteLength(ins, outs) * <any>feePerKByte)) {
          break;
        }
      }
      tx.addOutput(targetAddress, amount);
      tx.addOutput(wallet.getAddress(), total - (amount + (this.getTXByteLength(ins, outs) * <any>feePerKByte)));
      tx.sign(0, wallet);
      return Promise.resolve(tx.build().toHex());
    }).catch((err) => {
      console.log(err);
      return undefined;
    });
  }

  pushTransaction(tx) {
    const options = new RequestOptions({ headers: null, withCredentials: false });
    return this.http.post(
      `https://blockchain.info/pushtx?cors=true&tx=${tx}`,
      options
    ).toPromise();
  }

  getTXByteLength(ins, outs) {
    return (ins * 180 + outs * 34 + 10 + 5);
  }
}
