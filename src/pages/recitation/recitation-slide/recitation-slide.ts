import { Component, ViewChild, ElementRef } from '@angular/core';
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
	@ViewChild('audio') audioCtrl: ElementRef;
	private _slide;
	private _progress;
	private _audioPath;
	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _recitationService: RecitationService){

	}

	ionViewWillEnter()
	{
		if(this._navParam.get('review') == undefined)
		{
			if(this._navParam.get('type') == "NCE")
			{
				this._slide = this._navParam.get('wordList');
			}
			else if(this._navParam.get('type') == 'recitation')
			{
				this._progress = this._recitationService.getVocabularyForSlide(this._navParam.get('vocabularyID')).progress;
				if(this._recitationService.getVocabularyForSlide(this._navParam.get('vocabularyID')).word.length >= this._progress + 10)
				{
					this._slide = _.slice(this._recitationService.getVocabularyForSlide(this._navParam.get('vocabularyID')).word, this._progress, this._progress + 10);
				}
				else
				{
					this._slide = _.slice(this._recitationService.getVocabularyForSlide(this._navParam.get('vocabularyID')).word, this._progress, this._recitationService.getVocabularyForSlide(this._navParam.get('vocabularyID')).word.length - 1);
				}
			}
			this._initExplainnation();
			this._slide.push('temp');
			if(this._audioPath)
			{
				this._audioPath = this._recitationService.getAudioPath(this._slide[0].audio);
			}
			else
			{
				this._recitationService.getAlternateAudioPath(this._slide[0].name).then((path, err) => {
					if(err || !path)
					{
						return
					}
					this._audioPath = path;
				});
			}
			this._slider.slideTo(0, 10);
		}
		else
		{
			this._slide = this._navParam.get('wordList');
			this._slide.push('temp');
			this._audioPath = this._recitationService.getAudioPath(this._slide[0].audio);
			// if(this._audioPath)
			// {
				
			// }
			// else
			// {
			// 	this._recitationService.getAlternateAudioPath(this._slide[0].name).then((path, err) => {
			// 		if(err || !path)
			// 		{
			// 			return
			// 		}
			// 		this._audioPath = path;
			// 	});
			// }
			this._slider.slideTo(0, 10);
		}
	}

	ionViewDidEnter(){
		this.audioCtrl.nativeElement.play();
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
		if(!this._slider.isEnd()){
			if(this._slide[this._slider.getActiveIndex()].audio)
			{
				this.audioCtrl.nativeElement.src = this._recitationService.getAudioPath(this._slide[this._slider.getActiveIndex()].audio);
				this.audioCtrl.nativeElement.play();
			}
			else
			{
				this._recitationService.getAlternateAudioPath(this._slide[this._slider.getActiveIndex()].name).then((path, err) => {
					if(err || !path)
					{
						return
					}
					this.audioCtrl.nativeElement.src = path;
					this.audioCtrl.nativeElement.play();
				});
			}
			
		}
		else
		{
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