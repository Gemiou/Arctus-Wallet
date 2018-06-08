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
var http_1 = require("@angular/http");
var ethers = require("ethers");
var availableCoins = require("../../assets/js/available-tokens.json");
var CryptoJS = require("crypto-js");
var CryptoHelperService = /** @class */ (function () {
    function CryptoHelperService(http) {
        this.http = http;
        // KEY HANDLING SECTION
        this.key = Math.floor((1 + Math.random()) * 0x10000).toString(16);
        // KEY HANDLING SECTION END
        this.coins = availableCoins;
        this.CMCMap = {
            "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0": 1765,
            "0xf230b790e05390fc8295f4d3f60332c93bed42e2": 1958,
            "0xd850942ef8811f2a866692a623011bde52a462c1": 1904,
            "0xd26114cd6ee289accf82350c8d8487fedb8a0c07": 1808,
            "0xb5a5f22694352c15b00323844ad545abb2b11028": 2099,
            "0xb8c77482e45f1f44de1745f52c74426c631bdd52": 1839,
            "0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d": 1700,
            "0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27": 2469,
            "0xe41d2489571d322189246dafa5ebde1f4699f498": 1896,
            "0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750": 1866,
            "0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a": 1789,
            "0x168296bb09e24a88805cb9c33356536b980d3fc5": 2021,
            "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": 1518,
            "0xa74476443119a942de498590fe1f2454d7d4ac0d": 1455,
            "0x744d70fdbe2ba4cf95131626614a1763df805b9e": 1759,
            "0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab": 2405,
            "0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74": 1925,
            "0xef68e7c694f40c8202821edf525de3782458639f": 1934,
            "0xe94327d07fc17907b4db788e5adf2ed424addff6": 1104,
            "0x4ceda7906a5ed2179785cd3a40a69ee8bc99c466": 2062,
            "0xa974c709cfb4566686553a20790685a47aceaa33": 2349,
            "0x0d8775f648430679a709e98d2b0cb6250d2887ef": 1697,
            "0xbf2179859fc6d5bee9bf9158632dc51678a4100e": 2299,
            "0x3893b9422cd5d70a81edeffe3d5a1c6a978310bb": 2608,
            "0x5d65d971895edc438f465c17db6992698a52318d": 1908,
            "0x4f878c0852722b0976a955d68b376e4cd4ae99e5": 2346,
            "0x039b5649a59967e3e936d7471f9c3700100ee1ab": 2087,
            "0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0": 2588,
            "0xdd974d5c2e2928dea5f71b9825b8b646686bd200": 1982,
            "0x12480e24eb5bec1a9d4369cab6a80cad3c0a377a": 1984,
            "0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3": 2603,
            "0x1122b6a0e00dce0563082b6e2953f3a943855c1f": 2585,
            "0xea11755ae41d889ceec39a63e6ff75a02bc1c00d": 2638,
            "0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6": 2213,
            "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c": 1727,
            "0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433": 2297,
            "0x419d0d8bdd9af5e606ae2232ed285aff190e711b": 1757,
            "0x5af2be193a6abca9c8817001f45744777db30756": 1817,
            "0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e": 2243,
            "0x08d32b0da63e2c3bcf8019c9c5d849d7a9d791e6": 1876,
            "0x8f3470a7388c05ee4e7af3d01d8c722b0ff52374": 1710,
            "0x4156d3342d5c385a87d264f90653733592000581": 1996,
            "0x39bb259f66e1c59d5abef88375979b4d20d98022": 2300,
            "0xd0352a019e9ab9d757776f532377aaebd36fd541": 2530,
            "0xf85feea2fdd81d51177f6b8f35f0e6734ce45f5f": 2246,
            "0x01ff50f8b7f74e4f00580d9596cd3d0d6d6e326f": 2605,
            "0xc5bbae50781be1669306b9e001eff57a2957b09d": 2289,
            "0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec": 2496,
            "0x2d0e95bd4795d7ace0da3c0ff7b706a5970eb9d3": 2473,
            "0x595832f8fc6bf59c85c527fec3740a1b7a361269": 2132,
            "0xe25bcec5d3801ce3a794079bf94adf1b8ccd802d": 2474,
            "0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4": 2044,
            "0x514910771af9ca656af840dff83e8264ecf986ca": 1975,
            "0xb63b606ac810a52cca15e44bb630fd42d8d1d83d": 1776,
            "0x809826cceab68c387726af962713b64cb5cb3cca": 2544,
            "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206": 2694,
            "0x8f8221afbb33998d8584a2b05749ba73c37a938a": 2071,
            "0x48f775efbe4f5ece6e0df2f7b5932df56823b990": 2135,
            "0x0f5d2fb29fb7d3cfee444a200298f468908cc942": 1966,
            "0xb97048628db6b661d4c2aa833e95dbe1a905b280": 1758,
            "0x888666ca69e0f178ded6d75b5726cee99a87d698": 138,
            "0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac": 1772,
            "0x41e5560054824ea6b0732e656e3ad64e20e94e45": 1819,
            "0x960b236a07cf122663c4303350609a66a7b288c0": 1680,
            "0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195": 1937,
            "0x6810e776880c02933d47db1b9fc05908e5386b96": 1659,
            "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c": 2130,
            "0xf278c1ca969095ffddded020290cf8b5c424ace2": 2476,
            "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6": 2161,
            "0x80fb784b7ed66730e8b1dbd9820afd29931aab03": 2239,
            "0xc42209accc14029c1012fb5680d95fbd6036e2a0": 2036,
            "0xced4e93198734ddaff8492d525bd258d49eb388e": 2057
        };
        this.erc20ABI = [
            {
                'constant': true,
                'inputs': [
                    {
                        'name': '_owner',
                        'type': 'address'
                    }
                ],
                'name': 'balanceOf',
                'outputs': [
                    {
                        'name': 'balance',
                        'type': 'uint256'
                    }
                ],
                'payable': false,
                'stateMutability': 'view',
                'type': 'function'
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
    }
    CryptoHelperService.prototype.decryptKey = function () {
        try {
            return CryptoJS.AES.decrypt(localStorage.getItem('seed'), this.key).toString(CryptoJS.enc.Utf8);
        }
        catch (e) {
            return null;
        }
    };
    CryptoHelperService.prototype.encryptKey = function (seed) {
        localStorage.setItem('seed', CryptoJS.AES.encrypt(seed, this.key));
    };
    CryptoHelperService.prototype.getCoinBalance = function (coin, address, tokenAddress) {
        switch (coin) {
            case 0: {
                return this.getEth(address);
            }
            case 1: {
                return this.getBtc(address);
            }
            case 2: {
                return this.getTokenBalance(address, tokenAddress);
            }
        }
    };
    CryptoHelperService.prototype.getCoinValue = function (coin, tokenAddress) {
        switch (coin) {
            case 0: {
                return this.getEthValue();
            }
            case 1: {
                return this.getBtcValue();
            }
            case 2: {
                return this.getTokenValue(tokenAddress);
            }
        }
    };
    CryptoHelperService.prototype.getEth = function (address) {
        var provider = new ethers.providers.InfuraProvider('homestead', 'Mohcm5md9NBp71v7gHjv');
        return provider.getBalance(address);
    };
    CryptoHelperService.prototype.getEthValue = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=9Q36KI8UQ7MA9ZS5C9YS8HPW8M453DEK51').subscribe(function (coinBalance) {
                resolve(JSON.parse(coinBalance._body).result.ethusd);
            }, function (err) {
                console.log(err);
                resolve(undefined);
            });
        });
    };
    CryptoHelperService.prototype.getTokenBalance = function (address, tokenAddress) {
        var provider = new ethers.providers.InfuraProvider('homestead', 'Mohcm5md9NBp71v7gHjv');
        var contractInstance = new ethers.Contract(tokenAddress, this.erc20ABI, provider);
        return contractInstance.balanceOf(address);
    };
    CryptoHelperService.prototype.getTokenValue = function (tokenAddress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('https://api.coinmarketcap.com/v2/ticker/' + _this.CMCMap[tokenAddress] + '/').subscribe(function (res) {
                resolve(JSON.parse(res._body).data.quotes.USD.price);
            }, function (err) {
                console.log(err);
                resolve(undefined);
            });
        });
    };
    CryptoHelperService.prototype.getBtc = function (address) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('https://blockchain.info/el/q/addressbalance/' + address).subscribe(function (coinBalance) {
                resolve(coinBalance._body / Math.pow(10, 8));
            }, function (err) {
                console.log(err);
                resolve(undefined);
            });
        });
    };
    CryptoHelperService.prototype.getBtcValue = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get('https://api.coindesk.com/v1/bpi/currentprice.json').subscribe(function (coinBalance) {
                resolve(JSON.parse(coinBalance._body).bpi.USD.rate.replace(/,/g, ''));
            }, function (err) {
                console.log(err);
                resolve(undefined);
            });
        });
    };
    CryptoHelperService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], CryptoHelperService);
    return CryptoHelperService;
}());
exports.CryptoHelperService = CryptoHelperService;
//# sourceMappingURL=crypto-helper.service.js.map