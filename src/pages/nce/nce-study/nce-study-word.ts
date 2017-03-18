import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RecitationSlidePage } from '../../recitation/recitation-slide/recitation-slide';

import * as _ from 'lodash';

@Component({
  selector: 'page-nce-study-word',
  templateUrl: 'nce-study-word.html'
})
export class NCEStudyWordPage {
	private _wordList;

	constructor(private _navCtrl: NavController, private _navParams: NavParams) {
		if(this._wordList == undefined)
		{
			let tempWordList = _.remove(_.split(this._navParams.get('lession').word, '\n'), (value) => { return value.length != 0 });
			for(let i = 0; i < tempWordList.length; i++)
			{
				let temp = _.words(tempWordList[i]);
				tempWordList[i] = {};
				tempWordList[i].name = temp[0];
				tempWordList[i].explainnation = '';
				for(let j = 1; j < temp.length; j++)
				{
					tempWordList[i].explainnation = tempWordList[i].explainnation + ' ' + temp[j];
				}
			}
			this._wordList= tempWordList;
		}
	}

	private _goRecitationSlidePage(){
		this._navCtrl.push(RecitationSlidePage, { 
			wordList: this._wordList,
			bookID: this._navParams.get('bookID'),
			lessionID: this._navParams.get('lession').id,
			type: 'NCE'
		});
	}
}
