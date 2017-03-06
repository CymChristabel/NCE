import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { RecitationSlidePage } from '../recitation-slide/recitation-slide';

import { RecitationService } from '../../../providers/recitation.service';

import {CHART_DIRECTIVES} from '../../../ng2-charts';


import * as _ from 'lodash';


@Component({
  selector: 'page-recitation-vocabulary-overall',
  templateUrl: 'recitation-vocabulary-overall.html'
})



export class RecitationVocabularyOverallPage {
	private _vocabulary;

	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _recitationService: RecitationService) {
		this._vocabulary = this._recitationService.getVocabulary(this._navParam.get('id'));
	}

	private _downloadPress(){
		this._recitationService.downloadVocabulary(this._vocabulary.id);
	}

	private _goRecitationSlidePage(){
		this._navCtrl.push(RecitationSlidePage, {
			id: this._vocabulary.id,
			type: 'recitation'
		});
	}

}
