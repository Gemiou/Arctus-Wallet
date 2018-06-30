import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

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
  @Input() coinReceive: string;
  @Input() addressReceive: string;
  @Output() recModal = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit() {
    this.addressFrom = this.addressReceive;
    this.coinName =  this.coinReceive;
  }

  generateQrCode(address: string, amount: number) {
    this.amountFrom = amount;
  }
  close() {
    // close the modal
    this.recModal.emit(false);
  }
}
