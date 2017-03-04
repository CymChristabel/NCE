import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { UserService } from '../../providers/user.service';

@Component({
	selector: 'page-register',
  	templateUrl: 'register.html'
})

export class RegisterPage{

	private _registerForm: FormGroup;

	constructor(private _navCtrl: NavController, private _userService: UserService, private _formBuilder: FormBuilder, private _toastCtrl: ToastController){
			this._registerForm = this._formBuilder.group({
				'email': new FormControl('test@qqq.com', Validators.compose([Validators.required, this._mailFormat])),
		        'password': new FormControl('1111111111',Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])),
		        'repeatPassword': new FormControl('1111111111', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])),
		        'nickname': new FormControl('John Doe')
			});
	}

	private _mailFormat(c: AbstractControl){
		let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
            return { "incorrectMailFormat": true };
        }

        return null;
	}

	private _onSubmit(form: FormGroup){
		if(form.valid)
		{
			this._userService.signUp(form.value).subscribe(
				data => {
					if(data.token = -1)
					{
						let toast = this._toastCtrl.create({
							message: 'email already used',
							duration: 1500,
							position: 'bottom'
						})
						toast.present();
					}
					else
					{
						this._userService.updateUser(data);
					}
				},err => console.log(err)
			);
		}
	}
}	