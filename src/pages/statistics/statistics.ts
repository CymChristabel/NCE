import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, ActionSheetController } from 'ionic-angular';

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
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _menuCtrl: MenuController, private _actionSheetCtrl: ActionSheetController, private _toastCtrl: ToastController, private _statisticsService: StatisticsService) {
		this._select = 'overall';
		this._timeCount = true;

		this._recitation = {};
		this._updateDate();

	}

	ionViewWillLoad() {
		this._menuCtrl.swipeEnable(false);
		this._generateTimeCountChart();
		
	}

	private _presentActionSheet(){
		let actionSheet = this._actionSheetCtrl.create({
			title: 'change chart type',
			buttons: [
				{
					text: 'year',
					handler: () => {

						let temp = { date: [], nceTime: [], recitationTime: [] };
						temp.date.push(this._timeCount.rowData.date[0]);
						temp.nceTime.push(this._timeCount.rowData.nceTime[0]);
						temp.recitationTime.push(this._timeCount.rowData.recitationTime[0]);

						for(let i = 1; i < this._timeCount.rowData.date.length; i++)
						{
							if(moment(this._timeCount.rowData.date[i]).year() == moment(temp.date[temp.date.length - 1]).year())
							{
								temp.nceTime[temp.nceTime.length - 1] = temp.nceTime[temp.nceTime.length - 1] + this._timeCount.rowData.nceTime[i];
								temp.recitationTime[temp.recitationTime.length - 1] = temp.recitationTime[temp.recitationTime.length - 1] + this._timeCount.rowData.recitationTime[i];
							}
							else
							{

								temp.date.push(this._timeCount.rowData.date[i]);
								temp.nceTime.push(this._timeCount.rowData.nceTime[i]);
								temp.recitationTime.push(this._timeCount.rowData.recitationTime[i]);
							}
						}
						this._timeCount.chartCtrl = c3.generate({
							data:{
						    	x: 'x',
						        columns: [
						        	['x'].concat(temp.date),
						            ['新概念'].concat(temp.nceTime),
						            ['背诵单词'].concat(temp.recitationTime)
						        ],
						        type: 'bar',
						        groups: [
						            ['新概念','背诵单词']
						        ],
						        onclick: (d, e) => {
						        	let t = { date: [], nceTime: [], recitationTime: [] };

						        	t.date.push(this._timeCount.rowData.date[0]);
									t.nceTime.push(this._timeCount.rowData.nceTime[0]);
									t.recitationTime.push(this._timeCount.rowData.recitationTime[0]);

						        	for(let i = 0; i < this._timeCount.rowData.date.length && moment(this._timeCount.rowData.date[i]).year() == moment(d.x).year(); i++)
						        	{
						        		if(moment(this._timeCount.rowData.date[i]).month() == moment(t.date[t.date.length - 1]).month())
										{
											t.nceTime[t.nceTime.length - 1] = t.nceTime[t.nceTime.length - 1] + this._timeCount.rowData.nceTime[i];
											t.recitationTime[t.recitationTime.length - 1] = t.recitationTime[t.recitationTime.length - 1] + this._timeCount.rowData.recitationTime[i];
										}
										else
										{

											t.date.push(this._timeCount.rowData.date[i]);
											t.nceTime.push(this._timeCount.rowData.nceTime[i]);
											t.recitationTime.push(this._timeCount.rowData.recitationTime[i]);
										}
						        	}
						        	this._timeCount.chartCtrl = c3.generate({
										data:{
									    	x: 'x',
									        columns: [
									        	['x'].concat(t.date),
									            ['新概念'].concat(t.nceTime),
									            ['背诵单词'].concat(t.recitationTime)
									        ],
									        type: 'bar',
									        groups: [
									            ['新概念','背诵单词']
									        ],
						        		},
						        		axis: {
									        x: {
									            type: 'timeseries',
									            tick: {
									                format: '%m'
									            }
									        }
									    },
									    bindto: '#timeCountChart'
						        	});
						    	}
							},
						    axis: {
						        x: {
						            type: 'timeseries',
						            tick: {
						                format: '%Y'
						            }
						        }
						    },
						    bindto: '#timeCountChart'
						});
					}

				},
				{
					text: 'month',
					handler: () => {
						console.log('month');
					}
				},
				{
					text: 'cancel',
					role: 'cancel',
					handler: () => {
						console.log('cancel');
					}
				}
			]
		});

		actionSheet.present();
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
					this._timeCount = {};
					this._timeCount.chartType = 'day';
					this._timeCount.chartCtrl = c3.generate({
										data: {
											columns: [
											 	_.take(temp.nceTime, temp.nceTime.length - 1),
												_.take(temp.recitationTime, temp.recitationTime.length - 1)
											],
											type: 'pie'
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

	private _timeCountSwipeEvent(e){
		if(this._timeCount.rowData == undefined || this._timeCount.chartType == 'day')
		{
			this._statisticsService.getHistoryTimeCount().subscribe(
				data => {
					this._timeCount.chartType = 'month';
					this._timeCount.rowData = { date: [], nceTime: [], recitationTime: [], total: [] };

					for(let i = 0; i < data.length; i++)
					{
						this._timeCount.rowData.date.push(data[i].date);
						this._timeCount.rowData.nceTime.push(data[i].nceTime);
						this._timeCount.rowData.recitationTime.push(data[i].recitationTime);
						this._timeCount.rowData.total.push(data[i].nceTime + data[i].recitationTime);
					}
					if(this._timeCount.cursor == undefined)
					{
						this._timeCount.cursor = data.length;	
					}
					let temp = this._timeCount.cursor - 6 >= 0 ? this._timeCount.cursor - 6 : 0;

					this._timeCount.chartCtrl = c3.generate({
					    data: {
					    	x: 'x',
					        columns: [
					        	['x'].concat(_.slice(this._timeCount.rowData.date, temp, this._timeCount.cursor)),
					            ['新概念'].concat(_.slice(this._timeCount.rowData.nceTime, temp, this._timeCount.cursor)),
					            ['背诵单词'].concat(_.slice(this._timeCount.rowData.recitationTime, temp, this._timeCount.cursor))
					        ],
					        type: 'bar',
					        groups: [
					            ['新概念','背诵单词']
					        ],
					        onclick: (d, e) => {
					        	let date = moment(d.x).format('YYYY-MM-DD');
					        	for(let i = 0; i < this._timeCount.rowData.date.length; i++)
					        	{
					        		if(date == this._timeCount.rowData.date[i])
					        		{
					        			this._timeCount.cursor = i + 1;
					        			this._timeCount.chartType = 'day';
					        			this._timeCount.chartCtrl = c3.generate({
											data: {
												columns: [
												 	['新概念'].concat(this._timeCount.rowData.nceTime[i]),
												 	['背诵单词'].concat(this._timeCount.rowData.recitationTime[i])
												],
												type: 'pie'
											},
											bindto: '#timeCountChart'
										});
					        			break;
					        		}
					        	}
					        }
					    },
					    axis: {
					        x: {
					            type: 'timeseries',
					            tick: {
					                format: '%m-%d'
					            }
					        }
					    },
					    bindto: '#timeCountChart'
					});
			}, err => console.log(err));
		}
		else if(this._timeCount.chartType != 'day')
		{
			if(e.direction == 4 && this._timeCount.cursor - 6 >= 0 )
			{
				this._timeCount.cursor = this._timeCount.cursor - 1;	
				this._timeCount.chartCtrl.load({
					columns: [
						['x'].concat(_.slice(this._timeCount.rowData.date, this._timeCount.cursor - 6, this._timeCount.cursor)),
			            ['新概念'].concat(_.slice(this._timeCount.rowData.nceTime, this._timeCount.cursor - 6, this._timeCount.cursor)),
			            ['背诵单词'].concat(_.slice(this._timeCount.rowData.recitationTime, this._timeCount.cursor - 6, this._timeCount.cursor))
					]
				});
			}
			else if(e.direction == 2 && this._timeCount.cursor + 1 <= this._timeCount.rowData.date.length)
			{
				this._timeCount.cursor = this._timeCount.cursor + 1;
				this._timeCount.chartCtrl.load({
					columns: [
						['x'].concat(_.slice(this._timeCount.rowData.date, this._timeCount.cursor - 6, this._timeCount.cursor)),
			            ['新概念'].concat(_.slice(this._timeCount.rowData.nceTime, this._timeCount.cursor - 6, this._timeCount.cursor)),
			            ['背诵单词'].concat(_.slice(this._timeCount.rowData.recitationTime, this._timeCount.cursor - 6, this._timeCount.cursor))
					]
				});
			}
		}
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


	private _initHistoryStatistics(data: any){

	}
}
