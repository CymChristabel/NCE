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

	private _id;
	private _slide;
	private _progress;

	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _recitationService: RecitationService){
	}

	ionViewWillEnter()
	{
		console.log(this._navParam.data);
		if(this._id == undefined)
		{
			this._id = this._navParam.get('id');
		}
		if(this._navParam.get('type') == "NCE" && this._slide == undefined)
		{
			console.log(1);
		}
		else if(this._navParam.get('type') == 'recitation' && (this._slide == undefined || this._progress != this._recitationService.getVocabulary(this._id).progress))
		{
			this._progress = this._recitationService.getVocabulary(this._id).progress;

			if(this._recitationService.getVocabulary(this._id).word.length >= this._progress + 10)
			{
				this._slide = _.slice(this._recitationService.getVocabulary(this._id).word, this._progress, this._progress + 10);
			}
			else
			{
				this._slide = _.slice(this._recitationService.getVocabulary(this._id).word, this._progress, this._recitationService.getVocabulary(this._id).word.length - 1);
			}

			for(let i = 0; i < this._slide.length; i++)
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
			
			this._slide.push('temp');
		}
		this._slider.slideTo(0, 10);
	}

	onSlideChanged(){
		if(this._slider.isEnd()){
			this._navCtrl.pop();
			this._navCtrl.push(RecitationSummaryPage, { 
				wordList: this._slide,
				id: this._id,
				type: this._navParam.get('type')
			});
		}
	}
}