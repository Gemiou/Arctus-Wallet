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
var ethers_1 = require("ethers");
var crypto_helper_service_1 = require("../services/crypto-helper.service");
var blockstack = require("blockstack");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(router, loadingBar, ch) {
        this.router = router;
        this.loadingBar = loadingBar;
        this.ch = ch;
        this.inactive = false;
        this.active = false;
        this.test = true;
    }
    SettingsComponent.prototype.ngOnInit = function () {
    };
    SettingsComponent.prototype.logout = function () {
        localStorage.removeItem('seed');
        localStorage.removeItem('pass');
        if (blockstack.isUserSignedIn()) {
            blockstack.signUserOut('https://wallet.arctus.io/login/');
        }
        else {
            this.router.navigate(['/login/']);
        }
    };
    SettingsComponent.prototype.toJSON = function () {
        var _this = this;
        var p_key = this.ch.decryptKey();
        var password = localStorage.getItem('pass');
        var wallet = new ethers_1.Wallet(p_key);
        this.loadingBar.start();
        var encryptPromise = wallet.encrypt(password);
        encryptPromise.then(function (json) {
            _this.loadingBar.complete();
            json = JSON.parse(json);
            json.dashSettings = JSON.parse(localStorage.getItem('preferences-' + localStorage.getItem('username')));
            json = JSON.stringify(json);
            var toDownload = new Blob([json], { type: 'application/json' });
            var link = window.URL.createObjectURL(toDownload);
            var a = document.getElementById('download');
            a.href = link;
            a.download = 'keystore.json';
            a.click();
        });
    };
    SettingsComponent.prototype.redirectToFAQ = function () {
        window.location.href = "https://www.arctus.io/FAQ";
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.component.html',
            styleUrls: ['./settings.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.Router, core_2.LoadingBarService, crypto_helper_service_1.CryptoHelperService])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map