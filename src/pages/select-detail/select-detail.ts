import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the SelectDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-select-detail',
	templateUrl: 'select-detail.html'
})

export class SelectDetailPage {
	private _detail;
	private _time;
	constructor(private _navCtrl: NavController, private _navParams: NavParams) {
		this._detail = this._navParams.get('detail');
		this._time = '10:00';
	}


}
