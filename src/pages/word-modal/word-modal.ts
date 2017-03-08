import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';

import * as _ from 'lodash';

@Component({
  templateUrl: 'word-modal.html'
})

export class WordModalPage{
	private _word;
	constructor(private _platform: Platform, private _navParams: NavParams, private _viewCtrl: ViewController){
		this._word = this._navParams.get('word');
	}
}