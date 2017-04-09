import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { RecitationModalPage } from './modal';
import { RecitationSlidePage } from '../recitation-slide/recitation-slide';

import { RecitationService } from '../../../providers/recitation.service';
import { StatisticsService } from '../../../providers/statistics.service';


import { CHART_DIRECTIVES } from '../../../ng2-charts';


import * as _ from 'lodash';


@Component({
  selector: 'page-recitation-vocabulary-overall',
  templateUrl: 'recitation-vocabulary-overall.html'
})


export class RecitationVocabularyOverallPage{
	private _vocabulary;
	private _progressBar = 0;
	private _startTimeCount;
	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _statisticsService: StatisticsService, private _recitationService: RecitationService, private _modalCtrl: ModalController, private _loadingCtrl: LoadingController) {
		this._vocabulary = this._recitationService.getVocabulary(this._navParam.get('id'));
		this._startTimeCount = false;
		console.log(this._vocabulary);
	}

	ionViewWillEnter(){

	}

	ionViewWillUnload(){
		if(this._startTimeCount)
		{
			this._statisticsService.endTimeCount();
			this._startTimeCount = false;
		}
	}

	private _downloadPress(){
		let loading = this._loadingCtrl.create({
			content: 'Downloading'
		});

		loading.present();
		this._recitationService.downloadVocabulary(this._vocabulary.id).subscribe(
			result => {
				loading.dismiss();
			}, err => console.log(err));
	}

	private _showModal(){
		let modal = this._modalCtrl.create(RecitationModalPage, { 
				word: this._vocabulary.word,
				recitationService: this._recitationService,
				vocabularyID: this._vocabulary.id
			});
		modal.present();
	}

	private _goRecitationSlidePage(){
		this._statisticsService.startTimeCount('recitation');
		this._startTimeCount = true;
		
		this._navCtrl.push(RecitationSlidePage, {
			vocabularyID: this._vocabulary.id,
			type: 'recitation'
		});
	}
}
