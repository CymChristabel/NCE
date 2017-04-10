import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { RecitationSummaryPage } from '../recitation-summary/recitation-summary';

import { RecitationService } from '../../../providers/recitation.service';

import * as _ from 'lodash';

@Component({
	selector: 'page-recitation-slide',
	templateUrl: 'recitation-slide.html'
})

export class RecitationSlidePage{
	@ViewChild('_slider') _slider: Slides;

	private _slide;
	private _progress;

	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _recitationService: RecitationService){
	}

	ionViewWillEnter()
	{
		// if(this._id == undefined)
		// {
		// 	this._id = this._navParam.get('id');
		// }
		if(this._navParam.get('review') == undefined)
		{
			if(this._navParam.get('type') == "NCE")
			{
				this._slide = this._navParam.get('wordList');
			}
			else if(this._navParam.get('type') == 'recitation')
			{
				this._progress = this._recitationService.getVocabulary(this._navParam.get('vocabularyID')).progress;
				let temp = 
				if(this._recitationService.getVocabulary(this._navParam.get('vocabularyID')).word.length >= this._progress + 10)
				{
					this._slide = _.slice(this._recitationService.getVocabulary(this._navParam.get('vocabularyID')).word, this._progress, this._progress + 10);
				}
				else
				{
					this._slide = _.slice(this._recitationService.getVocabulary(this._navParam.get('vocabularyID')).word, this._progress, this._recitationService.getVocabulary(this._navParam.get('vocabularyID')).word.length - 1);
				}
			}
			this._initExplainnation();
			this._slide.push('temp');
			this._slider.slideTo(0, 10);
		}
		else
		{
			this._slide = this._navParam.get('wordList');
		}
	}

	private _initExplainnation(){
		for(let i = 0; i < this._slide.length && this._slide[i] != 'temp'; i++)
		{
			let temp = _.words(this._slide[i].explainnation);
			let tempWord = undefined;
			this._slide[i].explainnation = [];

			for(let j = 0; j < temp.length; j++)
			{
				if(temp[j][0] >='a' && temp[j][0] <= 'z')
				{
					if(tempWord != undefined)
					{
						this._slide[i].explainnation.push(tempWord);
					}
					tempWord = temp[j];
				}
				else
				{
					tempWord = tempWord + ' ' + temp[j];
				}
				if(j == temp.length - 1)
				{
					this._slide[i].explainnation.push(tempWord);
				}
			}
		}

	}

	onSlideChanged(){
		if(this._slider.isEnd()){
			this._navCtrl.pop();
			if(this._navParam.get('type') == 'NCE')
			{
				this._navCtrl.push(RecitationSummaryPage,{
					wordList: this._slide,
					type: this._navParam.get('type'),
					lessionID: this._navParam.get('lessionID'),
					bookID: this._navParam.get('bookID')
				});
			}
			else
			{
				this._navCtrl.push(RecitationSummaryPage,{
					wordList: this._slide,
					type: this._navParam.get('type'),
					vocabularyID: this._navParam.get('vocabularyID')
				});
			}			
		}
	}
}