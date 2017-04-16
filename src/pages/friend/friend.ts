import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Friend page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html'
})
export class FriendPage {

  constructor(private _navCtrl: NavController, private _navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendPage');
  }

}
