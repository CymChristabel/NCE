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
	private _timeCountPieChart;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _statisticsService: StatisticsService) {

	}

	ionViewDidLoad() {
		this._generateTimeCountPieChart();
		let m = moment().second(1000);
		console.log(m.subtract(moment()).format('h,m,s'));
	}

	private _generateTimeCountPieChart(){
		let date = moment();
		this._statisticsService.getTimeCount(date.format("YYYY-MM-DD").toString()).then(
			timeCount => {
				if(timeCount)
				{
					//if user do call updated data before
					this._timeCountPieChart = c3.generate({
										data: {
											columns: [
												['temp', 0]
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
									timeCount.NCE,
									timeCount.recitation
								]
							});
					}
					else
					{
						this._timeCountPieChart.load({
								columns: [
									_.take(timeCount.NCE, timeCount.NCE.length - 1),
									_.take(timeCount.recitation, timeCount.NCE.length - 1)
								]
							});

						setTimeout(() => {
							this._timeCountPieChart.load({
								columns: [
									timeCount.NCE,
									timeCount.recitation
								]
							});
						}, 1500);

						timeCount.hasCalled = true;
						this._statisticsService.resetCalled('time_count:' + date.format("YYYY-MM-DD"), timeCount);
					}
				}
				else
				{
					this._timeCountPieChart = false;
				}
			}, err => console.log(err));
	}
}
