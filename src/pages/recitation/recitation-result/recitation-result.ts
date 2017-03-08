import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { WordModalPage } from '../../../word-modal';

import * as _ from 'lodash';

@Component({
  selector: 'page-recitation-result',
  templateUrl: 'recitation-result.html'
})

export class RecitationResultPage {
	private _word;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _modalCtrl: ModalController) {
		this._word = _.groupBy(this._navParams.get('wordList'), (value) => { return value.correct });
		console.log(this._word);
	}

	private _showWordModal(word: any){
		let modal = this._modalCtrl.create(WordModalPage, { word: word });
		modal.present();
	}
}
