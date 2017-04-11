import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user.service';

@Component({
	selector: 'page-change-user-detail',
	templateUrl: 'change-user-detail.html'
})

export class ChangeUserDetailPage {
	private _nickname;
	private _user;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _userService: UserService) {
		this._user = this._userService.getUser().user;
		this._nickname = this._user.nickname;
	}

	private _submit(){
		this._userService.changeNickname(this._nickname).subscribe(
			ok => this._navCtrl.pop(), err => {
				console.log(err);
				this._navCtrl.pop();
			});
	}
}
