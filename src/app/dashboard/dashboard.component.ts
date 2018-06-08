import { Component } from '@angular/core';
import * as shapeshift from 'shapeshift.io';

// import * as Chartjs from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor() {

    shapeshift.coins(function (err, coinData) {
      console.log('shapeshift', coinData);
    });

  }
}
