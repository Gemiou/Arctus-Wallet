import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentDate: any = '';
  currentMsg: any;
  FAQ: any;
  video: any;
  status: any = 0;
  timestamp: any = '';
  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('first-time') == null) {
      (<HTMLElement>document.querySelector('.floated-chat-btn')).click();
      localStorage.setItem('first-time', 'no');
    }
  }

  welcomeUser() {
    if (this.currentDate == '') {
      let cD = new Date();
      let dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let hours = "0" + (cD.getHours() - (Math.floor(cD.getHours() / 13) * 12));
      hours = hours.substring(hours.length - 2);
      let minutes = "0" + cD.getMinutes();
      minutes = minutes.substring(minutes.length - 2);
      this.currentDate = dayArray[cD.getDay()] + " " + hours + ":" + minutes + " " + (cD.getHours() > 12?"pm":"am");
      this.showMessage(this.timeAwareMessage(hours), false, 1);
      this.showMessage(this.firstPrompt(), false, 2);
    }
  }

  showMessage(message: any, self: any, timeout: any) {
    let messageHTML = `<div class="message"><div class="message-content">${message}</div></div>`;
    let toAppend = document.querySelector(".message" + (self?'.self':'')).cloneNode(true);
    (<HTMLElement>toAppend).classList.toggle('display-none');
    (<HTMLElement>toAppend).firstElementChild.innerHTML = message;
    // toAppend.outerHTML = messageHTML;
    setTimeout(() => {
      document.querySelector(".chat-messages").appendChild(toAppend);
      document.querySelector('.chat-messages').scrollTop =  document.querySelector('.chat-messages').scrollHeight;
    }, timeout * 1000);
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

  async processInput(e: any) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.showMessage(this.currentMsg, true, 0);
      if (this.currentMsg.match(new RegExp("send [0-9.]+ ([A-Z]{1,5}|[a-z]{1,6}) (to )?[a-zA-Z0-9]{30,42}", 'g')) != null) {
        let amount = this.currentMsg.match(new RegExp("[0-9.]+"))[0];
        let type = this.currentMsg.match(new RegExp("[0-9.]+ ([A-Z]{1,5}|[a-z]{1,6})"))[0].split(" ")[1];
        let address;
        try {
          if (type.toUpperCase() === 'BTC') {
            address = this.currentMsg.match(new RegExp("(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}"))[0];
          } else {
            address = this.currentMsg.match(new RegExp("0x[0-9a-fA-F]{40}"))[0];
          }
        } catch (e) {
          this.showMessage("It seems the address you are trying to send to is not valid, make sure it is a correct address", false, 1);
          return;
        }
        this.currentMsg = "";
        this.showMessage(`Okay, sending ${amount} ${type} to ${address}`, false, 1);
        await new Promise((resolve, reject) => setTimeout(() => {resolve()}, 2000));
        this.queueAction('click', `.coin-${type.toUpperCase()}-identifier`).then((status) => {
          if (status === true) {
            return this.queueAction('click', 'button[data-text^="Send "]');
          } else {
            throw status;
          }
        }).then((status) => {
          if (status === true) {
            return this.queueAction('click', 'input[placeholder^="Recipient"]');
          } else {
            throw status;
          }
        }).then((status) => {
          if (status === true) {
            return this.queueAction('input', 'input[placeholder^="Recipient"]', address);
          } else {
            throw status;
          }
        }).then((status) => {
          if (status === true) {
            return this.queueAction('click', 'input[step^="a"]');
          } else {
            throw status;
          }
        }).then((status) => {
          if (status === true) {
            return this.queueAction('input', 'input[step^="a"]', amount);
          } else {
            throw status;
          }
        }).then(async (status) => {
          await new Promise((resolve, reject) => setTimeout(() => {resolve()}, 2000));
          alert("SUCCESS");
        }).catch((err) => {
          console.log(err.message);
        });
      } else if (this.status == -1) {
        if (this.currentMsg.match(new RegExp(".*yes.*", 'i')) || this.currentMsg.match(new RegExp(".*yeah.*", 'i')) || this.currentMsg.match(new RegExp("y", 'i'))) {
          this.openVideoModal(this.video);
          this.showMessage("I hope it answered your question!", false, 1);
          this.showMessage(this.randomPrompt(), false, 2);
        } else {
          this.showMessage(`Okay, you can find the relevant FAQ page on <a href='${this.FAQ}' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>this link</a> if you want`, false, 1);
          this.showMessage(this.randomPrompt(), false, 2);
        }
        this.status = 0;
      } else if (this.currentMsg.match(new RegExp(".*shapeshift.*", 'i'))) {
        this.showMessage("I can show you a video for ShapeShift, would you like me to open it for you?", false, 1);
        this.video = 'https://www.youtube.com/embed/SWQiLqrqdA8?autoplay=1';
        this.FAQ = 'https://arctus.io/faq/#shapeshift';
        this.status = -1;
      } else if (this.currentMsg.match(new RegExp(".*login.*", 'i'))) {
        this.showMessage("I can show you a video on how to login to our wallet, would you like me to open it for you?", false, 1);
        this.video = 'https://www.youtube.com/embed/rhaz3HI_Vb4?autoplay=1';
        this.FAQ = 'https://arctus.io/faq/#login';
        this.status = -1;
      } else if (this.currentMsg.match(new RegExp(".*exchange.*", 'i'))) {
        this.showMessage("We are planning to support our own exchange but for now feel free to use our ShapeShift service to exchange your assets!", false, 2);
        this.showMessage(this.randomPrompt(), false, 2);
      } else if ((this.currentMsg.match(new RegExp(".*coin.*")) || this.currentMsg.match(new RegExp(".*token.*")) || this.currentMsg.match(new RegExp(".*crypto.*")) || this.currentMsg.match(new RegExp(".*asset.*")) || this.currentMsg.match(new RegExp(" ([a-z]{1,4}|[A-Z]{1,4}) ?.*$"))) && (this.currentMsg.match(new RegExp(".*support.*")) || this.currentMsg.match(new RegExp(".*include.*")))) {
        this.showMessage(`A list of all the tokens we support can be <a href='${this.FAQ}' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>found here</a> but you can also find them if you login to your wallet or register and try to add a new coin!`, false, 1);
        this.showMessage(this.randomPrompt(), false, 2);
      } else if (this.currentMsg.match(new RegExp(".*transfer.*"))) {
        this.showMessage("I can show you a video on how to transfer funds from and to our multi-currency wallet, would you like me to open it for you?", false, 1);
        this.video = 'http://www.youtube.com/embed/rhaz3HI_Vb4?autoplay=1';
        this.FAQ = 'https://arctus.io/faq/#transfer';
        this.status = -1;
      } else if (this.currentMsg.match(new RegExp(".*yes.*", 'i')) || this.currentMsg.match(new RegExp(".*yeah.*", 'i')) || this.currentMsg.match(new RegExp("^y", 'i')) || this.currentMsg.match(new RegExp(".*help.*", 'i'))) {
        this.showMessage("What exactly do you need help with?", false, 1);
      } else if (this.currentMsg.match(new RegExp(".*no.*", 'i')) || this.currentMsg.match(new RegExp(".*nope.*", 'i'))) {
        this.showMessage("Okay, feel free to reach me if you change your mind by clicking the chat button below!", false, 1);
        setTimeout(() => {
          (<HTMLElement> document.querySelector('.floated-chat-btn')).click();
        }, 5000);
      } else {
        this.showMessage("I am sorry, I didn't quite get that. You can find our FAQ page on <a href='${this.FAQ}' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>this link</a> or contact us directly at <a href='mailto:info@arctus.io' style='text-decoration:none;color:blue;font-weight:800;' target='_blank'>info@arctus.io</a>", false, 1);
        this.showMessage(this.randomPrompt(), false, 2);
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

  async queueAction(actionType: any, selector: any, text?: any) {
    await new Promise((resolve, reject) => setTimeout(() => {resolve()}, actionType == "click"?1000:500));
    let element = document.querySelector(selector);
    if (element !== null) {
      if (actionType == 'input') {
        // Simulate input event for filtering and Angular
        const event = new Event('input', {
            'bubbles': true,
            'cancelable': true
        });
        await new Promise((resolve, reject) => setTimeout(() => {element.value = text.charAt(0);resolve();}, Math.random() * 100));
        text = text.substring(1);
        // We need to save the size because we edit the text directly
        let loopLength = text.length;
        for (let i = 1; i < loopLength; i++) {
          await new Promise((resolve, reject) => setTimeout(() => {
            if (text.charAt(0) == '.') {
              element.value += text.substring(0,2);
              text = text.substring(2);
            } else {
              element.value += text.charAt(0);
              text = text.substring(1);
            }
            resolve();
          }, Math.random() * 100));
        }
        element.dispatchEvent(event);
        return Promise.resolve(true);
      } else if (actionType == 'click') {
        element.click();
        element.focus();
        return Promise.resolve(true);
      }
    } else {
      return Promise.resolve(new Error('not-found'));
    }
  }
}
