import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

import { StatisticsService } from '../../providers/statistics.service';

import * as c3 from 'c3';
import * as _ from 'lodash';
import * as moment from 'moment';

/*
	For time count bar/line chart level:
		1: year;
		2: month;
		3: day;
		4: specific day
*/

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})

export class StatisticsPage {
	private _select;
	private _date;
	private _display;

	//time chart related
	private _timeCount;
	private _recitation;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _loadingCtrl: LoadingController, private _menuCtrl: MenuController, private _actionSheetCtrl: ActionSheetController, private _toastCtrl: ToastController, private _statisticsService: StatisticsService) {
		this._select = 'overall';
		this._timeCount = { chartCtrl: true };
		this._display = true;
		this._recitation = {};
		this._updateDate();
	}

	ionViewWillLoad() {
		this._menuCtrl.swipeEnable(false);
		this._generateTodayTimeCountChart();
	}

	private _transformTimeCountChartType(){


		if(this._timeCount.chartLevel != 4)
		{
			let actionSheet = this._actionSheetCtrl.create({
			title: '改变图表类型',
			buttons: [
					{
						text: '折线图',
						handler: () => {
							this._timeCount.chartType = 'line';
							this._timeCount.chartCtrl.transform('line');
						}
					},
					{
						text: '曲线图',
						handler: () => {

							this._timeCount.chartType = 'spline';
							this._timeCount.chartCtrl.transform('spline');
						}
					},
					{
						text: '面积曲线图',
						handler: () => {
							this._timeCount.chartType = 'area-spline';
							this._timeCount.chartCtrl.transform('area-spline');
						}
					},
					{
						text: '柱状图',
						handler: () => {
							this._timeCount.chartType = 'bar';
							this._timeCount.chartCtrl.transform('bar');
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
		else
		{
			if(this._timeCount.chartType == 'spec_day_pie')
			{
				this._timeCount.chartType = 'spec_day_bar';
				this._timeCount.chartCtrl.transform('bar');
			}
			else if(this._timeCount.chartType == 'spec_day_bar')
			{
				this._timeCount.chartType = 'spec_day_pie';
				this._timeCount.chartCtrl.transform('pie');
			}
		}
		
	}

	private _updateDate(){
		this._date = moment();
	}

	private _viewHistoryTimeCountChart(){
		if(!this._timeCount.rowData)
		{
			this._statisticsService.getHistoryTimeCount().subscribe(
				data => {
					if(data.length >= 1)
					{
						this._display = true;
						this._timeCount.rowData = { date: [], nceTime: [], recitationTime: [] };
						this._timeCount.chartLevel = 3;
						for(let i = 0; i < data.length; i++)
						{
							this._timeCount.rowData.date.push(data[i].date);
							this._timeCount.rowData.nceTime.push(data[i].nceTime);
							this._timeCount.rowData.recitationTime.push(data[i].recitationTime);
						}
						setTimeout(() => {
							this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByDay(moment().format('YYYY-MM'));
						}, 1);
						
					}
					else
					{
						this._display = false;
						let alert = this._toastCtrl.create({
							message: '没有足够的数据',
							duration: 1500,
							position: 'bottom'
						});
						alert.present();
					}
			}, err => console.log(err));
		}
		else
		{
			if(this._timeCount.chartLevel == 1)
			{
				let alert = this._toastCtrl.create({
					message: '已到最顶层',
					duration: 1500,
					position: 'bottom'
				});
				alert.present();
			}
			else if(this._timeCount.chartLevel == 2)
			{
				this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByYear();
			}
			else if(this._timeCount.chartLevel == 3)
			{
				this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByMonth(this._timeCount.chartDate);
			}
			else
			{
				this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByDay(this._timeCount.chartDate);
			}
		}
		
	}


	private _generateHistoryTimeCountChartByYear(){
		let x = [], nceTime = [], recitationTime = [];
		this._timeCount.chartType = 'bar';
		this._timeCount.chartLevel = 1;
		this._timeCount.chartDate = this._timeCount.rowData.date[0];

		x.push(this._timeCount.rowData.date[0]);
		nceTime.push(this._timeCount.rowData.nceTime[0]);
		recitationTime.push(this._timeCount.rowData.recitationTime[0]);

		for(let i = 1; i < this._timeCount.rowData.date.length; i++)
		{
			if(moment(this._timeCount.rowData.date[i]).year() == moment(x[x.length - 1]).year())
			{
				nceTime[nceTime.length - 1] = nceTime[nceTime.length - 1] + this._timeCount.rowData.nceTime[i];
				recitationTime[recitationTime.length - 1] = recitationTime[recitationTime.length - 1] + this._timeCount.rowData.recitationTime[i];
			}
			else
			{
				x.push(this._timeCount.rowData.date[i]);
				nceTime.push(this._timeCount.rowData.nceTime[i]);
				recitationTime.push(this._timeCount.rowData.recitationTime[i]);
			}
		}

		for(let i = 0; i < x.length; i++)
		{
			nceTime[i] = moment.duration(nceTime[i] * 1000).asDays().toFixed(2);
			recitationTime[i] = moment.duration(recitationTime[i] * 1000).asDays().toFixed(2);
		}

		return c3.generate({
			data:{
				x: 'x',
				columns: [
					['x'].concat(x),
		            ['新概念'].concat(nceTime),
		            ['背诵单词'].concat(_.slice(recitationTime))
				],
				type: 'line',
				group: [
					['新概念','背诵单词']
				],
				onclick: (d, e) => {
					this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByMonth(d.x);
				}
			},
    		axis: {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%Y'
		            }
		        },
		        y: {
		        	label: 'days'
		        }
		    },
		    zoom: {
		    	enabled: true
		    },
		    tooltip :{
		    	show: false
		    },
		    bindto: '#timeCountChart'
    	});
	}

	private _generateHistoryTimeCountChartByMonth(d: string){
		let date = moment(d);
		let x = [], nceTime = [], recitationTime = [];
		this._timeCount.chartLevel = 2;

		for(let i = 0; i < 12; i++)
		{
			x.push(moment(moment(date).format('YYYY').concat('-01-01')).add(i, 'months').format('YYYY-MM-DD'));
			nceTime.push(0);
			recitationTime.push(0);
		}

		for(let i = 0; i < this._timeCount.rowData.date.length; i++)
		{
			if(moment(this._timeCount.rowData.date[i]).year() == date.year())
			{
				this._timeCount.chartDate = this._timeCount.rowData.date[i];
				for(let j = i; j < this._timeCount.rowData.date.length && moment(this._timeCount.rowData.date[j]).year() == date.year(); j++)
				{
					nceTime[moment(this._timeCount.rowData.date[j]).month()] = nceTime[moment(this._timeCount.rowData.date[j]).month()] + this._timeCount.rowData.nceTime[j];
					recitationTime[moment(this._timeCount.rowData.date[j]).month()] = recitationTime[moment(this._timeCount.rowData.date[j]).month()] + this._timeCount.rowData.recitationTime[j];
				}
				break;
			}
		}

		for(let i = 0; i < x.length; i++)
		{
			nceTime[i] = moment.duration(nceTime[i] * 1000).asMinutes().toFixed(2);
			recitationTime[i] = moment.duration(recitationTime[i] * 1000).asMinutes().toFixed(2);
		}

		return c3.generate({
			data: {
				x: 'x',
				columns: [
					['x'].concat(x),
		            ['新概念'].concat(nceTime),
		            ['背诵单词'].concat(_.slice(recitationTime))
				],
				type: 'line',
				group: [
					['新概念','背诵单词']
				],
				onclick: (d, e) => {
					this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByDay(d.x);
				}
			},
    		axis: {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%m'
		            }
		        },
		        y: {
		        	label: 'hours'
		        }
		    },
		    zoom: {
		    	enabled: true
		    },
		    subchart: {
		        show: true
		    },
		    tooltip :{
		    	show: false
		    },
		    bindto: '#timeCountChart'
    	});
	}

	private _generateHistoryTimeCountChartByDay(d: string){
		let date = moment(d);
		let x = [], nceTime = [], recitationTime = [];
		this._timeCount.chartLevel = 3;

		for(let i = 0; i < date.daysInMonth(); i++)
		{
			x.push(moment(moment(date).format('YYYY-MM').concat('-01')).add(i, 'days').format('YYYY-MM-DD'));
			nceTime.push(0);
			recitationTime.push(0);
		}
		for(let i = 0; i < this._timeCount.rowData.date.length; i++)
		{
			if(moment(this._timeCount.rowData.date[i]).format('YYYY-MM') == date.format('YYYY-MM'))
			{
				this._timeCount.chartDate = this._timeCount.rowData.date[i];
				for(let j = i; moment(this._timeCount.rowData.date[j]).month() == date.month() && j < this._timeCount.rowData.date.length; j++)
				{
					nceTime[moment(this._timeCount.rowData.date[j]).date() - 1] = nceTime[moment(this._timeCount.rowData.date[j]).date() - 1] + this._timeCount.rowData.nceTime[j];
					recitationTime[moment(this._timeCount.rowData.date[j]).date() - 1] = recitationTime[moment(this._timeCount.rowData.date[j]).date() - 1] + this._timeCount.rowData.recitationTime[j];
				}
				break;
			}
		}

		for(let i = 0; i < x.length; i++)
		{
			nceTime[i] = moment.duration(nceTime[i] * 1000).asMinutes().toFixed(2);
			recitationTime[i] = moment.duration(recitationTime[i] * 1000).asMinutes().toFixed(2);
		}

		return c3.generate({
			data: {
				x: 'x',
				columns: [
					['x'].concat(x),
		            ['新概念'].concat(nceTime),
		            ['背诵单词'].concat(_.slice(recitationTime))
				],
				type: 'line',
				group: [
					['新概念','背诵单词']
				],
				onclick: (d, e) => {
					let temp = this._timeCount.chartCtrl.data(['新概念', '背诵单词']);
					this._timeCount.chartCtrl = this._generateHistoryTimeCountChartBySpecDay(d.x, temp[0].values[d.index].value, temp[1].values[d.index].value);
				}
			},
    		axis: {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%d'
		            }
		        },
		        y: {
		        	label: 'minutes'
		        }
		    },
		    zoom: {
		    	enabled: true
		    },
		    subchart: {
		        show: true
		    },
		    tooltip :{
		    	show: false
		    },
		    bindto: '#timeCountChart'
    	});
	}

	private _generateHistoryTimeCountChartBySpecDay(d: string, nceTime: any, recitationTime: any){
		this._timeCount.chartType = 'spec_day_pie';
		this._timeCount.chartLevel = 4;
		this._timeCount.chartDate = moment(d).format('YYYY-MM-DD');

		nceTime = moment.duration(nceTime * 1000).asMinutes().toFixed(2);
		recitationTime = moment.duration(recitationTime * 1000).asMinutes().toFixed(2);

		return c3.generate({
			data: {
				columns: [
				 	['新概念', nceTime],
		            ['背诵单词', recitationTime]
				],
				type: 'pie'
			},
			axis: {
				y: {
					label: 'minutes'
				}
			},
			tooltip :{
				show: false
			},
			bindto: '#timeCountChart'
		});
	}

	private _generateTodayTimeCountChart(){
		this._timeCount.chartLevel = 4;
		this._statisticsService.getTimeCount().then(
			statistics => {
				if(statistics && statistics[this._date.format('YYYY-MM-DD')])
				{
					let temp = statistics[this._date.format('YYYY-MM-DD')];
					this._timeCount.chartDate = this._date.format('YYYY-MM-DD');
					this._timeCount.chartType = 'spec_day_pie';
					setTimeout(() => {
						this._timeCount.chartCtrl = c3.generate({
										data: {
											columns: [
											 	_.take(temp.nceTime, temp.nceTime.length - 1),
												_.take(temp.recitationTime, temp.recitationTime.length - 1)
											],
											type: 'pie'
										},
										tooltip :{
											show: false
										},
										bindto: '#timeCountChart'
									});

						if(temp.nceTime[3] != 0 || temp.recitationTime[3] != 0)
						{

							temp.nceTime[2] = temp.nceTime[2] + temp.nceTime[3];
							temp.recitationTime[2] = temp.recitationTime[2] + temp.recitationTime[3];
							temp.nceTime[3] = 0;
							temp.recitationTime[3] = 0;

							setTimeout(() => {
								this._timeCount.chartCtrl.load({
									columns: [
										temp.nceTime,
										temp.recitationTime
									]
								});

								this._statisticsService.resetCalled('time_count', statistics);
							}, 2000);
						}
					}, 1);
				}
				else
				{
					this._display = false;
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
			        type: 'line',
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

}
