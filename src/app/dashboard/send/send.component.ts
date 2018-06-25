import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet, Contract, providers, utils } from 'ethers';
import { CryptoHelperService } from '../../services/crypto-helper.service';
import { BlockchainAPIService } from '../../services/blockchain-api.service';
import { SharedDataService } from '../../services/shared-data.service';
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
  userBalance = 0;
  txHash  = false;
  txHashString = '';
  @Input() coinSend: string;
  @Input() addressSend: string;
  @Output() sendModal = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private routing: Router,
    private ch: CryptoHelperService,
    private bc: BlockchainAPIService,
    private shData: SharedDataService
  ) { }

  ngOnInit() {
    this.addressFrom = this.addressSend;
      this.coinName = this.coinSend;
      if (this.coinName !== 'ETH') {
        this.gasAmount = 200000;
      }
    this.userBalance = this.shData.coinBalance.getValue();
    if (this.coinName === 'BTC') {
      this.userWallet = new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)));
    } else {
      const mainProvider = new providers.InfuraProvider('homestead', 'Mohcm5md9NBp71v7gHjv');
      mainProvider.getGasPrice().then((res) => {
        this.gasPrice = utils.formatUnits(res, 'gwei');
      });
      this.userWallet = new Wallet(this.ch.decryptKey(), mainProvider);
    }
  }


  startTransaction() {
    this.gasAmount = parseInt(this.gasAmount + '', 10);
    if (this.coinName === 'ETH') {
      const weiAmount = utils.parseEther(this.coinAmount + '');
      this.userWallet.send(this.recipientAddress.trim(), weiAmount)
      .then((txReceipt) => {
        this.txHash = true;
        this.txHashString =txReceipt.hash;
      }).catch((err) => {
        console.log(err);
      });
    } else if (this.coinName === 'BTC') {
      this.recipientAddress = this.recipientAddress.trim();
      this.bc.getTXInfo(this.userWallet.getAddress())
      .then((txArray) => {
        return this.bc.calculateTransaction(txArray, this.userWallet, this.recipientAddress, this.coinAmount * Math.pow(10, 8));
      })
      .then((tx) => {
        console.log(tx);
        return this.bc.pushTransaction(tx);
      })
      .then((res) => {
        if ((<any>res)._body.indexOf('dust') !== -1) {
          // This means that user has put a low amount to transfer / spamming attack
        } else {
          this.txHash = true;
          this.txHashString = (<any>res)._body;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      let coin;
      this.ch.coins.forEach((el) => {
        if (el.type === this.coinName) {
          coin = el;
        }
      });

      if (coin === undefined) {
        coin = this.shData.currentCoin.getValue();
      }

      const tokenAmount = utils.bigNumberify(this.coinAmount).mul(utils.bigNumberify(10).pow(coin.realDecimals));
      const tokenContract = new Contract(coin.tokenAddress, this.ch.erc20ABI, this.userWallet);
      tokenContract.transfer(this.recipientAddress, tokenAmount, {
        gasPrice: utils.bigNumberify(utils.parseUnits(this.gasPrice, 'gwei')),
        gasLimit: this.gasAmount
      }).then((txReceipt) => {
        this.routing.navigate(['/dashboard/txhash/', txReceipt.hash]);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  filterAddress(e) {
    if (this.coinName === 'BTC') {
      this.filterBTCAddress(e);
    } else {
      this.filterETHAddress(e);
    }
  }

  filterBTCAddress(e) {
    let current = e.target.value;
    current = current.replace(/[^a-zA-Z0-9]*/g, '').substring(0, 34);
    try {
      e.target.parentElement.classList.remove('has-danger');
      e.target.parentElement.classList.add('has-success');
    } catch (err) {
      e.target.parentElement.classList.add('has-danger');
      e.target.parentElement.classList.remove('has-success');
    }
    e.target.value = current;
    this.recipientAddress = current;
  }

  filterETHAddress(e) {
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
    this.recipientAddress = current;
  }

  close() {
    // close the modal
    this.sendModal.emit(false);
  }
}
