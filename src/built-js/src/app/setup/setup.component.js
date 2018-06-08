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
var crypto_helper_service_1 = require("../services/crypto-helper.service");
var router_1 = require("@angular/router");
var js_sha3_1 = require("js-sha3");
var ethers_1 = require("ethers");
var core_2 = require("@ngx-loading-bar/core");
var SetupComponent = /** @class */ (function () {
    function SetupComponent(ch, router, loadingBar) {
        this.ch = ch;
        this.router = router;
        this.loadingBar = loadingBar;
        this.selectedCoins = [];
        this.coinName = { class: '' };
        this.coinAbbr = { type: '' };
    }
    SetupComponent.prototype.ngOnInit = function () {
        this.coins = this.ch.coins;
    };
    SetupComponent.prototype.selectCoin = function (e, coin, index) {
        e.preventDefault();
        if (this.coins[index].selected === undefined) {
            this.selectedCoins.push(coin);
            this.coins[index].selected = true;
        }
        else if (this.coins[index].selected) {
            this.selectedCoins = this.selectedCoins.filter(function (item) { return item.class !== coin.class; });
            this.coins[index].selected = false;
        }
        else {
            this.selectedCoins.push(coin);
            this.coins[index].selected = true;
        }
    };
    SetupComponent.prototype.saveSettings = function () {
        var obj = {
            coins: this.selectedCoins
        };
        this.coins.forEach(function (el) { el.selected = false; });
        localStorage.setItem('preferences-' + js_sha3_1.keccak_256(this.ch.decryptKey()), JSON.stringify(obj));
        this.router.navigate(['dashboard/wallet/']);
    };
    SetupComponent.prototype.toJSON = function () {
        var _this = this;
        var obj = {
            coins: this.selectedCoins
        };
        localStorage.setItem('preferences-' + js_sha3_1.keccak_256(this.ch.decryptKey()), JSON.stringify(obj));
        var p_key = this.ch.decryptKey();
        var password = localStorage.getItem('pass');
        var wallet = new ethers_1.Wallet(p_key);
        this.loadingBar.start();
        var encryptPromise = wallet.encrypt(password);
        encryptPromise.then(function (json) {
            _this.loadingBar.complete();
            json = JSON.parse(json);
            json.dashSettings = JSON.parse(localStorage.getItem('preferences-' + js_sha3_1.keccak_256(_this.ch.decryptKey())));
            json = JSON.stringify(json);
            var toDownload = new Blob([json], { type: 'application/json' });
            var link = window.URL.createObjectURL(toDownload);
            var a = document.createElement('a');
            a.href = link;
            a.download = 'keystore.json';
            a.click();
            _this.clicked = true;
        });
    };
    SetupComponent.prototype.alreadyExists = function (type) {
        return document.querySelectorAll('.' + type + '-identifier').length == 0;
    };
    SetupComponent = __decorate([
        core_1.Component({
            selector: 'app-setup',
            templateUrl: './setup.component.html',
            styleUrls: ['./setup.component.scss']
        }),
        __metadata("design:paramtypes", [crypto_helper_service_1.CryptoHelperService, router_1.Router, core_2.LoadingBarService])
    ], SetupComponent);
    return SetupComponent;
}());
exports.SetupComponent = SetupComponent;
//# sourceMappingURL=setup.component.js.map