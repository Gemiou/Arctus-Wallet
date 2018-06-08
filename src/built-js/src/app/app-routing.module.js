"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
// components for routes
var dashboard_component_1 = require("./dashboard/dashboard.component");
var login_component_1 = require("./login/login.component");
var setup_component_1 = require("./setup/setup.component");
var send_component_1 = require("./dashboard/send/send.component");
var receive_component_1 = require("./dashboard/receive/receive.component");
var addnewcoin_component_1 = require("./dashboard/addnewcoin/addnewcoin.component");
var wallet_component_1 = require("./dashboard/wallet/wallet.component");
var txhash_component_1 = require("./dashboard/send/txhash/txhash.component");
var routes = [
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent, children: [
            { path: 'wallet', component: wallet_component_1.WalletComponent },
            { path: 'send/:coinName/:address', component: send_component_1.SendComponent },
            { path: 'txhash/:hash', component: txhash_component_1.TxhashComponent },
            { path: 'receive/:coinName/:address', component: receive_component_1.ReceiveComponent },
            { path: 'addCoin', component: addnewcoin_component_1.AddnewcoinComponent }
        ],
    },
    { path: 'setup', component: setup_component_1.SetupComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule],
            providers: []
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map