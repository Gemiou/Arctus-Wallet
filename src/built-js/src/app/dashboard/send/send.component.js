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
var ethers_1 = require("ethers");
var crypto_helper_service_1 = require("../../services/crypto-helper.service");
var SendComponent = /** @class */ (function () {
    function SendComponent(route, routing, ch) {
        var _this = this;
        this.route = route;
        this.routing = routing;
        this.ch = ch;
        this.addressFrom = '';
        this.coinName = '';
        this.recipientAddress = '';
        this.coinAmount = 0;
        this.gasPrice = 0;
        this.callData = '0x';
        this.gasAmount = 21000;
        this.route.params.subscribe(function (params) {
            _this.addressFrom = params.address;
            _this.coinName = params.coinName;
            if (_this.coinName !== 'ETH') {
                _this.gasAmount = 200000;
            }
        });
    }
    SendComponent.prototype.ngOnInit = function () {
        var _this = this;
        var mainProvider = new ethers_1.providers.InfuraProvider('homestead', 'Mohcm5md9NBp71v7gHjv');
        mainProvider.getGasPrice().then(function (res) {
            _this.gasPrice = ethers_1.utils.formatUnits(res, 'gwei');
            document.getElementById('gasPrice').value = _this.gasPrice + '';
            document.getElementById('gasPrice').dispatchEvent(new Event('input'));
        });
        // console.log(this.ch.decryptKey());
        this.userWallet = new ethers_1.Wallet(this.ch.decryptKey(), mainProvider);
    };
    SendComponent.prototype.startTransaction = function () {
        var _this = this;
        this.gasAmount = parseInt(this.gasAmount + "");
        if (this.coinName === 'ETH') {
            var weiAmount = ethers_1.utils.parseEther(this.coinAmount);
            this.userWallet.send(this.recipientAddress, weiAmount, {
                gasPrice: ethers_1.utils.bigNumberify(ethers_1.utils.parseUnits(this.gasPrice, 'gwei')),
                gasLimit: this.gasAmount,
                data: this.callData
            }).then(function (txReceipt) {
                // console.log(txReceipt);
                _this.routing.navigate(['/dashboard/txhash', txReceipt]);
            }).catch(function (err) {
                console.log(err);
            });
        }
        else if (this.coinName === 'BTC') {
            // Not supported yet
        }
        else {
            var index_1 = 0;
            this.ch.coins.forEach(function (el, i) {
                if (el.type === _this.coinName) {
                    index_1 = i;
                }
            });
            var tokenAmount = (this.coinAmount * Math.pow(10, this.ch.coins[index_1].decimals)) || 0;
            var tokenContract = new ethers_1.Contract(this.ch.coins[index_1].tokenAddress, this.ch.erc20ABI, this.userWallet);
            tokenContract.transfer(this.recipientAddress, tokenAmount, {
                gasPrice: ethers_1.utils.bigNumberify(ethers_1.utils.parseUnits(this.gasPrice, 'gwei')),
                gasLimit: this.gasAmount
            }).then(function (txReceipt) {
                // console.log(txReceipt);
                _this.routing.navigate(['/dashboard/txhash', txReceipt]);
            }).catch(function (err) {
                console.log(err);
            });
        }
    };
    SendComponent.prototype.toggleLock = function () {
        var el = document.querySelector('.locked');
        el.classList.toggle('typcn-lock-open');
        el.classList.toggle('typcn-lock-closed');
        el.parentElement.firstElementChild.disabled = !el.parentElement.firstElementChild.disabled;
    };
    SendComponent.prototype.filterAddress = function (e) {
        var current = e.target.value.replace(/^0x/, '');
        current = current.replace(/[^a-fA-F0-9]*/g, '').substring(0, 40);
        e.target.value = '0x' + current;
        current = e.target.value;
        if (/^0x[a-fA-F0-9]{40}$/.test(current)) {
            e.target.parentElement.classList.remove('has-danger');
            e.target.parentElement.classList.add('has-success');
        }
        else {
            e.target.parentElement.classList.add('has-danger');
            e.target.parentElement.classList.remove('has-success');
        }
    };
    SendComponent.prototype.filterPrice = function (e) {
        var current = e.target.value + '';
        current = current.replace(/[^0-9.]*/g, '');
        while (current.indexOf('.') !== current.lastIndexOf('.')) {
            current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
        }
        e.target.value = current + ' Gwei';
        e.target.setSelectionRange(e.target.value.length, e.target.value.length - ' Gwei'.length);
        e.target.parentElement.classList.add('has-success');
    };
    SendComponent.prototype.filterAmount = function (e) {
        var current = e.target.value + '';
        current = current.replace(/[^0-9]*/g, '');
        e.target.value = Number(current);
        if (Number(current) >= 2100) {
            e.target.parentElement.classList.remove('has-danger');
            e.target.parentElement.classList.add('has-success');
        }
        else {
            e.target.parentElement.classList.add('has-danger');
            e.target.parentElement.classList.remove('has-success');
        }
    };
    SendComponent.prototype.filterCallcode = function (e) {
        var current = e.target.value;
        current = current.replace(/^0x/, '').replace(/[^a-fA-F0-9]*/g, '');
        e.target.value = '0x' + current;
    };
    SendComponent.prototype.filterEther = function (e) {
        var current = e.target.value;
        current = current.replace(/$[^0-9.,]*/g, '');
        while (current.indexOf(',') !== current.lastIndexOf(',')) {
            current = current.substring(0, current.indexOf(',')) + current.substring(current.indexOf(',') + 1);
        }
        while (current.indexOf('.') !== current.lastIndexOf('.')) {
            current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
        }
        if (current.indexOf(',') > current.indexOf('.')) {
            current = current.substring(0, current.indexOf('.')) + current.substring(current.indexOf('.') + 1);
        }
        else {
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
        }
        else {
            e.target.parentElement.classList.add('has-danger');
            e.target.parentElement.classList.remove('has-success');
        }
    };
    SendComponent = __decorate([
        core_1.Component({
            selector: 'app-send',
            templateUrl: './send.component.html',
            styleUrls: ['./send.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, crypto_helper_service_1.CryptoHelperService])
    ], SendComponent);
    return SendComponent;
}());
exports.SendComponent = SendComponent;
//# sourceMappingURL=send.component.js.map