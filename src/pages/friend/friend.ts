import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { AddFriendPage } from '../add-friend/add-friend';
import { FriendComparePage } from '../friend-compare/friend-compare';

import { FriendService } from '../../providers/friend.service';

import * as async from 'async';

@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html'
})
export class FriendPage {
  private _requestList;
  private _friendList;
  private _networkFlag; //true means network normal
  constructor(private _navCtrl: NavController, private _navParams: NavParams, private _friendService: FriendService, private _toastCtrl: ToastController, private _alertCtrl: AlertController) {
    this._networkFlag = true;
    this._requestList = [];
    this._friendList = [];
  }

  ionViewWillEnter() {
    this._getList();
  	setInterval(() => {
  		this._getList();
  	}, 10000);
  }

  private _goAddFriendPage(){
  	this._navCtrl.push(AddFriendPage);
  }

  private _goComparePage(friend){
    this._navCtrl.push(FriendComparePage, { friend: friend });
  }

  private _getList(){
    this._friendService.getFriend().subscribe(
      data => {
        this._networkFlag = true;
        this._friendList = data;
        for(let i = 0; i < this._friendList.length; i++)
        {
          if(this._friendList[i].avatar == null)
          {
            this._friendList[i].avatar = 'assets/img/temp-avatar.jpg';
          }
        }
      }, err => {
        console.log(err);
        if(this._networkFlag)
        {
          this._networkFlag = false;
          let toast = this._toastCtrl.create({
            message: 'network err',
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
        }
      });

    this._friendService.getRequest().subscribe(
      data => {
        this._networkFlag = true;
        this._requestList = data;
        for(let i = 0; i < this._requestList.length; i++)
        {
          if(this._requestList[i].avatar == null)
          {
            this._requestList[i].avatar = 'assets/img/temp-avatar.jpg';
          }
        }
      }, err => {
        console.log(err);
        if(this._networkFlag)
        {
          this._networkFlag = false;
          let toast = this._toastCtrl.create({
            message: 'network err',
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
        }
      });
  }

  private _acceptRequest(user){
    let alert = this._alertCtrl.create({
      title: 'Accept request',
      message: 'Do you wish to be friend with this guy?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this._friendService.acceptRequest(user.id).subscribe(
              data => {
                this._networkFlag = true;
                this._friendList = data;
                for(let i = 0; i < this._friendList.length; i++)
                {
                  if(this._friendList[i].avatar == null)
                  {
                    this._friendList[i].avatar = 'assets/img/temp-avatar.jpg';
                  }
                }
                for(let i = 0; i < this._requestList.length; i++)
                {
                  if(this._requestList[i] == user)
                  {
                     this._requestList.splice(i, 1);
                     break;
                  }
                }
              }, err => {
                console.log(err);
                if(this._networkFlag)
                {
                  this._networkFlag = false;
                  let toast = this._toastCtrl.create({
                    message: 'network err',
                    duration: 1500,
                    position: 'bottom'
                  });
                  toast.present();
                }
              });
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel'
        }
      ]
    });
    alert.present();
  }

  private _rejectRequest(user){
    this._friendService.rejectRequest(user.id).subscribe(
      ok => {
          for(let i = 0; i < this._requestList.length; i++)
          {
            if(this._requestList[i] == user)
            {
               this._requestList.splice(i, 1);
               break;
            }
          }
      }, err => {
        console.log(err);
        let toast = this._toastCtrl.create({
          message: 'network err',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      });
  }

  private _sayGoodbye(user){
    let alert = this._alertCtrl.create({
      title: 'Accept request',
      message: 'Do you wish to be break up with this guy?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this._friendService.sayGoodbye(user.id).subscribe(
              ok => {
                this._networkFlag = true;
                for(let i = 0; i < this._friendList.length; i++)
                {
                  if(this._friendList[i] == user)
                  {
                     this._friendList.splice(i, 1);
                     break;
                  }
                }
              }, err => {
                console.log(err);
                if(this._networkFlag)
                {
                  this._networkFlag = false;
                  let toast = this._toastCtrl.create({
                    message: 'network err',
                    duration: 1500,
                    position: 'bottom'
                  });
                  toast.present();
                }
              });
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel'
        }
      ]
    });
    alert.present();
  }
}
