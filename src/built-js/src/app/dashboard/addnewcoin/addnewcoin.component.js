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
var crypto_helper_service_1 = require("../../services/crypto-helper.service");
var router_1 = require("@angular/router");
var js_sha3_1 = require("js-sha3");
var AddnewcoinComponent = /** @class */ (function () {
    function AddnewcoinComponent(ch, router) {
        this.ch = ch;
        this.router = router;
        this.selectedCoins = [];
        this.coinName = { class: '' };
        this.coinAbbr = { type: '' };
    }
    AddnewcoinComponent.prototype.ngOnInit = function () {
        this.coins = this.ch.coins;
        this.selectedCoins = JSON.parse(localStorage.getItem('preferences-' + js_sha3_1.keccak_256(this.ch.decryptKey()))).coins;
        for (var i = 0; i < this.selectedCoins.length; i++) {
            for (var j = 0; j < this.coins.length; j++) {
                if (this.selectedCoins[i].type === this.coins[j].type) {
                    this.coins[j].selected = true;
                }
            }
        }
    };
    AddnewcoinComponent.prototype.selectCoin = function (e, coin, index) {
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
    AddnewcoinComponent.prototype.saveSettings = function () {
        var obj = {
            coins: this.selectedCoins
        };
        this.coins.forEach(function (el) { el.selected = false; });
        localStorage.setItem('preferences-' + js_sha3_1.keccak_256(this.ch.decryptKey()), JSON.stringify(obj));
        this.router.navigate(['/dashboard/wallet/']);
    };
    AddnewcoinComponent.prototype.alreadyExists = function (type) {
        return document.querySelectorAll('.' + type + '-identifier').length == 0;
    };
    AddnewcoinComponent = __decorate([
        core_1.Component({
            selector: 'app-addnewcoin',
            templateUrl: './addnewcoin.component.html',
            styleUrls: ['./addnewcoin.component.scss']
        }),
        __metadata("design:paramtypes", [crypto_helper_service_1.CryptoHelperService, router_1.Router])
    ], AddnewcoinComponent);
    return AddnewcoinComponent;
}());
exports.AddnewcoinComponent = AddnewcoinComponent;
//# sourceMappingURL=addnewcoin.component.js.map