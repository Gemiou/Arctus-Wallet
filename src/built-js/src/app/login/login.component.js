"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var core_2 = require("@ngx-loading-bar/core");
var js_sha3_1 = require("js-sha3");
var ethers_1 = require("ethers");
var crypto_helper_service_1 = require("../services/crypto-helper.service");
var blockstack = require("blockstack");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, loadingBar, ch) {
        this.router = router;
        this.loadingBar = loadingBar;
        this.ch = ch;
        this.title = 'app';
        this.loggedIn = false;
        this.username = '';
        this.password = '';
        this.privateKey = '';
        this.JSONLogin = false;
        this.pklogin = false;
        this.loginscreen = true;
        this.loginShow = false;
        this.JSONPass = false;
        this.JSONSubmit = false;
        this.uploadInfo = 'Upload Keystore';
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (blockstack.isUserSignedIn()) {
            blockstack.getFile('key.json').then(function (data) {
                // Already saved
                console.log(data);
                if (data !== null) {
                    var parsed = JSON.parse(data);
                    _this.ch.encryptKey('0x' + parsed.seed);
                    localStorage.setItem('pass', '');
                    var el = document.querySelector('.container');
                    el.style.opacity = '0';
                    el.style.transform = 'scale(0.7)';
                    el.style.pointerEvents = 'none';
                    setTimeout(function () {
                        if (localStorage.getItem('preferences-' + js_sha3_1.keccak_256(_this.ch.decryptKey())) !== null) {
                            _this.router.navigate(['/dashboard/wallet/']);
                        }
                        else {
                            _this.router.navigate(['/setup/']);
                        }
                    }, 1000);
                }
                else {
                    console.log('Seed not found');
                    var keySeed = js_sha3_1.keccak_256(ethers_1.utils.randomBytes(32));
                    _this.ch.encryptKey('0x' + keySeed);
                    localStorage.setItem('pass', '');
                    console.log("PASS: " + _this.ch.decryptKey());
                    blockstack.putFile('key.json', JSON.stringify({ 'seed': keySeed })).then(function () {
                        // Saved successfully
                        console.log("Seed successfully saved");
                        var el = document.querySelector('.container');
                        el.style.opacity = '0';
                        el.style.transform = 'scale(0.7)';
                        el.style.pointerEvents = 'none';
                        setTimeout(function () {
                            if (localStorage.getItem('preferences-' + js_sha3_1.keccak_256(_this.ch.decryptKey())) !== null) {
                                _this.router.navigate(['/dashboard/wallet/']);
                            }
                            else {
                                _this.router.navigate(['/setup/']);
                            }
                        }, 1000);
                    }).catch(function () {
                        alert('An error occured while communicating with the Blockstack service.');
                    });
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
        else if (blockstack.isSignInPending()) {
            blockstack.handlePendingSignIn().then(function (userData) {
                window.location.replace(window.location.origin + '/login');
            });
        }
    };
    LoginComponent.prototype.blockstackLogin = function () {
        // blockstack.signUserOut('google.com');
        console.log('blockstack, is user logged in:', blockstack.isUserSignedIn());
        if (!blockstack.isUserSignedIn()) {
            blockstack.redirectToSignIn(window.location.origin + "/login", window.location.origin + "/assets/js/manifest.json");
        }
    };
    LoginComponent.prototype.showNumpad = function (e) {
        var _this = this;
        e.preventDefault();
        var el = document.querySelector('.container');
        el.style.opacity = '0';
        el.style.transform = 'scale(0.7)';
        el.style.pointerEvents = 'none';
        this.savePrivateKey(this.username, this.password);
        setTimeout(function () {
            if (localStorage.getItem('preferences-' + js_sha3_1.keccak_256(_this.ch.decryptKey())) !== null) {
                _this.router.navigate(['/dashboard/wallet/']);
            }
            else {
                _this.router.navigate(['/setup/']);
            }
        }, 1000);
    };
    LoginComponent.prototype.savePrivateKey = function (username, password) {
        var k_pass;
        if (!this.pklogin) {
            k_pass = js_sha3_1.keccak_256(password);
            var key = username + k_pass;
            this.privateKey = js_sha3_1.keccak_256(key);
        }
        this.ch.encryptKey('0x' + this.privateKey);
        localStorage.setItem('pass', k_pass);
    };
    LoginComponent.prototype.pkLoginToggle = function () {
        this.loginShow = false;
        this.pklogin = !this.pklogin;
        this.JSONLogin = false;
        this.loginscreen = false;
        this.uploadInfo = 'Upload Keystore';
    };
    LoginComponent.prototype.onFileChange = function (event) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            _this.JSONFile = e.target.result;
        };
        reader.readAsText(event.target.files[0]);
        this.JSONPass = true;
        this.uploadInfo = event.target.files[0].name;
    };
    LoginComponent.prototype.onPassChange = function (event) {
        this.JSONSubmit = true;
    };
    LoginComponent.prototype.loginWithJSON = function () {
        var _this = this;
        var pass = js_sha3_1.keccak_256(this.password);
        this.loadingBar.start();
        this.JSONFile = JSON.parse(this.JSONFile);
        var preferences = this.JSONFile.dashSettings;
        delete this.JSONFile['dashSettings'];
        this.JSONFile = JSON.stringify(this.JSONFile);
        ethers_1.Wallet.fromEncryptedWallet(this.JSONFile, pass).then(function (wallet) {
            _this.loadingBar.complete();
            _this.ch.encryptKey(wallet.privateKey);
            if (preferences !== undefined) {
                localStorage.setItem('preferences-' + js_sha3_1.keccak_256(_this.ch.decryptKey()), JSON.stringify(preferences));
            }
            var el = document.querySelector('.container');
            el.style.opacity = '0';
            el.style.transform = 'scale(0.7)';
            el.style.pointerEvents = 'none';
            setTimeout(function () {
                if (localStorage.getItem('preferences-' + js_sha3_1.keccak_256(_this.ch.decryptKey())) !== null) {
                    _this.router.navigate(['/dashboard/wallet/']);
                }
                else {
                    _this.router.navigate(['/setup/']);
                }
            }, 1000);
        }).catch(function (err) {
            if (err.toString().indexOf('invalid password') !== -1) {
                // Show error message for password
                console.log(err);
            }
            else {
                // Show error message for invalid JSON
                console.log(err);
            }
        });
    };
    LoginComponent.prototype.loginFromSite = function () {
        this.loginscreen = false;
        this.loginShow = true;
    };
    LoginComponent.prototype.toJSONToggle = function () {
        this.JSONLogin = true;
        this.loginscreen = false;
        this.loginShow = false;
        this.pklogin = false;
        this.uploadInfo = 'Upload Keystore';
        this.password = '';
    };
    LoginComponent.prototype.toLogin = function () {
        this.loginscreen = true;
        this.loginShow = false;
        this.JSONLogin = false;
        this.pklogin = false;
        this.uploadInfo = 'Upload Keystore';
        this.password = '';
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.Router, core_2.LoadingBarService, crypto_helper_service_1.CryptoHelperService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map