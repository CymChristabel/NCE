import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StatisticsService } from '../../providers/statistics.service';

import * as c3 from 'c3';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})

export class StatisticsPage {
	private _select;
	private _timeCountPieChart;
	private _date;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _statisticsService: StatisticsService) {
		this._select = 'overall';
		this._timeCountPieChart = true;
		this._updateDate();
	}

	ionViewDidLoad() {
		this._generateTimeCountPieChart();
		
	}

	private _updateDate(){
		this._date = moment();
	}

	private _generateTimeCountPieChart(){

		this._statisticsService.getTimeCount().then(
			statistics => {
				if(statistics && statistics[this._date.format('YYYY-MM-DD')])
				{
					let temp = statistics[this._date.format('YYYY-MM-DD')];
					this._timeCountPieChart = c3.generate({
										data: {
											columns: [
											 	_.take(temp.nceTime, temp.nceTime.length - 1),
												_.take(temp.recitationTime, temp.recitationTime.length - 1)
											],
											type: 'pie',
										 	onclick: (d, i) => { console.log("onclick", d, i); }
										},
										bindto: '#timeCountPieChart',
										size: {
							          		height: 250,
							          		width: 250
								        },
									});

					if(temp.nceTime[3] != 0 || temp.recitationTime[3] != 0)
					{
						setTimeout(() => {
							this._timeCountPieChart.load({
								columns: [
									temp.nceTime,
									temp.recitationTime
								]
							});

							temp.nceTime[2] = temp.nceTime[2] + temp.nceTime[3];
							temp.recitationTime[2] = temp.recitationTime[2] + temp.recitationTime[3];
							temp.nceTime[3] = 0;
							temp.recitationTime[3] = 0;

							this._statisticsService.resetCalled('time_count', statistics);
						}, 2000);
					}
				}
				else
				{
					this._timeCountPieChart = false;
				}
			}, err => console.log(err));
	}
}
