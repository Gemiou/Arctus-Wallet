import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components for routes
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SetupComponent } from './setup/setup.component';
import { SendComponent } from './dashboard/send/send.component';
import { ReceiveComponent } from './dashboard/receive/receive.component';
import { AddnewcoinComponent } from './dashboard/addnewcoin/addnewcoin.component';
import { WalletComponent } from './dashboard/wallet/wallet.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: 'wallet', component: WalletComponent },
    { path: 'send/:coinName/:address', component: SendComponent },
    { path: 'receive/:coinName/:address', component: ReceiveComponent },
    { path: 'addCoin', component: AddnewcoinComponent }
  ],
 },
  { path: 'setup', component: SetupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
