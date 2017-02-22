import { Component } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { RecitationSlidePage } from '../recitation-slide/recitation-slide';
import { RecitationTestPage } from '../recitation-test/recitation-test';

import { Word, Vocabulary } from '../../interfaces/vocabulary.interface';

@Component({
	selector: 'page-recitation-summary',
	templateUrl: 'recitation-summary.html'
})

export class RecitationSummaryPage{
	private _summary: any;
	private _vocabularyID: number;

	constructor(private _navCtrl: NavController, private _navParam: NavParams){
		this._summary = this._navParam.get('wordList');
		this._vocabularyID = this._navParam.get('vocabularyID');
		this._summary.pop();//remove dummy item
	}

	private _goRecitationSlidePage(){
		this._navCtrl.pop()
		this._navCtrl.push(RecitationSlidePage, {
			isFromOverallPage: false,
			slide: this._summary,
			vocabularyID: this._vocabularyID
		})
	}

	private _goRecitationTestPage(){
		this._navCtrl.pop();
		this._navCtrl.push(RecitationTestPage, {
			wordList: this._summary,
			vocabularyID: this._vocabularyID
		})
	}
}