import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {

  }
  ngOnInit() {
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
    //   document.querySelector('app-root').innerHTML =
    //   // tslint:disable-next-line:max-line-length
    //   `<div class="row justify-content-center align-items-center text-center" style="position:fixed;top:0;left:0;padding:0;margin:0;height:100vh;width:100vw;">
    //       <div class="col-sm-12">
    //           <h1 style="color:white;">Mobile/Tablet Application</h1>
    //       </div>
    //       <div class="col-sm-12">
    //       <a href="https://arctus.io/" style="text-decoration:none">
    //           <img class="logo" style="height:30vmax" src="./assets/img/white-logo.png" />
    //           <br/>
    //           <span style="color:white;font-size: 4vmax;">
    //               Arctus.io
    //           </span>
    //       </a>
    //       </div>
    //       <div class="col-sm-12">
    //           <h3 style="color:white;">Coming Soon</h3>
    //       </div>
    //   </div>`;
        document.querySelector('body').classList.add('mobile');
    }
  }
}
