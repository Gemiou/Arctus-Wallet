import { Component } from '@angular/core';
import { SharedDataService } from '../services/shared-data.service';
import { CryptoHelperService } from '../services/crypto-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  shapeShiftModalStatus: Boolean = false;
  coinToShift: String = '';
  constructor(private shData: SharedDataService, private router: Router, private ch: CryptoHelperService) {
    this.shData.modalStatus$.subscribe(
      res => {
        this.shapeShiftModalStatus = res;
      });
    // if (this.ch.decryptKey() === null || this.ch.decryptKey() === '') {
    //   this.router.navigate(['/login/']);
    // }
  }

  closeModal($event) {
    if ($event.target !== $event.currentTarget) {
      return;
    }
    this.shData.getShapeshiftModalStatus(false);
  }
}
