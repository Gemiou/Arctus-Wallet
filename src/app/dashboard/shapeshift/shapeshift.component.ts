import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-shapeshift',
  templateUrl: './shapeshift.component.html',
  styleUrls: ['./shapeshift.component.scss']
})
export class ShapeshiftComponent implements OnInit {
  coinToShift: String;
  modalStatusOpen: Boolean;
  constructor(private shData: SharedDataService, private chRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.shData.coinToShift$.subscribe(
      res => {
        console.log(res);
        this.coinToShift = res;
        this.chRef.detectChanges();
      });
  }

  closeModal() {
    this.modalStatusOpen = false;
    this.shData.getShapeshiftModalStatus(this.modalStatusOpen);
  }

}
