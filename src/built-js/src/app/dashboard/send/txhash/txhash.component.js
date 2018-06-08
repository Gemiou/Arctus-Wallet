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
var TxhashComponent = /** @class */ (function () {
    function TxhashComponent(route) {
        var _this = this;
        this.route = route;
        this.hash = '';
        this.route.params.subscribe(function (params) {
            _this.hash = params.hash;
        });
    }
    TxhashComponent.prototype.ngOnInit = function () {
    };
    TxhashComponent = __decorate([
        core_1.Component({
            selector: 'app-txhash',
            templateUrl: './txhash.component.html',
            styleUrls: ['./txhash.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], TxhashComponent);
    return TxhashComponent;
}());
exports.TxhashComponent = TxhashComponent;
//# sourceMappingURL=txhash.component.js.map