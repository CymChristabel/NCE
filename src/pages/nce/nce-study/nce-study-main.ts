import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NCEStudyTextPage } from './nce-study-text';
import { NCEStudyWordPage } from './nce-study-word';

import { StatisticsService } from '../../../providers/statistics.service';

@Component({
  selector: 'page-nce-study-main',
  templateUrl: 'nce-study-main.html'
})
export class NCEStudyMainPage {
	private _nceStudyTextPage;
	private _nceStudyWordPage;
	public params;

	constructor(private _navParams: NavParams, private _navCtrl: NavController, private _statisticsService: StatisticsService) {
		this._nceStudyTextPage = NCEStudyTextPage;
		this._nceStudyWordPage = NCEStudyWordPage;
		this.params = this._navParams.data;
		this.params.navCtrl = this._navCtrl;

		this._statisticsService.startTimeCount('NCE');
	}

	ionViewWillLeave(){
		this._statisticsService.endTimeCount();
	}

}
