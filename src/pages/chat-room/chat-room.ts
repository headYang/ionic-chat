import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ng-socket-io';

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  messages = [];
  nickname = '';
  message = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController, private socket: Socket) {
    this.nickname = this.navParams.get('nickname');
    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.getUsers().subscribe(data => {
      let user = data['user'];
      if(data['event'] === 'left') {
        this.showToast('user left:' + user);
      } else {
         this.showToast('user join:' + user);
      }
    });
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', data => {
        console.log(data);
        observer.next(data);
      });
    });
    return observable;
  }
  sendMessage() {
    this.socket.emit('add-message', { text: this.message});
    this.message = '';
  }
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', data => {
        observer.next(data); 
      })
    });
    return observable;
  }

  ionViewWillLeave(){
    console.log('asdfasdfsdf');
   this.socket.disconnect();
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
