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
var crypto_helper_service_1 = require("../../../services/crypto-helper.service");
var QrcodeComponent = /** @class */ (function () {
    function QrcodeComponent(ch) {
        this.ch = ch;
        this.info = '';
        this.QRCode = '';
        this.isValid = false;
        this.amountfromparent = 0;
    }
    QrcodeComponent.prototype.ngOnChanges = function (changeRecord) {
        var _this = this;
        var decimals = 0;
        this.ch.coins.forEach(function (el) {
            if (el.type === _this.coin) {
                decimals = el.realDecimals;
            }
        });
        if (this.coin !== 'ETH' && this.coin !== 'BTC') {
            this.isValid = false;
            this.info = 'Non-ETH/BTC transfers are not supported yet via a QR Code';
            return;
            // this.QRCode += '&mode=contract_function&functionSignature=';
        }
        else if (this.coin === 'ETH') {
            this.amount = changeRecord.amount.currentValue * Math.pow(10, decimals);
            this.QRCode = 'ethereum:' + this.address + '?value=' + this.amount;
            this.info = 'QR Code generated for ' + (this.amount / Math.pow(10, decimals)) + ' ' + this.coin;
        }
        else {
            this.amount = changeRecord.amount.currentValue;
            this.QRCode = 'bitcoin:' + this.address + '?value=' + this.amount;
            this.info = 'QR Code generated for ' + this.amount + ' ' + this.coin;
        }
        if (this.amount > 0) {
            this.isValid = true;
        }
        else {
            this.isValid = false;
            this.info = 'Enter a non-zero amount of ' + this.coin + ' to receive';
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QrcodeComponent.prototype, "address", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], QrcodeComponent.prototype, "amount", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QrcodeComponent.prototype, "coin", void 0);
    QrcodeComponent = __decorate([
        core_1.Component({
            selector: 'app-qrcode',
            templateUrl: './qrcode.component.html',
            styleUrls: ['./qrcode.component.scss']
        }),
        __metadata("design:paramtypes", [crypto_helper_service_1.CryptoHelperService])
    ], QrcodeComponent);
    return QrcodeComponent;
}());
exports.QrcodeComponent = QrcodeComponent;
//# sourceMappingURL=qrcode.component.js.map