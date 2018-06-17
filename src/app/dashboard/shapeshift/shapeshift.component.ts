import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-shapeshift',
  templateUrl: './shapeshift.component.html',
  styleUrls: ['./shapeshift.component.scss']
})
export class ShapeshiftComponent implements OnInit {
  depositCoin: String;
  receiveCoin: String;
  constructor(private shData: SharedDataService, private chRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.shData.shapeShiftPair$.subscribe(
      res => {
        this.depositCoin = res[0];
        this.receiveCoin = res[1];
        this.chRef.detectChanges();
      }
    );
  }

  closeModal() {
    this.shData.changeShapeShiftModalStatus(false);
  }

}
