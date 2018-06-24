import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentDate: any;
  currentMsg: any;
  FAQ: any;
  video: any;
  status: any = 0;
  constructor() { }

  ngOnInit() {
    let cD = new Date();
    let dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let hours = "0" + (cD.getHours() - (Math.floor(cD.getHours() / 13) * 12));
    hours = hours.substring(hours.length - 2);
    let minutes = "0" + cD.getMinutes();
    minutes = minutes.substring(minutes.length - 2);
    this.currentDate = dayArray[cD.getDay()] + " " + hours + ":" + minutes + " " + (cD.getHours() > 12?"pm":"am");
    this.showMessage(this.timeAwareMessage(hours), false);
    this.showMessage(this.firstPrompt(), false);
  }

  showMessage(message: any, self: any) {
    let messageHTML = `<div class="message"><div class="message-content">${message}</div></div>`;
    let toAppend = document.querySelector(".message" + (self?'.self':'')).cloneNode(true);
    (<HTMLElement>toAppend).classList.toggle('display-none');
    (<HTMLElement>toAppend).firstElementChild.innerHTML = message;
    // toAppend.outerHTML = messageHTML;
    document.querySelector(".chat-messages").appendChild(toAppend);
    document.querySelector('.chat-messages').scrollTop =  document.querySelector('.chat-messages').scrollHeight;
  }

  timeAwareMessage(hours: any) {
    if (this.currentDate.indexOf("am") != -1) {
      if (hours < 5) {
        return "Welcome to Arctus, I am Arcty and I will be your digital assistant for the day";
      } else {
        return "Good morning and welcome to Arctus, my name is Arcty and I will be your digital assistant";
      }
    } else {
      if (hours < 5) {
        return "Good afternoon and thank you for visiting Arctus, my name is Arcty and I will be your assistant for the day";
      } else {
        return "Good evening, I am Arcty and I am more than happy to help you with anything you need";
      }
    }
  }

  firstPrompt() {
    let seed = Math.floor((Math.random() * 5) + 1);
    switch (seed) {
      case 1: {
        return "Is there anything specific you would like help with?";
      }
      case 2: {
        return "What may I help you with?";
      }
      case 3: {
        return "Can I do anything for you?";
      }
      case 4: {
        return "Do you have any question in mind?";
      }
      case 5: {
        return "Would you like me to help you with our wallet?";
      }
    }
  }

  randomPrompt() {
    let seed = Math.floor((Math.random() * 5) + 1);
    switch (seed) {
      case 1: {
        return "Is there anything specific you would like help with?";
      }
      case 2: {
        return "Is there anything else I may help you with?";
      }
      case 3: {
        return "Can I do anything else for you?";
      }
      case 4: {
        return "Do you have any other question in mind?";
      }
      case 5: {
        return "Would you like me to help you with anything else regarding our wallet?";
      }
    }
  }

  processInput(e: any) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.showMessage(this.currentMsg, true);
      if (this.status == -1) {
        if (this.currentMsg.match(new RegExp(".*yes.*", 'i')) || this.currentMsg.match(new RegExp(".*yeah.*", 'i')) || this.currentMsg.match(new RegExp("y", 'i'))) {
          this.openVideoModal(this.video);
          this.showMessage("I hope it answered your question!", false);
          this.showMessage(this.randomPrompt(), false);
        } else {
          this.showMessage(`Okay, you can find the relevant FAQ page on <a href='${this.FAQ}' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>this link</a> if you want`, false);
          this.showMessage(this.randomPrompt(), false);
        }
        this.status = 0;
      } else if (this.status == 0 && (this.currentMsg.match(new RegExp(".*yes.*", 'i')) || this.currentMsg.match(new RegExp(".*yeah.*", 'i')) || this.currentMsg.match(new RegExp("y", 'i')) || this.currentMsg.toUpperCase() == 'HELP')) {
        this.showMessage("What exactly do you need help with?", false);
        this.status = 1;
      } else if (this.status == 1 || this.currentMsg.match(new RegExp(".*help.*", 'i'))) {
        if (this.currentMsg.match(new RegExp(".*shapeshift.*", 'i'))) {
          this.showMessage("I can show you a video for ShapeShift, would you like me to open it for you?", false);
          this.video = 'https://www.youtube.com/embed/SWQiLqrqdA8?autoplay=1';
          this.FAQ = 'https://arctus.io/faq/#create';
          this.status = -1;
        } else if (this.currentMsg.match(new RegExp(".*login.*", 'i'))) {
          this.showMessage("I can show you a video on how to login to our wallet, would you like me to open it for you?", false);
          this.video = 'https://www.youtube.com/embed/rhaz3HI_Vb4?autoplay=1';
          this.FAQ = 'https://arctus.io/faq/#create';
          this.status = -1;
        } else if (this.currentMsg.match(new RegExp(".*exchange.*", 'i'))) {
          this.showMessage("We are planning to support our own exchange but for now feel free to use our ShapeShift service to exchange your assets!", false);
          this.showMessage(this.randomPrompt(), false);
          this.status = 0;
        } else if ((this.currentMsg.match(new RegExp(".*coin.*")) || this.currentMsg.match(new RegExp(".*token.*")) || this.currentMsg.match(new RegExp(".*crypto.*")) || this.currentMsg.match(new RegExp(".*asset.*")) || this.currentMsg.match(new RegExp(" ([a-z]{1,4}|[A-Z]{1,4}) ?.*$"))) && (this.currentMsg.match(new RegExp(".*support.*")) || this.currentMsg.match(new RegExp(".*include.*")))) {
          this.showMessage(`A list of all the tokens we support can be <a href='${this.FAQ}' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>found here</a> but you can also find them if you login to your wallet or register and try to add a new coin!`, false);
          this.showMessage(this.randomPrompt(), false);
          this.status = 0;
        } else if (this.currentMsg.match(new RegExp(".*transfer.*"))) {
          this.showMessage("I can show you a video on how to transfer funds from and to our multi-currency wallet, would you like me to open it for you?", false);
          this.video = 'http://www.youtube.com/embed/rhaz3HI_Vb4?autoplay=1';
          this.FAQ = 'https://arctus.io/faq/#create';
          this.status = -1;
        } else {
          this.showMessage("I am sorry, I didn't quite get that. You can find our FAQ page on <a href='${this.FAQ}' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>this link</a> or contact us directly at <a href='mailto:info@arctus.io' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>info@arctus.io</a>", false);
          this.showMessage(this.randomPrompt(), false);
          this.status = 0;
        }
      }
      this.currentMsg = "";
    }
  }

  openVideoModal(url: any) {
    let overlay = document.createElement('div');
    overlay.setAttribute('id','super-unique-id')
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.position = 'absolute';
    overlay.style.zIndex = '99999';
    overlay.style.transition = 'opacity 1s cubic-bezier(.175,.885,.32,1)';
    overlay.style.opacity = '0';
    overlay.onclick = () => {
      document.getElementById('super-unique-id').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('super-unique-id').outerHTML = '';
      }, 1000);
    }
    let modalBox = document.createElement('iframe');
    modalBox.style.position = 'absolute';
    modalBox.style.top = '50%';
    modalBox.style.left = '50%';
    modalBox.style.transform = 'scale(0.9) translate(-50%, calc(-50% + 100px))';
    modalBox.style.textAlign = 'center';
    modalBox.style.transition = 'transform 1s cubic-bezier(.175,.885,.32,1)';
    modalBox.style.display = 'inline-block';
    modalBox.setAttribute('type', 'text/html');
    modalBox.setAttribute('width', '1280px');
    modalBox.setAttribute('height', '720px');
    modalBox.setAttribute('frameborder', '0');
    modalBox.setAttribute('src', url);
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '1';
      modalBox.style.transform = 'scale(1) translate(-50%, -50%)';
    });
  }
}
