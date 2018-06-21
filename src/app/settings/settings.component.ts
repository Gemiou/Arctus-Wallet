import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Wallet, utils } from 'ethers';
import { CryptoHelperService } from '../services/crypto-helper.service';
import { keccak_256 } from 'js-sha3';
import * as blockstack from 'blockstack';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  inactive = false;
  active = false;
  shouldHaveJSON: Boolean = true;
  constructor(private router: Router, private loadingBar: LoadingBarService, private ch: CryptoHelperService) { }

  ngOnInit() {
    if (!localStorage.getItem('pass-' + keccak_256(this.ch.decryptKey()))) {
      this.shouldHaveJSON = false;
    }
  }

  logout() {
    localStorage.removeItem('seed');
    localStorage.removeItem('pass');
    if (blockstack.isUserSignedIn()) {
      blockstack.signUserOut('https://wallet.arctus.io/login/');
    } else {
      this.router.navigate(['/login/']);
    }
  }

  toJSON() {
    const p_key = this.ch.decryptKey();
    const password = localStorage.getItem('pass-' + keccak_256(this.ch.decryptKey()));
    const wallet = new Wallet(p_key);
    this.loadingBar.start();
    const encryptPromise = wallet.encrypt(password);
    encryptPromise.then((json) => {
      this.loadingBar.complete();
      json = JSON.parse(json);
      json.dashSettings = JSON.parse(localStorage.getItem('preferences-' + localStorage.getItem('username')));
      json = JSON.stringify(json);
      const toDownload = new Blob([json], { type: 'application/json' });
      const link = window.URL.createObjectURL(toDownload);
      const a = <HTMLAnchorElement>document.getElementById('download');
      a.href = link;
      a.download = 'keystore.json';
      a.click();
    });
  }
  redirectToFAQ() {
    window.location.href = 'https://www.arctus.io/FAQ';
  }
  
  isMobile() {
    return document.querySelectorAll('.mobile').length !== 0;
  }
}
