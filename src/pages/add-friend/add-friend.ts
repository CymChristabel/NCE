import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { FriendService } from '../../providers/friend.service';

@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html'
})
export class AddFriendPage {
	private _searchList;
 	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _friendService: FriendService, private _toastCtrl: ToastController, private _alertCtrl: AlertController) {
 		this._searchList = [];
 	}

  	private _onInput(ev){
  		if(ev.target.value && ev.target.value.trim() != '')
  		{
  			this._friendService.searchUser(ev.target.value).subscribe(
  		  			data => {
  		  				this._searchList = data;
  		  				for(let i = 0; i < this._searchList.length; i++)
  		  				{
  		  					if(this._searchList[i].avatar == null)
  		  					{
  		  						this._searchList[i].avatar = 'assets/img/temp-avatar.jpg';
  		  					}
  		  				}
  		  			}, err => {
  		  				console.log(err);
  		  				let toast = this._toastCtrl.create({
  		  					message: err,
  		  					duration: 2000,
  		  					position: 'bottom'
  		  				});
  		  				toast.present();
  		  			});
  		}
  		else
  		{
  			this._searchList = [];
  		}
	}

	private _sendRequest(user: any){
		let alert = this._alertCtrl.create({
			title: 'Confirm request',
			message: 'Do you wish to be friend with that guy?',
			buttons: [
				{
					text: 'Confirm',
					handler: () => {
						this._friendService.sendRequest(user.id).subscribe(
							status => {
								if(status.ok)
								{
									let toast = this._toastCtrl.create({
			  		  					message: 'request sended',
			  		  					duration: 2000,
			  		  					position: 'bottom'
			  		  				});
			  		  				toast.present();
								}
								else
								{
									let toast = this._toastCtrl.create({
			  		  					message: status.message,
			  		  					duration: 2000,
			  		  					position: 'bottom'
			  		  				});
			  		  				toast.present();
								}
							}, err => {
								console.log(err);
		  		  				let toast = this._toastCtrl.create({
		  		  					message: 'network error',
		  		  					duration: 2000,
		  		  					position: 'bottom'
		  		  				});
		  		  				toast.present();
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
