import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { SharedDataService } from '../services/shared-data.service';
import { CryptoHelperService } from '../services/crypto-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({
            position: 'absolute',
            // 'z-index': 2,
            width: '1000px',
            height: '500px',
            transform: 'scale(0.9) translate(-50%, -25%)',
            top: '50%',
            left: '50%',
            opacity: 0}),
          animate('750ms cubic-bezier(.175,.885,.32,1)', style({
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1}))
        ]),
        transition(':leave', [
          style({
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1}),
          animate('750ms cubic-bezier(.175,.885,.32,1)',
          style({
            transform: 'scale(0.9) translate(-50%, -25%)',
            opacity: 0}))
        ])
      ]
    )
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  shapeShiftModalStatus: Boolean = false;
  isSelectingCoin: any = 0;
  coinToShift: String = '';
  ESCAPE_KEYCODE = 27;
  constructor(private shData: SharedDataService, private router: Router, private ch: CryptoHelperService) {
    this.shData.modalStatus$.subscribe(
      res => {
        this.shapeShiftModalStatus = res;
        if (!this.shapeShiftModalStatus) {
          this.isSelectingCoin = 0;
        }
      }
    );
    this.shData.isSelectingCoin$.subscribe(
      res => {
        this.isSelectingCoin = res;
      }
    );
    if (this.ch.decryptKey() === null || this.ch.decryptKey() === '') {
      this.router.navigate(['/login/']);
    }
  }
  ngOnInit() {
    const redirect = window.location.pathname === '/dashboard';
    if (redirect) {
      this.router.navigate(['/dashboard/wallet/']);
    }
  }
  closeModal($event) {
    if ($event.target !== $event.currentTarget) {
      return;
    }
    this.shData.changeShapeShiftModalStatus(false);
  }

@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.shData.changeShapeShiftModalStatus(false);
    }
}
}
