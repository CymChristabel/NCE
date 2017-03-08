import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { RecitationSlidePage } from '../recitation-slide/recitation-slide';
import { RecitationTestPage } from '../recitation-test/recitation-test';


@Component({
	selector: 'page-recitation-summary',
	templateUrl: 'recitation-summary.html'
})

export class RecitationSummaryPage{

	constructor(private _navCtrl: NavController, private _navParam: NavParams){
		this._navParam.get('wordList').pop();
	}

	private _goRecitationSlidePage(){
		this._navCtrl.pop();
		this._navCtrl.push(RecitationSlidePage, { id: this._navParam.get('id'), type: this._navParam.get('type') });
	}

	private _goRecitationTestPage(){
		this._navCtrl.pop();
		this._navCtrl.push(RecitationTestPage, this._navParam.data)
	}
}