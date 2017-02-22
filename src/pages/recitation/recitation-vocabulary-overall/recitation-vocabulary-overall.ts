import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { RecitationSlidePage } from '../recitation-slide/recitation-slide';

import { RecitationService } from '../../../providers/recitation.service';

import {CHART_DIRECTIVES} from '../../../ng2-charts';

import { Word, Vocabulary } from '../../../interfaces/vocabulary.interface';


@Component({
  selector: 'page-recitation-vocabulary-overall',
  templateUrl: 'recitation-vocabulary-overall.html',
  providers: [RecitationService]
})

export class RecitationVocabularyOverallPage implements OnInit {
	private _vocabulary: Vocabulary;
	private _progress: number;

	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _recitationService: RecitationService) {
		this._vocabulary = this._navParam.get('vocabulary');
		this._progress = 80;
	}

	ngOnInit(){
		this._recitationService.getLocalVocabularyList(this._vocabulary.id)
			.then(vocabulary => {
				if(vocabulary == null || (vocabulary.updatedAt == null && this._vocabulary.updatedAt != null) || (vocabulary.updatedAt < this._vocabulary.updatedAt))
				{
					this._recitationService.getVocabulary(this._vocabulary.id)
						.subscribe(data => {
							for (let i = 0; i < data[0].word.length; i ++)
							{
								let temp_storage = [];
								let temp_mark = 0;
								let flag = true;

								for(var j = 0; j < data[0].word[i].explainnation.length; j++)
								{
									if((data[0].word[i].explainnation[j] >= 'a' && data[0].word[i].explainnation[j] <= 'z') || (data[0].word[i].explainnation[j] >= 'A' && data[0].word[i].explainnation[j] <= 'Z'))
									{
										if(!flag)
										{
											flag = true;
											temp_storage.push(data[0].word[i].explainnation.substr(temp_mark, j - temp_mark));
											temp_mark = j;
										}
									}
									else
									{
										flag = false;
									}
								}

								temp_storage.push(data[0].word[i].explainnation.substr(temp_mark, j - temp_mark));
								data[0].word[i].explainnation = temp_storage;
							}
							this._vocabulary = data[0];

							if(vocabulary != null)
							{
								this._vocabulary.currentProcess = vocabulary.currentProcess;
							}
							else
							{
								this._vocabulary.currentProcess = 0;
							}
							console.log('get from server');
							this._recitationService.setLocalVocabularyList(data[0]);
						}, error => console.log(error));
				}
				else
				{
					console.log('get from local storage');
					this._vocabulary = vocabulary;
				}
		}, error => console.log(error));
	}

	ionViewDidLoad(){
		//override lifecycle
		console.log(this._vocabulary);
	}

	private _goRecitationSlidePage(){
		this._navCtrl.push(RecitationSlidePage, {
			isFromOverallPage: true,
			vocabularyID: this._vocabulary.id
		});
	}
}
