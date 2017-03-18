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
	}

	ionViewDidLoad() {
		this._generateTimeCountPieChart();
		this._updateDate();
	}

	private _updateDate(){
		this._date = moment();
	}

	private _generateTimeCountPieChart(){

		this._statisticsService.getTimeCount().then(
			timeCount => {
				console.log(timeCount);
				if(timeCount.statistics[this._date.format('YYYY-MM-DD')])
				{
					let temp = timeCount.statistics;
					this._timeCountPieChart = c3.generate({
										data: {
											columns: [
											 	[ '新概念', 0.1 ],
												[ '背诵单词', 0.1 ]
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

					if(timeCount.hasCalled)
					{
						this._timeCountPieChart.load({
								columns: [
									temp.nceTime,
									temp.recitationTime
								]
							});
					}
					else
					{
						this._timeCountPieChart.load({
								columns: [
									_.take(temp.nceTime, temp.nceTime.length - 1),
									_.take(temp.recitationTime, temp.recitationTime.length - 1)
								]
							});

						setTimeout(() => {
							this._timeCountPieChart.load({
								columns: [
									temp.nceTime,
									temp.recitationTime
								]
							});
						}, 2000);

						timeCount.hasCalled = true;
						this._statisticsService.resetCalled('time_count', timeCount);
					}
				}
				else
				{
					this._timeCountPieChart = false;
				}
			}, err => console.log(err));
	}
}
