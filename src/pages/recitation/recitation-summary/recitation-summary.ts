import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { RecitationSlidePage } from '../recitation-slide/recitation-slide';
import { RecitationTestPage } from '../recitation-test/recitation-test';

import * as _ from 'lodash';

@Component({
	selector: 'page-recitation-summary',
	templateUrl: 'recitation-summary.html'
})

export class RecitationSummaryPage{

	constructor(private _navCtrl: NavController, private _navParam: NavParams){
		//delete temp value
		_.remove(this._navParam.get('wordList'), (value) => { return value == 'temp' });
		console.log(this._navParam.get('wordList'));
	}

	private _goRecitationSlidePage(){
		this._navParam.data.review = true;
		this._navCtrl.pop();
		this._navCtrl.push(RecitationSlidePage, this._navParam.data);
	}

	private _goRecitationTestPage(){
		this._navCtrl.pop();
		this._navCtrl.push(RecitationTestPage, this._navParam.data);
	}
}