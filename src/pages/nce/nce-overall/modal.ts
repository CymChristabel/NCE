import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';

import * as _ from 'lodash';

@Component({
  templateUrl: 'modal.html'
})

export class NCEModalPage{
	private _lession;
	constructor(private _platform: Platform, private _navParams: NavParams, private _viewCtrl: ViewController){
		this._lession = this._navParams.get('lession');
		
	}

	private _dismiss(){
		this._viewCtrl.dismiss();
	}
}