import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';

import { MainPage } from '../main/main';

import { StatisticsService } from '../../providers/statistics.service';
import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';
import { UserService } from '../../providers/user.service';
import { TaskService } from '../../providers/task.service';

import * as async from 'async';

@Component({
	selector: 'page-register',
  	templateUrl: 'register.html'
})

export class RegisterPage{

	private _registerForm: FormGroup;

	constructor(private _navCtrl: NavController, private _userService: UserService, private _app: App, private _loadingCtrl: LoadingController , private _formBuilder: FormBuilder, private _toastCtrl: ToastController, private _recitationService: RecitationService, private _nceService: NCEService, private _taskService: TaskService, private _statisticsService: StatisticsService){
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
						let loading = this._loadingCtrl.create({
							content: 'synchronizing...'
						});
						loading.present();
						async.series([
							(callback) => {
								this._taskService.synchronizeData(callback);
							},
							(callback) => {
								this._statisticsService.synchronizeData(callback);
							},
							(callback) => {
								this._recitationService.synchronizeData(callback);
							},
							(callback) => {
								this._nceService.synchronizeData(callback);
						}], (err, ok) => {
							loading.dismiss();
							this._navCtrl.setRoot(MainPage);
							// this._app.getRootNav().setRoot(MainPage);
						});
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