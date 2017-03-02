import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { RecitationSummaryPage } from '../recitation-summary/recitation-summary';

import { RecitationService } from '../../../providers/recitation.service';

import { Word, Vocabulary } from '../../../interfaces/vocabulary.interface';

@Component({
	selector: 'page-recitation-slide',
	templateUrl: 'recitation-slide.html',
	providers: [RecitationService]
})

export class RecitationSlidePage implements OnInit{
	@ViewChild('_slider') _slider: Slides;

	private _vocabularyID: number;
	private _slide: any;
	private _isEndOfSlide: boolean;

	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _recitationService: RecitationService){
		// if(this._navParam.get('isRecitation'))
		// {
		// 	this._slide = this._navParam.get('')
		// }
	}


	ngOnInit(){
		if(this._navParam.get('isFromOverallPage'))
		{
			this._recitationService.getLocalVocabularyList(this._vocabularyID)
				.then(vocabulary => {		
					if(vocabulary.word.length >= vocabulary.currentProcess + 10)
					{
						this._slide = vocabulary.word.slice(vocabulary.currentProcess, vocabulary.currentProcess + 10);
					}
					else
					{
						this._slide = vocabulary.word.slice(vocabulary.currentProcess, vocabulary.word.length - 1);
					}
					this._slide.push('temp');
			});

		}
		else
		{
			this._slide = this._navParam.get('slide');
		}
	}

	ionViewDidLoad(){
		//override lifecycle
		console.log(this._slider);
	}

	onSlideChanged(){
		if(this._isEndOfSlide = this._slider.isEnd()){
			this._navCtrl.pop();
			this._navCtrl.push(RecitationSummaryPage, { 
				wordList: this._slide,
				vocabularyID: this._vocabularyID
			});
		}
	}
}