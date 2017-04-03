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
	private _date;
	private _display;
	private _loadingList;
	//time chart related
	private _timeCount;
	private _recitationStatistics;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _loadingCtrl: LoadingController, private _menuCtrl: MenuController, private _actionSheetCtrl: ActionSheetController, private _toastCtrl: ToastController, private _statisticsService: StatisticsService) {
		this._menuCtrl.swipeEnable(false);
		this._timeCount = { chartCtrl: false };
		this._display = true;
		this._recitationStatistics = { chartCtrl: false };
		this._loadingList = { loading: {}, List: [] };
	}

	ionViewDidLoad() {
		this._loadingList.loading = this._loadingCtrl.create({
			content: 'init chart...'
		});
		this._loadingList.loading.present();

		this._generateTimeCountChart();
		this._generateRecitationStatisticsChart();
	}

	private _resolveChartLoading(){
		this._loadingList.list.push(true);
		if(this._loadingList.list.length == 2)
		{
			this._loadingList.loading.dismiss();
		}
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

	private _viewHistoryTimeCountChart(){
		// if(!this._timeCount.rowData)
		// {
		// 	let loading = this._loadingCtrl.create({
		// 		content: 'Fetching data from server'
		// 	});

		// 	loading.present();
		// 	this._statisticsService.getTimeCount().subscribe(
		// 		data => {
		// 			if(data.length >= 1)
		// 			{
		// 				this._display = true;
		// 				this._timeCount.rowData = { date: [], nceTime: [], recitationTime: [] };
		// 				this._timeCount.chartLevel = 3;
		// 				for(let i = 0; i < data.length; i++)
		// 				{
		// 					this._timeCount.rowData.date.push(data[i].date);
		// 					this._timeCount.rowData.nceTime.push(data[i].nceTime);
		// 					this._timeCount.rowData.recitationTime.push(data[i].recitationTime);
		// 				}
		// 				setTimeout(() => {
		// 					this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByDay(moment().format('YYYY-MM'));
		// 					loading.dismiss();
		// 				}, 1);
						
		// 			}
		// 			else
		// 			{
		// 				this._display = false;
		// 				loading.dismiss();
		// 				let toast = this._toastCtrl.create({
		// 					message: '没有足够的数据',
		// 					duration: 1500,
		// 					position: 'bottom'
		// 				});
		// 				toast.present();
		// 			}
		// 	}, err => {
		// 		loading.dismiss();
		// 		let toast = this._toastCtrl.create({
		// 			message: 'Your connection to the server is down, please check your network',
		// 			duration: 1500,
		// 			position: 'bottom'
		// 		});
		// 		toast.present();
		// 		console.log(err);
		// 	});
		// }
		// else
		// {
		// }
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
		
		return c3.generate({
			data: {
				columns: [
				 	['新概念', nceTime],
		            ['背诵单词', recitationTime]
				],
				type: 'pie',
				onclick: (d, e) => {
					console.log(d);
					let toast = this._toastCtrl.create({
						message: 'Time for ' + d.name + ' :' + d.value + ' minutes',
						duration: 1500,
						position: 'bottom'
					});
					toast.present();
				}
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

	private _generateTimeCountChart(){
		this._statisticsService.getTimeCount().then(timeCount => {
			if(timeCount.data.length > 0)
			{
				this._timeCount.rowData = { date: [], nceTime: [], recitationTime: [] };
				for(let i = 0; i < timeCount.data.length; i++)
				{
					this._timeCount.rowData.date.push(timeCount.data[i].date);
					this._timeCount.rowData.nceTime.push(timeCount.data[i].nceTime);
					this._timeCount.rowData.recitationTime.push(timeCount.data[i].recitationTime);
				}
				if(this._timeCount.rowData.date[this._timeCount.rowData.date.length - 1] == moment().format('YYYY-MM-DD'))
				{
					this._timeCount.chartLevel = 4;

					this._timeCount.chartCtrl = c3.generate({
						data: {
							columns: [
							 	['新概念', this._timeCount.rowData.nceTime[this._timeCount.rowData.nceTime.length - 1]],
					            ['背诵单词', this._timeCount.rowData.recitationTime[this._timeCount.rowData.recitationTime.length - 1]]
							],
							type: 'pie',
							onclick: (d, e) => {
								let toast = this._toastCtrl.create({
									message: 'Time for ' + d.name + ' :' + moment.duration(d.value * 1000).asMinutes().toFixed(2) + ' minutes',
									duration: 2000,
									position: 'bottom'
								});
								toast.present();
							}
						},
						tooltip :{
							show: false
						},
						bindto: '#timeCountChart'
					});
				}
				else
				{
					this._timeCount.chartCtrl = this._generateHistoryTimeCountChartByDay(this._timeCount.rowData.date[this._timeCount.rowData.date.length - 1]);
				}
			}
			else
			{
				this._timeCount.chartCtrl = false;
			}
			this._resolveChartLoading();
		});
	}

	private _generateRecitationStatisticsChart(){
		this._statisticsService.getRecitationStatistics().then(recitationStatistics => {
			if(recitationStatistics.data.length > 0)
			{
				this._recitationStatistics.rowData = { date: [], correct: [], incorrect: [] };
				for(let i = 0; i < recitationStatistics.data.length; i++)
				{
					this._recitationStatistics.rowData.date.push(recitationStatistics.data[i].date);
					this._recitationStatistics.rowData.correct.push(recitationStatistics.data[i].correct);
					this._recitationStatistics.rowData.incorrect.push(recitationStatistics.data[i].incorrect);
				}
				if(this._recitationStatistics.rowData.date[this._recitationStatistics.rowData.date.length - 1] == moment().format('YYYY-MM-DD'))
				{
					this._recitationStatistics.chartLevel = 4;
					setTimeout(() => {
						this._recitationStatistics.chartCtrl = c3.generate({
									data: {
										columns: [
										 	['错误', this._recitationStatistics.rowData.incorrect[this._recitationStatistics.rowData.date.length - 1]],
											['正确', this._recitationStatistics.rowData.correct[this._recitationStatistics.rowData.date.length - 1]]
										],
										type: 'pie'
									},
									tooltip :{
										show: false
									},
									bindto: '#recitationChart'
								});
						this._display = true;
					}, 1000);
				}
				else
				{
					this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartByDay(this._recitationStatistics.rowData.date[this._recitationStatistics.rowData.date.length - 1]);
				}
			}
			else
			{
				this._recitationStatistics.chartCtrl = false;
			}
			this._resolveChartLoading();
		});
	}

	private _generateHistoryRecitationStatisticsChartByDay(d: string){
		let date = moment(d);
		let x = [], correct = [], incorrect = [];
		this._recitationStatistics.chartLevel = 4;

		for(let i = 0; i < date.daysInMonth(); i++)
		{
			x.push(moment(moment(date).format('YYYY-MM').concat('-01')).add(i, 'days').format('YYYY-MM-DD'));
			correct.push(0);
			incorrect.push(0);
		}

		for(let i = 0; i < this._recitationStatistics.rowData.date.length; i++)
		{
			if(moment(this._recitationStatistics.rowData.date[i]).format('YYYY-MM') == date.format('YYYY-MM'))
			{
				this._recitationStatistics.chartDate = this._recitationStatistics.rowData.date[i];
				for(let j = i; moment(this._recitationStatistics.rowData.date[j]).month() == date.month() && j < this._recitationStatistics.rowData.date.length; j++)
				{
					correct[moment(this._recitationStatistics.rowData.date[j]).date() - 1] = correct[moment(this._recitationStatistics.rowData.date[j]).date() - 1] + this._recitationStatistics.rowData.correct[j];
					incorrect[moment(this._recitationStatistics.rowData.date[j]).date() - 1] = incorrect[moment(this._recitationStatistics.rowData.date[j]).date() - 1] + this._recitationStatistics.rowData.incorrect[j];
				}
				break;
			}
		}

		return c3.generate({
			data: {
				x: 'x',
				columns: [
					['x'].concat(x),
		            ['正确'].concat(correct),
		            ['错误'].concat(_.slice(incorrect))
				],
				type: 'line',
				group: [
					['正确','错误']
				],
				onclick: (d, e) => {
					let temp = this._recitationStatistics.chartCtrl.data(['正确', '错误']);
					this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartBySpecDay(d.x, temp[0].values[d.index].value, temp[1].values[d.index].value);
				}
			},
    		axis: {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%d'
		            }
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
		    bindto: '#recitationChart'
    	});
	}

	private _generateHistoryRecitationStatisticsChartBySpecDay(d: string, correct: number, incorrect: number){
		this._recitationStatistics.chartLevel = 4;
		this._recitationStatistics.chartDate = moment(d).format('YYYY-MM-DD');
		
		return c3.generate({
			data: {
				columns: [
				 	['错误', incorrect],
		            ['正确', correct]
				],
				type: 'pie',
				onclick: (d, e) => {
					console.log(d);
					let toast = this._toastCtrl.create({
						message: d.name + ': ' + d.value,
						duration: 1500,
						position: 'bottom'
					});
					toast.present();
				}
			},
			tooltip :{
				show: false
			},
			bindto: '#recitationChart'
		});
	}
}
