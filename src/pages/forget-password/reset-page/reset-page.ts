import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController } from 'ionic-angular';

import { UserService } from '../../../providers/user.service';

@Component({
  selector: 'page-reset-page',
  templateUrl: 'reset-page.html'
})
export class ResetPage {
	private _token;
	private _password;
	private _repeatPassword;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _toastCtrl: ToastController, private _userService: UserService) {

	}

	private _submit(){
		if(this._password.length >=8 && this._password.length <=16)
		{
			if(this._password == this._repeatPassword)
			{
				this._userService.resolveForgetPassword(this._token, this._password).subscribe(
					status => {
						if(status.ok)
						{
							this._navCtrl.pop();
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
							message: 'network err',
							duration: 1500,
							position: 'bottom'
						});
						toast.present();
					});
			}
			else
			{
				let toast = this._toastCtrl.create({
					message: 'password should between 8 and 16 characters',
					duration: 1500,
					position: 'bottom'
				});
				toast.present();
			}
		}
		else
		{
			let toast = this._toastCtrl.create({
				message: 'password should between 8 and 16 characters',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
		}
	}
}
