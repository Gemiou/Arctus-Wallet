import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { keccak_256 } from 'js-sha3';
import { Wallet, utils } from 'ethers';
import { CryptoHelperService } from '../services/crypto-helper.service';
import * as blockstack from 'blockstack';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'app';
  loggedIn: Boolean = false;
  username = '';
  password = '';
  privateKey = '';
  JSONLogin = false;
  pklogin = false;
  loginscreen = true;
  loginShow = false;
  JSONPass = false;
  JSONSubmit = false;
  JSONFile: any;
  uploadInfo = 'Upload Keystore';

  constructor(private router: Router, private loadingBar: LoadingBarService, private ch: CryptoHelperService) {
  }

  ngOnInit() {
    if (blockstack.isUserSignedIn()) {
      this.beginBSLoading();
      blockstack.getFile('key.json').then((data) => {
        // Already saved
        console.log(data);
        if (data !== null) {
          const parsed = JSON.parse(data);
          this.ch.encryptKey('0x' + parsed.seed);
          localStorage.setItem('pass', '');
          const el = <HTMLScriptElement>document.querySelector('.container');
          el.style.opacity = '0';
          el.style.transform = 'scale(0.7)';
          el.style.pointerEvents = 'none';
          setTimeout(() => {
            if ( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) !== null ) {
              this.router.navigate(['/dashboard/wallet/']);
            } else {
              this.router.navigate(['/setup/']);
            }
          }, 1000);
        } else {
          console.log('Seed not found');
          const keySeed = keccak_256(utils.randomBytes(32));
          this.ch.encryptKey('0x' + keySeed);
          localStorage.setItem('pass', '');
          console.log("PASS: "+this.ch.decryptKey());
          blockstack.putFile('key.json', JSON.stringify({'seed': keySeed})).then(() => {
            // Saved successfully
            console.log("Seed successfully saved");
            const el = <HTMLScriptElement>document.querySelector('.container');
            el.style.opacity = '0';
            el.style.transform = 'scale(0.7)';
            el.style.pointerEvents = 'none';
            setTimeout(() => {
              if ( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) !== null ) {
                this.router.navigate(['/dashboard/wallet/']);
              } else {
                this.router.navigate(['/setup/']);
              }
            }, 1000);
          }).catch(() => {
            alert('An error occured while communicating with the Blockstack service.');
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function(userData) {
        window.location.replace(window.location.origin + '/login');
      });
    }
  }

  beginBSLoading() {
    setTimeout(() => {
      (<HTMLButtonElement>document.querySelector('.l-r')).style.opacity = '0.5';
      let element = document.querySelector('.blockstack span');
      element.innerHTML = 'Please Wait';
      this.rewriteLoad(element);
    }, 100);
  }

  rewriteLoad(element) {
    setTimeout(() => {
      element.innerHTML = (element.innerHTML.indexOf('.') + 2 === element.innerHTML.lastIndexOf('.')) ? 'Please Wait' : element.innerHTML + '.';
      this.rewriteLoad(element);
    }, 500);
  }

  blockstackLogin(){
    // blockstack.signUserOut('google.com');
    console.log('blockstack, is user logged in:', blockstack.isUserSignedIn());
    if (!blockstack.isUserSignedIn()) {
      blockstack.redirectToSignIn(`${window.location.origin}/login`, `${window.location.origin}/assets/js/manifest.json`);
    }
  }

  showNumpad(e) {
    e.preventDefault();
    if (this.username === '' || this.password === '') {
      alert('ERROR: Username / Password cannot be empty');
      return;
    }
    const el = <HTMLScriptElement>document.querySelector('.container');
    el.style.opacity = '0';
    el.style.transform = 'scale(0.7)';
    el.style.pointerEvents = 'none';
    this.savePrivateKey(this.username, this.password);
    setTimeout(() => {
      if ( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) !== null ) {
        this.router.navigate(['/dashboard/wallet/']);
      } else {
        this.router.navigate(['/setup/']);
      }
    }, 1000);
  }

  savePrivateKey(username, password) {
    let k_pass;
    if (!this.pklogin) {
      k_pass = keccak_256(password);
      const key = username + k_pass;
      this.privateKey = keccak_256(key);
    }
    this.ch.encryptKey('0x' + this.privateKey);
    localStorage.setItem('pass', k_pass);
  }

  pkLoginToggle() {
    this.loginShow = false;
    this.pklogin = !this.pklogin;
    this.JSONLogin = false;
    this.loginscreen = false;
    this.uploadInfo = 'Upload Keystore';
  }


  onFileChange(event) {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.JSONFile = (<any>e).target.result;
    };

    reader.readAsText(event.target.files[0]);
    this.JSONPass = true;
    this.uploadInfo = event.target.files[0].name;
  }

  onPassChange(event) {
    this.JSONSubmit = true;
  }

  loginWithJSON() {
    const pass = keccak_256(this.password);
    this.loadingBar.start();
    this.JSONFile = JSON.parse(this.JSONFile);
    const preferences = this.JSONFile.dashSettings;
    delete this.JSONFile['dashSettings'];
    this.JSONFile = JSON.stringify(this.JSONFile);
    Wallet.fromEncryptedWallet(this.JSONFile, pass).then((wallet) => {
      this.loadingBar.complete();
      this.ch.encryptKey(wallet.privateKey);
      if (preferences !== undefined) {
        localStorage.setItem( 'preferences-' + keccak_256( this.ch.decryptKey()) , JSON.stringify(preferences));
      }
      const el = <HTMLScriptElement>document.querySelector('.container');
      el.style.opacity = '0';
      el.style.transform = 'scale(0.7)';
      el.style.pointerEvents = 'none';
      setTimeout(() => {
        if ( localStorage.getItem( 'preferences-' + keccak_256( this.ch.decryptKey() ) ) !== null ) {
          this.router.navigate(['/dashboard/wallet/']);
        } else {
          this.router.navigate(['/setup/']);
        }
      }, 1000);
    }).catch((err) => {
      if (err.toString().indexOf('invalid password') !== -1) {
        // Show error message for password
        console.log(err);
      } else {
        // Show error message for invalid JSON
        console.log(err);
      }
    });
  }

  loginFromSite(){
    this.loginscreen = false;
    this.loginShow = true;
  }

  toJSONToggle() {
    this.JSONLogin = true;
    this.loginscreen = false;
    this.loginShow = false;
    this.pklogin = false;
    this.uploadInfo = 'Upload Keystore';
    this.password = '';
  }

  toLogin() {
    this.loginscreen = true;
    this.loginShow = false;
    this.JSONLogin = false;
    this.pklogin = false;
    this.uploadInfo = 'Upload Keystore';
    this.password = '';
  }
}
