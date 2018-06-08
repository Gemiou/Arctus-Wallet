"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var crypto_helper_service_1 = require("./services/crypto-helper.service");
var angularx_qrcode_1 = require("angularx-qrcode");
var core_2 = require("@ngx-loading-bar/core");
var app_component_1 = require("./app.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var app_routing_module_1 = require(".//app-routing.module");
var login_component_1 = require("./login/login.component");
var filter_pipe_1 = require("./filter.pipe");
var ngx_filter_pipe_1 = require("ngx-filter-pipe");
var setup_component_1 = require("./setup/setup.component");
var send_component_1 = require("./dashboard/send/send.component");
var receive_component_1 = require("./dashboard/receive/receive.component");
var qrcode_component_1 = require("./dashboard/receive/qrcode/qrcode.component");
var addnewcoin_component_1 = require("./dashboard/addnewcoin/addnewcoin.component");
var loading_component_1 = require("./loading/loading.component");
var settings_component_1 = require("./settings/settings.component");
var wallet_component_1 = require("./dashboard/wallet/wallet.component");
var txhash_component_1 = require("./dashboard/send/txhash/txhash.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                dashboard_component_1.DashboardComponent,
                login_component_1.LoginComponent,
                filter_pipe_1.FilterPipe,
                setup_component_1.SetupComponent,
                send_component_1.SendComponent,
                receive_component_1.ReceiveComponent,
                qrcode_component_1.QrcodeComponent,
                addnewcoin_component_1.AddnewcoinComponent,
                loading_component_1.LoadingComponent,
                settings_component_1.SettingsComponent,
                wallet_component_1.WalletComponent,
                txhash_component_1.TxhashComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                app_routing_module_1.AppRoutingModule,
                ngx_filter_pipe_1.FilterPipeModule,
                angularx_qrcode_1.QRCodeModule,
                core_2.LoadingBarModule.forRoot()
            ],
            providers: [
                crypto_helper_service_1.CryptoHelperService
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map