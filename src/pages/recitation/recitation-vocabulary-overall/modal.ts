import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController, ModalController } from 'ionic-angular';

import { WordModalPage } from '../../word-modal/word-modal';

import * as _ from 'lodash';

@Component({
  templateUrl: 'modal.html'
})

export class RecitationModalPage{
	private _tempWord;
	private _word;
	private _enableInfiniteScroll;

	constructor(private _platform: Platform, private _navParams: NavParams, private _viewCtrl: ViewController, private _modalCtrl: ModalController){
		this._tempWord = _.groupBy(this._navParams.get('word'), (value) => { return value.name[0].toUpperCase() });
		this._word = [];
		this._pushWord();
		this._enableInfiniteScroll = true;
	}

	private _dismiss(){
		this._viewCtrl.dismiss();
	}

	private _pushWord(word: any = undefined){
		if(!word)
		{
			let temp = 0;
			for(let key in this._tempWord){
				this._word.push(this._tempWord[key]);
				delete this._tempWord[key];
				temp = temp + 1;
				if(temp == 2)
				{
					break;
				}
			}
		}
		else
		{
			for(let key in word){
				this._word.push(word[key]);
			}
		}
		
	}

	private _doInfinite(infiniteScroll){
		setTimeout(() => {
			this._pushWord();
			infiniteScroll.complete();
		}, 999);
	}

	private _onInput(ev){
		if(ev.target.value && ev.target.value.trim() != '')
		{
			let temp = this._navParams.get('word');
			temp = temp.filter((item) => {
				return (item.name.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
			});
			this._word = [];
			this._enableInfiniteScroll = false;
			this._pushWord(_.groupBy(temp, (value) => { return value.name[0].toUpperCase() }));
		}
		else
		{
			this._tempWord = _.groupBy(this._navParams.get('word'), (value) => { return value.name[0].toUpperCase() });
			this._word = [];
			this._pushWord();
			this._enableInfiniteScroll = true;
		}
	}

	private _showWordModal(word: any){
		let modal = this._modalCtrl.create(WordModalPage, { vocabularyID: this._navParams.get('vocabularyID'), word: word, recitationService: this._navParams.get('recitationService') });
		modal.present();
	}
}