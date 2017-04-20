import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { ResetPage } from '../reset-page/reset-page';

import { UserService } from '../../../providers/user.service'

@Component({
  selector: 'page-email-page',
  templateUrl: 'email-page.html'
})
export class EmailPage {
	private _email;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _toastCtrl: ToastController, private _userService: UserService) {

	}

	private _submit(){
		let EMAIL_REGEXP = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		if(EMAIL_REGEXP.test(this._email))
		{
			this._userService.requestForgetPassword(this._email).subscribe(
				status => {
					if(status.ok)
					{
						this._navCtrl.pop();
						this._navCtrl.push(ResetPage, { email: this._email });
					}
					else
					{
						let toast = this._toastCtrl.create({
							message: status.message,
							duration: 1500,
							position: 'bottom'
						});
						toast.present();
					}
				}, err => {
					console.log(err);
					let toast = this._toastCtrl.create({
						message: 'network error',
						duration: 1500,
						position: 'bottom'
					});
					toast.present();
				})
			
		}
		else
		{
			let toast = this._toastCtrl.create({
				message: 'illegal email',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
		}
	}
}
