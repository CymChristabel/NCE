import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { WordModalPage } from '../../word-modal/word-modal';
import { RecitationSlidePage } from '../recitation-slide/recitation-slide';

import { RecitationService } from '../../../providers/recitation.service';
import { StatisticsService } from '../../../providers/statistics.service';

import * as _ from 'lodash';

@Component({
  selector: 'page-recitation-result',
  templateUrl: 'recitation-result.html'
})

export class RecitationResultPage implements OnInit {
	private _word;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _modalCtrl: ModalController, private _toastCtrl: ToastController, private _recitationService: RecitationService, private _statisticsService: StatisticsService ) {
		this._word = _.groupBy(this._navParams.get('wordList'), (value) => { return value.correct });
		console.log(this._word);
		console.log(this._navParams.data);
	}

	ngOnInit(){
		if(this._navParams.get('type') == 'recitation')
		{
			this._recitationService.updateProgress(this._navParams.get('vocabularyID'), this._navParams.get('wordList').length);
		}
	}

	ionViewWillLeave(){
		let correct = this._word.true ? this._word.true.length : 0;
		let incorrect = this._word.false ? this._word.false.length : 0;
		if(correct == undefined)
		{
			correct = 0;
		}
		if(this._navParams.get('type') == 'recitation')
		{
			this._statisticsService.setRecitationStatistics(this._navParams.get('vocabularyID'), correct, incorrect);
		}
		else
		{
			this._statisticsService.setNCEStatistics(this._navParams.get('lessionID'), this._navParams.get('bookID'), correct, incorrect);
		}
	}

	private _showWordModal(word: any){
		let modal = this._modalCtrl.create(WordModalPage, { word: word });
		modal.present();
	}

	private _reciteAgain(){
		this._recitationService.updateProgress(this._navParams.get('vocabularyID'), -this._navParams.get('wordList').length);  //reset progress
		this._navCtrl.pop();
		this._navParams.data.review = true;
		this._navCtrl.push(RecitationSlidePage, this._navParams.data);
	}

	private _goNext(){
		this._navCtrl.pop();
		if(this._navParams.get('type') == 'recitation')
		{
			this._navCtrl.push(RecitationSlidePage, this._navParams.data);
		}
	}
}
