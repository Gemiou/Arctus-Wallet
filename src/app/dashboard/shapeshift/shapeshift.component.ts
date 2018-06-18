import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { ShapeShiftHelperService } from '../../services/shapeshift-helper.service';

@Component({
  selector: 'app-shapeshift',
  templateUrl: './shapeshift.component.html',
  styleUrls: ['./shapeshift.component.scss']
})
export class ShapeshiftComponent implements OnInit {
  depositCoin: String;
  receiveCoin: String;
  calculatedRate: String;
  depositMin: String;
  depositMax: String;
  minerFee: String;
  constructor(private shData: SharedDataService, private chRef: ChangeDetectorRef, private SS: ShapeShiftHelperService) {
  }

  ngOnInit() {
    this.shData.shapeShiftPair$.subscribe(
      res => {
        this.depositCoin = res[0];
        this.receiveCoin = res[1];
        this.SS.getPairInfo(this.depositCoin, this.receiveCoin)
        .then((pairInfo) => {
          this.calculatedRate = (<any>pairInfo).rate;
          this.depositMin = (<any>pairInfo).minimum;
          this.depositMax = (<any>pairInfo).limit;
          this.minerFee = (<any>pairInfo).minerFee;
          this.chRef.detectChanges();
        })
        .catch((err) => {
          console.log(err);
        });
      }
    );
  }

  closeModal() {
    this.shData.changeShapeShiftModalStatus(false);
  }

  selectCoin(type) {
    this.shData.changeSelectStatus(type);
  }
}
