import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, App } from 'ionic-angular';

import { ChangePasswordPage } from '../change-password/change-password';
import { LoginPage } from '../login/login';

import { UserService } from '../../providers/user.service';
import { StatisticsService } from '../../providers/statistics.service';
import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';
import { TaskService } from '../../providers/task.service';

import * as async from 'async';

@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html'
})
export class SettingPage {
	private _user;
	constructor(private _navCtrl: NavController, private _toastCtrl: ToastController, private _app: App, private _alertCtrl: AlertController, private _navParams: NavParams, private _taskService: TaskService, private _userService: UserService, private _recitationService: RecitationService, private _nceService: NCEService, private _statisticsService: StatisticsService, private _loadingCtrl: LoadingController) {
		this._user = this._userService.getUser().user;
	}

	private _logOut(){
		let alert = this._alertCtrl.create({
			title: 'Confirm log out',
			message: 'Do you wish to log out? After logging out your data will be cleared',
			buttons: [
				{
					text: 'Confirm',
					handler: () => {
						this._userService.logout().then(
							ok => {
								this._app.getRootNav().setRoot(LoginPage)
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

	private _goChangePasswordPage(){
		this._navCtrl.push(ChangePasswordPage);
	}

	private _synchronize(){
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
				if(err)
				{
					let toast = this._toastCtrl.create({
						message: 'Netword error occured',
						duration: 2000,
						position: 'bottom' 
					});
					toast.present();
				}
				loading.dismiss();
			});
	}
}
