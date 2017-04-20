import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { GeneralPage } from '../general/general';

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
		let EMAIL_REGEXP =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;

        if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
            return { "incorrectMailFormat": true };
        }

        return null;
	}

	private _onSubmit(form: FormGroup){
		if(form.valid)
		{
			this._userService.signUp(form.value).subscribe(
				result => {
					if(result == true)
					{
						this._navCtrl.setRoot(GeneralPage);
					}
					else if(result == -1)
					{
						this._toastCtrl.create({
							message: 'email already used',
							duration: 1500,
							position: 'bottom'
						}).present();
					}
				},err => console.log(err)
			);
		}
	}
}	