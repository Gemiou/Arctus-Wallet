import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet, Contract, providers, utils } from 'ethers';
import { CryptoHelperService } from '../../services/crypto-helper.service';
import * as bigi from 'bigi';
import * as bitcoin from 'bitcoinjs-lib';


@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  addressFrom = '';
  coinName = '';
  recipientAddress = '';
  coinAmount = 0;
  gasPrice = 0;
  callData = '0x';
  userWallet: Wallet;
  gasAmount = 21000;

  constructor(private route: ActivatedRoute, private routing: Router, private ch: CryptoHelperService) {
    this.route.params.subscribe((params) => {
      this.addressFrom = params.address;
      this.coinName = params.coinName;
      if (this.coinName !== 'ETH') {
        this.gasAmount = 200000;
      }
    });
   }

  ngOnInit() {
    const mainProvider = new providers.InfuraProvider('homestead', 'Mohcm5md9NBp71v7gHjv');
    mainProvider.getGasPrice().then((res) => {
      this.gasPrice = utils.formatUnits(res, 'gwei');
      (<HTMLInputElement>document.getElementById('gasPrice')).value = this.gasPrice + '';
      document.getElementById('gasPrice').dispatchEvent(new Event('input'));
    });
    // console.log(this.ch.decryptKey());
    this.userWallet = new Wallet(this.ch.decryptKey(), mainProvider);
  }


  startTransaction() {
    this.gasAmount = parseInt(this.gasAmount + "");
    if (this.coinName === 'ETH') {
      const weiAmount = utils.parseEther(this.coinAmount);
      this.userWallet.send(this.recipientAddress, weiAmount, {
        gasPrice: utils.bigNumberify(utils.parseUnits(this.gasPrice, 'gwei')),
        gasLimit: this.gasAmount,
        data: this.callData
      }).then((txReceipt) => {
        // console.log(txReceipt);
        this.routing.navigate(['/dashboard/txhash', txReceipt]);
      }).catch((err) => {
        console.log(err);
      });
    } else if (this.coinName === 'BTC') {
      // Not supported yet
    } else {
      let index = 0;
      this.ch.coins.forEach((el, i) => {
        if (el.type === this.coinName) {
          index = i;
        }
      });
      const tokenAmount = (this.coinAmount * Math.pow(10, this.ch.coins[index].decimals)) || 0;
      const tokenContract = new Contract(this.ch.coins[index].tokenAddress, this.ch.erc20ABI, this.userWallet);
      tokenContract.transfer(this.recipientAddress, tokenAmount, {
        gasPrice: utils.bigNumberify(utils.parseUnits(this.gasPrice, 'gwei')),
        gasLimit: this.gasAmount
      }).then((txReceipt) => {
        // console.log(txReceipt);
        this.routing.navigate(['/dashboard/txhash', txReceipt]);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  toggleLock() {
    const el = document.querySelector('.locked');
    el.classList.toggle('typcn-lock-open');
    el.classList.toggle('typcn-lock-closed');
    (<HTMLInputElement>el.parentElement.firstElementChild).disabled = !(<HTMLInputElement>el.parentElement.firstElementChild).disabled;
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

  filterPrice(e) {
    let current = e.target.value + '';
    current = current.replace(/[^0-9.]*/g, '');
    while (current.indexOf('.') !== current.lastIndexOf('.')) {
      current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
    }
    e.target.value = current + ' Gwei';
    e.target.setSelectionRange(e.target.value.length, e.target.value.length - ' Gwei'.length);
    e.target.parentElement.classList.add('has-success');
  }

  filterAmount(e) {
    let current = e.target.value + '';
    current = current.replace(/[^0-9]*/g, '');
    e.target.value = Number(current);
    if (Number(current) >= 2100) {
      e.target.parentElement.classList.remove('has-danger');
      e.target.parentElement.classList.add('has-success');
    } else {
      e.target.parentElement.classList.add('has-danger');
      e.target.parentElement.classList.remove('has-success');
    }
  }

  filterCallcode(e) {
    let current = e.target.value;
    current = current.replace(/^0x/, '').replace(/[^a-fA-F0-9]*/g, '');
    e.target.value = '0x' + current;
  }

  filterEther(e) {
    let current = e.target.value;
    current = current.replace(/$[^0-9.,]*/g, '');
    while (current.indexOf(',') !== current.lastIndexOf(',')) {
      current = current.substring(0, current.indexOf(',')) + current.substring(current.indexOf(',') + 1);
    }
    while (current.indexOf('.') !== current.lastIndexOf('.')) {
      current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
    }
    if (current.indexOf(',') > current.indexOf('.')) {
      current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
    } else {
      current = current.substring(0, current.indexOf(',')) + current.substring(current.indexOf(',') + 1);
    }
    if (current.indexOf('0') === 0 && current.length > 1) {
      current = current.substring(1);
    }
    e.target.value = current;
    current = current.replace(/,/, '.');
    if (Number(current) > 0) {
      e.target.parentElement.classList.remove('has-danger');
      e.target.parentElement.classList.add('has-success');
    } else {
      e.target.parentElement.classList.add('has-danger');
      e.target.parentElement.classList.remove('has-success');
    }
  }
}