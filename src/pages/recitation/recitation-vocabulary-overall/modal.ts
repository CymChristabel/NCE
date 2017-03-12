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
		console.log(word);
		//deal with explainnation
		let temp = _.words(word.explainnation);
		let mark = -1;
		for(let i = 0; i < temp.length; i++)
		{
			if(temp[i][0].toLowerCase() >= 'a' && temp[i][0].toLowerCase() <= 'z')
			{
				mark = i;
				temp[i] = temp[i] + '.';
			}
			else
			{
				temp[mark] = temp[mark] + ' ' + temp[i];
			}
		}
		//remove Chinese item
		_.remove(temp, (value) => {
			return !(value[0].toLowerCase() >= 'a' && value[0].toLowerCase() <= 'z');
		});
		word.explainnation = temp;
		
		//deal with example
		temp  =  _.split(word.example, '\n');
		word.example = [];
		for(let i = 0; i < temp.length; i = i + 2)
		{
			word.example.push({engText: temp[i], chnText: temp[i + 1]});
		}

		let modal = this._modalCtrl.create(WordModalPage, { word: word });

		modal.present();
	}
}