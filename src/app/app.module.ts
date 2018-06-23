import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FilterPipe } from './filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { QRCodeModule } from 'angularx-qrcode';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AppRoutingModule } from './/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';

import { CryptoHelperService } from './services/crypto-helper.service';
import { ShapeShiftHelperService } from './services/shapeshift-helper.service';
import { SharedDataService } from './services/shared-data.service';
import { BlockchainAPIService } from './services/blockchain-api.service';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SetupComponent } from './setup/setup.component';
import { SendComponent } from './dashboard/send/send.component';
import { ReceiveComponent } from './dashboard/receive/receive.component';
import { QrcodeComponent } from './dashboard/receive/qrcode/qrcode.component';
import { AddnewcoinComponent } from './dashboard/addnewcoin/addnewcoin.component';
import { LoadingComponent } from './loading/loading.component';
import { SettingsComponent } from './settings/settings.component';
import { WalletComponent } from './dashboard/wallet/wallet.component';
import { TxhashComponent } from './dashboard/send/txhash/txhash.component';
import { ShapeshiftComponent } from './dashboard/shapeshift/shapeshift.component';
import { CoinSelectionComponent } from './dashboard/shapeshift/coinselection/coinselection.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    FilterPipe,
    SetupComponent,
    SendComponent,
    ReceiveComponent,
    QrcodeComponent,
    AddnewcoinComponent,
    LoadingComponent,
    SettingsComponent,
    WalletComponent,
    TxhashComponent,
    ShapeshiftComponent,
    CoinSelectionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FilterPipeModule,
    QRCodeModule,
    BrowserAnimationsModule,
    ClipboardModule,
    LoadingBarModule.forRoot()
  ],
  providers: [
    CryptoHelperService,
    BlockchainAPIService,
    SharedDataService,
    ShapeShiftHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
