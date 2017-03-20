import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController } from 'ionic-angular';

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
	private _date;

	//time chart related
	private _timeCount;
	private _recitation;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController,private _toastCtrl: ToastController, private _statisticsService: StatisticsService) {
		this._select = 'overall';
		this._timeCount = true;

		this._recitation = {};
		this._updateDate();

	}

	ionViewWillLoad() {
		this._menuCtrl.swipeEnable(false);
		this._generateTimeCountChart();
		
	}

	private _updateDate(){
		this._date = moment();
	}

	private _generateTimeCountChart(){

		this._statisticsService.getTimeCount().then(
			statistics => {
				if(statistics && statistics[this._date.format('YYYY-MM-DD')])
				{
					let temp = statistics[this._date.format('YYYY-MM-DD')];
					
					this._timeCount = { rowData: [] };
					this._timeCount.rowData.push({
						date: this._date.format('YYYY-MM-DD'),
						nceTime: temp.nceTime[2] + temp.nceTime[3],
						recitationTime : temp.recitationTime[2] + temp.recitationTime[3]
					});

					this._timeCount.chartCtrl = c3.generate({
										data: {
											columns: [
											 	_.take(temp.nceTime, temp.nceTime.length - 1),
												_.take(temp.recitationTime, temp.recitationTime.length - 1)
											],
											type: 'pie',
										 	onclick: (d, i) => { console.log("onclick", d); }
										},
										bindto: '#timeCountChart'
									});

					if(temp.nceTime[3] != 0 || temp.recitationTime[3] != 0)
					{
						setTimeout(() => {
							this._timeCount.chartCtrl.load({
								columns: [
									temp.nceTime,
									temp.recitationTime
								]
							});

							//reset data
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
					this._timeCount = false;
				}
			}, err => console.log(err));
	}

	private _generateRecitationChart(){
		setTimeout(() => {
			this._recitation.chartCtrl = c3.generate({
			    data: {
			    	x: 'x',
			        columns: [
			        	['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06', '2013-01-07'],
			            ['错误', 30, 20, 50, 40, 60, 50, 90],
			            ['正确', 200, 130, 90, 240, 130, 220, 100],
			            ['total', 230, 150, 140, 280, 190, 270, 190],
			        ],
			        type: 'bar',
			        types: {
			            total: 'spline'
			        },
			        groups: [
			            ['错误','正确']
			        ]
			    },
			     axis: {
			        x: {
			            type: 'timeseries',
			            tick: {
			                format: '%m-%d'
			            }
			        }
			    },
			    bindto: '#recitationChart'
			});
		}, 1000);
	}

	private _viewHistoryTimeCount(){
		// this._statisticsService.getHistoryTimeCount().subscribe(data => {
		// 	if(data.length > 1)
		// 	{
		// 		this._historyTimeCount = { rowData: data, type: String, currentData: { column: [
		// 				['新概念'],   //column[0] for nce 
		// 				['背诵单词']	//column[1] for recitation
		// 			], category: [] } };
				
		// 		//check the size of data
		// 		if(moment(data[0].date).year() != moment(data[data.length - 1].date).year())
		// 		{
		// 			this._historyTimeCount.type = 'year';
		// 			this._historyTimeCount.currentData.category = _.range(moment(data[0].date).year(), moment(data[data.length - 1].date).year());
		// 			for(let i = 0, j = 0; i < data.length; i++)
		// 			{
		// 				if(moment(data[i].date).year() == this._historyTimeCount.currentData.category[j])
		// 				{
		// 					this._historyTimeCount.currentData.column[0][j + 1] = this._historyTimeCount.currentData.column[0][j + 1] + data[i].nceTime;
		// 					this._historyTimeCount.currentData.column[1][j + 1] = this._historyTimeCount.currentData.column[1][j + 1] + data[i].recitationTime;
		// 				}
		// 				else if 
		// 			}
		// 		}
		// 		else if(moment(data[0].date).month() != moment(data[data.length - 1].date).month())
		// 		{
		// 			this._historyTimeCount.type = 'month';
		// 		}
		// 		else
		// 		{
		// 			this._historyTimeCount.type = 'day';
		// 		}



		// 	}
		// 	else
		// 	{
		// 		this._historyTimeCount.type = 'false';
		// 	}
		// }, err => console.log(err));
	}

	//4 stands for right swipe and 2 is the opposite
	
	//1, 2, 3, 4 stands for year, month, week, day in timeCount type
	//it is also an mark in typeRange array for telling which type cannot be used 
	private _timeCountSwipeEvent(e){
		console.log(e.direction);
		if(e.direction == 4)
		{
			this._timeCount.chartCtrl.transform('bar');
		}
		else if(e.direction == 2)
		{
			this._timeCount.chartCtrl.transform('pie');
		}
		// if(this._timeCount.type == undefined)		//first time to swipe is always week statistics
		// {
		// 	this._statisticsService.getHistoryTimeCount().subscribe(data => {
		// 		if(data.length > 1)
		// 		{
		// 			//fetch history data
		// 			let temp = this._timeCount.rowData[0];
		// 			this._timeCount.rowData = data;
		// 			this._timeCount.rowData.push(temp);
		// 			//start within week
		// 			this._timeCount.type = 'week';

		// 			this._timeCount.processed
		// 		}
		// 		else
		// 		{
		// 			this._toastCtrl.create({
		// 				message: '你的历史记录还没超过一天呢',
		// 				duration: 1500,
		// 				position: 'bottom'
		// 			}).present();
		// 		}
		// 	}, err => console.log(err));
		// }
	}

	private _initHistoryStatistics(data: any){

	}
}
