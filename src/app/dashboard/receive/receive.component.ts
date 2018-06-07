import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {

  addressFrom = '';
  coinName = '';
  amount = 0;
  amountFrom = 0;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.addressFrom = params.address;
      this.coinName = params.coinName;
    });
  }

  ngOnInit() {
  }

  generateQrCode(address: string, amount: number) {
    this.amountFrom = amount;
  }
}
