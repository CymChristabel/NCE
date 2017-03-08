import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { WordModalPage } from '../../word-modal/word-modal';
import { RecitationSlidePage } from '../recitation-slide/recitation-slide';

import { RecitationService } from '../../../providers/recitation.service';

import * as _ from 'lodash';

@Component({
  selector: 'page-recitation-result',
  templateUrl: 'recitation-result.html'
})

export class RecitationResultPage {
	private _word;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _modalCtrl: ModalController, private _recitationService: RecitationService) {
		this._word = _.groupBy(this._navParams.get('wordList'), (value) => { return value.correct });
		console.log(this._word);
	}

	private _showWordModal(word: any){
		let modal = this._modalCtrl.create(WordModalPage, { word: word });
		modal.present();
	}

	private _reciteAgain(){
		this._navCtrl.pop();
		this._navCtrl.push(RecitationSlidePage, { id: this._navParams.get('id'), type: this._navParams.get('type') });
	}

	private _goNext(){
		this._recitationService.updateProgress(this._navParams.get('id'), this._navParams.get('wordList').length);
		this._navCtrl.pop();
		this._navCtrl.push(RecitationSlidePage, { id: this._navParams.get('id'), type: this._navParams.get('type') });
	}
}
