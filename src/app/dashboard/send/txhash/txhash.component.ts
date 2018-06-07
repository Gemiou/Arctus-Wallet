import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-txhash',
  templateUrl: './txhash.component.html',
  styleUrls: ['./txhash.component.scss']
})
export class TxhashComponent implements OnInit {
  hash = '';

  constructor(private route: ActivatedRoute,) {
    this.route.params.subscribe((params) => {
      this.hash = params.hash;
    });
  }

  ngOnInit() {
  }

}
