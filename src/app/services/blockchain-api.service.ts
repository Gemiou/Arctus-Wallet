import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

@Injectable()
export class BlockchainAPIService {

  constructor(private http: Http) { }

  getTXInfo(address) {
    let options = new RequestOptions({ headers: null, withCredentials: true });
    this.http.get(`https://blockchain.info/el/unspent?active=${address}`, options).subscribe(
      txArray => {
        console.log(txArray);
      },
      err => {
        console.log(err);
      }
    );
  }

  getBalance(address) {

  }

  calculateTransaction(unspent, amount) {

  }

  pushTransaction(tx) {

  }
}
