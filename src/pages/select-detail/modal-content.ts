import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';

import * as _ from 'lodash';

@Component({
  templateUrl: 'modal-content.html'
})

export class ModalContentPage{
	private _detail;
	private _isWord;
	constructor(private _platform: Platform, private _navParams: NavParams, private _viewCtrl: ViewController){
		if(this._navParams.get('type') == 'NCE')
		{
			this._isWord = false;
			this._detail = this._navParams.get('detail');
		}
		else
		{
			this._isWord = true;
			this._detail = _.groupBy(this._navParams.get('detail'), (key) => { return key.name[0].toUpperCase() });
			let temp = [];
			for(let key in this._detail){
				temp.push(this._detail[key]);
			}
			this._detail = temp;
		}
		
	}

	private _dismiss(){
		this._viewCtrl.dismiss();
	}
}