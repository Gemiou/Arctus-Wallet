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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var core_2 = require("@ngx-loading-bar/core");
var js_sha3_1 = require("js-sha3");
var crypto_helper_service_1 = require("../../services/crypto-helper.service");
var ethers_1 = require("ethers");
var bigi = require("bigi");
var bitcoin = require("bitcoinjs-lib");
var countUp = require("countup.js");
var Observable_1 = require("rxjs/Observable");
// import * as Chartjs from 'chart.js';
var WalletComponent = /** @class */ (function () {
    function WalletComponent(ch, http, router, loadingBar) {
        this.ch = ch;
        this.http = http;
        this.router = router;
        this.loadingBar = loadingBar;
        this.coins = [{
                type: ''
            }];
        this.balance = 10;
        this.value = 10000;
        this.selectedCoin = 0;
        this.sign = '$';
        this.USDtoEUR = 0;
        this.test = [];
        this.coinName = { class: '' };
        this.coinAbbr = { type: '' };
        this.generatedAddresses = {};
        this.showLoading = true;
        this.coinsLoaded = 0;
        if (this.ch.decryptKey() === null || this.ch.decryptKey() == "") {
            this.router.navigate(['/login/']);
        }
    }
    WalletComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadingBar.start();
        setTimeout(function () { return _this.executeGetters(); }, 10);
    };
    WalletComponent.prototype.executeGetters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var preferences, i, address;
            var _this = this;
            return __generator(this, function (_a) {
                preferences = JSON.parse(localStorage.getItem('preferences-' + js_sha3_1.keccak_256(this.ch.decryptKey())));
                for (i = 0; i < preferences.coins.length; i++) {
                    address = this.generateAddress(preferences.coins[i].type);
                    preferences.coins[i].address = address;
                }
                this.coins = preferences.coins;
                this.getUSDPrice();
                this.refreshUI(this.coins).subscribe(function (obj) {
                    // console.log(this.coins[(<any>obj).coin]);
                    _this.coins[obj.coin].balance =
                        Number(obj.balance === undefined ?
                            _this.coins[obj.coin].balance :
                            obj.balance / Math.pow(10, _this.coins[obj.coin].realDecimals));
                    _this.coins[obj.coin].value =
                        Number(obj.value === undefined ?
                            _this.coins[obj.coin].value :
                            obj.value * _this.coins[obj.coin].balance);
                }, function (err) { return console.log(err); }, function () {
                    _this.createCountUp(_this.selectedCoin);
                    _this.showLoading = false;
                    _this.loadingBar.complete();
                });
                return [2 /*return*/];
            });
        });
    };
    WalletComponent.prototype.getUSDPrice = function () {
        var _this = this;
        this.http.get('https://free.currencyconverterapi.com/api/v5/convert?q=USD_EUR&compact=y').subscribe(function (price) {
            _this.USDtoEUR = JSON.parse(price._body).USD_EUR.val;
        });
    };
    WalletComponent.prototype.refreshUI = function (coins) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var _loop_1 = function (i) {
                _this.ch.getCoinBalance(_this.coins[i].urlIndex, _this.coins[i].address, _this.coins[i].tokenAddress).then(function (res) {
                    var containerObj = {
                        coin: i,
                        balance: res
                    };
                    observer.next(containerObj);
                    return _this.ch.getCoinValue(_this.coins[i].urlIndex, _this.coins[i].tokenAddress);
                }).then(function (res) {
                    var containerObj = {
                        coin: i,
                        value: res
                    };
                    observer.next(containerObj);
                    _this.coinsLoaded++;
                    if (_this.coinsLoaded === coins.length) {
                        observer.complete();
                    }
                }).catch(function (err) {
                    observer.error(err);
                });
            };
            for (var i = 0; i < coins.length; i++) {
                _loop_1(i);
            }
        });
    };
    WalletComponent.prototype.generateAddress = function (type) {
        switch (type) {
            case 'ETH': {
                if (this.generatedAddresses.ETH === undefined) {
                    this.generatedAddresses.ETH = (new ethers_1.Wallet(this.ch.decryptKey())).getAddress();
                }
                return this.generatedAddresses.ETH;
            }
            case 'BTC': {
                if (this.generatedAddresses.BTC === undefined) {
                    this.generatedAddresses.BTC = (new bitcoin.ECPair(bigi.fromHex(this.ch.decryptKey().substring(2)))).getAddress();
                }
                return this.generatedAddresses.BTC;
            }
            default: {
                if (this.generatedAddresses.ETH === undefined) {
                    this.generatedAddresses.ETH = (new ethers_1.Wallet(this.ch.decryptKey())).getAddress();
                }
                return this.generatedAddresses.ETH;
            }
        }
    };
    WalletComponent.prototype.createCountUp = function (index) {
        var options = {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
        };
        var countAntimation = new countUp('count-up', (this.coins[this.selectedCoin].balance === undefined) ? 0 : this.coins[this.selectedCoin].balance, (this.coins[index].balance === undefined) ? 0 : this.coins[index].balance, this.coins[index].decimals, 1.5, options);
        if (!countAntimation.error) {
            countAntimation.start();
        }
        else {
            console.error(countAntimation.error);
        }
    };
    WalletComponent.prototype.makeActive = function (index) {
        this.createCountUp(index);
        this.selectedCoin = index;
    };
    WalletComponent.prototype.alreadyExists = function (type) {
        return document.querySelectorAll('.' + type + '-identifier').length == 0;
    };
    WalletComponent = __decorate([
        core_1.Component({
            selector: 'app-wallet',
            templateUrl: './wallet.component.html',
            styleUrls: ['./wallet.component.scss']
        }),
        __metadata("design:paramtypes", [crypto_helper_service_1.CryptoHelperService, http_1.Http, router_1.Router, core_2.LoadingBarService])
    ], WalletComponent);
    return WalletComponent;
}());
exports.WalletComponent = WalletComponent;
//# sourceMappingURL=wallet.component.js.map