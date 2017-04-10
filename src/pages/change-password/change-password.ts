import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';

import { UserService } from '../../providers/user.service';

@Component({
	selector: 'page-change-password',
  	templateUrl: 'change-password.html'
})

export class ChangePasswordPage{
	private _oldPassword;
	private _newPassword;
	private _repeatNewPassword;
	constructor(private _navCtrl: NavController, private _userService: UserService, private _toastCtrl: ToastController){
		
	}

	private _onSubmit(){
		if(this._repeatNewPassword != this._newPassword)
		{
			let toast = this._toastCtrl.create({
				message: 'Your new password mismatched, please check',
				duration: 2000,
				position: 'bottom'
			});
			toast.present();
		}
		else if(this._newPassword.length < 8 || this._newPassword.length > 16)
		{
			let toast = this._toastCtrl.create({
				message: 'Your new password is illegal, password should between 8 characters and 16 characters',
				duration: 2000,
				position: 'bottom'
			});
			toast.present();
		}
		else if(this._oldPassword < 8 || this._newPassword.length > 16)
		{
			let toast = this._toastCtrl.create({
				message: 'Your old password is illegal, password should between 8 characters and 16 characters',
				duration: 2000,
				position: 'bottom'
			});
			toast.present();
		}
		else
		{
			this._userService.changePassword(this._oldPassword, this._newPassword).subscribe(
				result => {
					if(result.err)
					{
						let toast = this._toastCtrl.create({
							message: result.message,
							duration: 2000,
							position: 'bottom'
						});
						toast.present();
					}
					else
					{
						let toast = this._toastCtrl.create({
							message: 'change password succeed',
							duration: 2000,
							position: 'bottom'
						});
						toast.present();
						setTimeout(() => {
							this._navCtrl.pop();
						}, 2000);
					}
				}, err => console.log(err));
		}
	}
}