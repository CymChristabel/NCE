import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

import { StatisticsService } from '../../providers/statistics.service';
import { NCEService } from '../../providers/nce.service';

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
	private _loadingList;
	//time chart related
	private _timeCount;
	private _recitationStatistics;
	private _nceStatistics;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _loadingCtrl: LoadingController, private _menuCtrl: MenuController, private _nceService: NCEService, private _actionSheetCtrl: ActionSheetController, private _toastCtrl: ToastController, private _statisticsService: StatisticsService) {
		this._menuCtrl.swipeEnable(false);
		this._timeCount = { chartCtrl: false };
		this._recitationStatistics = { chartCtrl: false };
		this._nceStatistics = { chartCtrl: false, title: false };
		this._loadingList = { loading: {}, list: [] };
	}

	ionViewWillLoad() {
		this._loadingList.loading = this._loadingCtrl.create({
			content: 'init chart...'
		});
		this._loadingList.loading.present();

		this._generateTimeCountChart();
		this._generateRecitationStatisticsChart();
		this._generateNCEStatisticsChart();
	}

	private _resolveChartLoading(){
		this._loadingList.list.push(1);
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

	private _switchTimeCountChart(){
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
		            ['背诵单词'].concat(recitationTime)
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
		            ['背诵单词'].concat(recitationTime)
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
			nceTime[i] = moment.duration(nceTime[i] * 1000).asMinutes().toFixed(3);
			recitationTime[i] = moment.duration(recitationTime[i] * 1000).asMinutes().toFixed(3);
		}

		return c3.generate({
			data: {
				x: 'x',
				columns: [
					['x'].concat(x),
		            ['新概念'].concat(nceTime),
		            ['背诵单词'].concat(recitationTime)
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
					this._timeCount.chartCtrl = this._generateHistoryTimeCountChartBySpecDay(this._timeCount.rowData.date[this._timeCount.rowData.date.length - 1], this._timeCount.rowData.nceTime[this._timeCount.rowData.nceTime.length - 1], this._timeCount.rowData.recitationTime[this._timeCount.rowData.recitationTime.length - 1])	
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

	private _switchRecitationStatisticsChart(){
			if(this._recitationStatistics.chartLevel == 1)
			{
				let alert = this._toastCtrl.create({
					message: '已到最顶层',
					duration: 1500,
					position: 'bottom'
				});
				alert.present();
			}
			else if(this._recitationStatistics.chartLevel == 2)
			{
				this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartByYear();
			}
			else if(this._recitationStatistics.chartLevel == 3)
			{
				this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartByMonth(this._recitationStatistics.chartDate);
			}
			else
			{
				this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartByDay(this._recitationStatistics.chartDate);
			}
	}

	private _transformRecitationStatisticsChartType(){
		if(this._recitationStatistics.chartLevel != 4)
		{
			let actionSheet = this._actionSheetCtrl.create({
			title: '改变图表类型',
			buttons: [
					{
						text: '折线图',
						handler: () => {
							this._recitationStatistics.chartType = 'line';
							this._recitationStatistics.chartCtrl.transform('line');
						}
					},
					{
						text: '曲线图',
						handler: () => {

							this._recitationStatistics.chartType = 'spline';
							this._recitationStatistics.chartCtrl.transform('spline');
						}
					},
					{
						text: '面积曲线图',
						handler: () => {
							this._recitationStatistics.chartType = 'area-spline';
							this._recitationStatistics.chartCtrl.transform('area-spline');
						}
					},
					{
						text: '柱状图',
						handler: () => {
							this._recitationStatistics.chartType = 'bar';
							this._recitationStatistics.chartCtrl.transform('bar');
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
			if(this._recitationStatistics.chartType == 'spec_day_pie')
			{
				this._recitationStatistics.chartType = 'spec_day_bar';
				this._recitationStatistics.chartCtrl.transform('bar');
			}
			else if(this._recitationStatistics.chartType == 'spec_day_bar')
			{
				this._recitationStatistics.chartType = 'spec_day_pie';
				this._recitationStatistics.chartCtrl.transform('pie');
			}
		}
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
					this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartBySpecDay(this._recitationStatistics.rowData.date[this._recitationStatistics.rowData.date.length - 1], this._recitationStatistics.rowData.correct[this._recitationStatistics.rowData.date.length - 1], this._recitationStatistics.rowData.incorrect[this._recitationStatistics.rowData.date.length - 1]);
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

	private _generateHistoryRecitationStatisticsChartByYear(){
		let x = [], correct = [], incorrect = [];
		this._recitationStatistics.chartType = 'line';
		this._recitationStatistics.chartLevel = 1;
		this._recitationStatistics.chartDate = this._recitationStatistics.rowData.date[0];

		x.push(this._recitationStatistics.rowData.date[0]);
		correct.push(this._recitationStatistics.rowData.correct[0]);
		incorrect.push(this._recitationStatistics.rowData.incorrect[0]);

		for(let i = 1; i < this._recitationStatistics.rowData.date.length; i++)
		{
			if(moment(this._recitationStatistics.rowData.date[i]).year() == moment(x[x.length - 1]).year())
			{
				correct[correct.length - 1] = correct[correct.length - 1] + this._recitationStatistics.rowData.correct[i];
				incorrect[incorrect.length - 1] = incorrect[incorrect.length - 1] + this._recitationStatistics.rowData.incorrect[i];
			}
			else
			{
				x.push(this._recitationStatistics.rowData.date[i]);
				correct.push(this._recitationStatistics.rowData.correct[i]);
				incorrect.push(this._recitationStatistics.rowData.incorrect[i]);
			}
		}

		return c3.generate({
			data:{
				x: 'x',
				columns: [
					['x'].concat(x),
		            ['正确'].concat(correct),
		            ['错误'].concat(incorrect)
				],
				type: 'line',
				group: [
					['正确','错误']
				],
				onclick: (d, e) => {
					this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartByMonth(d.x);
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
		        	label: 'num'
		        }
		    },
		    tooltip :{
		    	show: false
		    },
		    bindto: '#recitationChart'
    	});
	}

	private _generateHistoryRecitationStatisticsChartByMonth(d: string){
		let date = moment(d);
		let x = [], correct = [], incorrect = [];
		this._recitationStatistics.chartLevel = 2;
		this._recitationStatistics.chartType = 'line';

		for(let i = 0; i < 12; i++)
		{
			x.push(moment(moment(date).format('YYYY').concat('-01-01')).add(i, 'months').format('YYYY-MM-DD'));
			correct.push(0);
			incorrect.push(0);
		}

		for(let i = 0; i < this._recitationStatistics.rowData.date.length; i++)
		{
			if(moment(this._recitationStatistics.rowData.date[i]).year() == date.year())
			{
				this._recitationStatistics.chartDate = this._recitationStatistics.rowData.date[i];
				for(let j = i; j < this._recitationStatistics.rowData.date.length && moment(this._recitationStatistics.rowData.date[j]).year() == date.year(); j++)
				{
					correct[moment(this._recitationStatistics.rowData.date[j]).month()] = correct[moment(this._recitationStatistics.rowData.date[j]).month()] + this._recitationStatistics.rowData.correct[j];
					incorrect[moment(this._recitationStatistics.rowData.date[j]).month()] = incorrect[moment(this._recitationStatistics.rowData.date[j]).month()] + this._recitationStatistics.rowData.incorrect[j];
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
		            ['错误'].concat(incorrect)
				],
				type: 'line',
				group: [
					['正确','错误']
				],
				onclick: (d, e) => {
					this._recitationStatistics.chartCtrl = this._generateHistoryRecitationStatisticsChartByDay(d.x);
					this._recitationStatistics.chartCtrl.zoom([0, 10]);
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
		        	label: 'num'
		        }
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

	private _generateHistoryRecitationStatisticsChartByDay(d: string){
		let date = moment(d);
		let x = [], correct = [], incorrect = [];
		this._recitationStatistics.chartLevel = 3;
		this._recitationStatistics.chartType = 'line';

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
		            ['错误'].concat(incorrect)
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
		this._recitationStatistics.chartType = 'pie';

		return c3.generate({
			data: {
				columns: [
		            ['正确', correct],
				 	['错误', incorrect]
				],
				type: 'pie',
				onclick: (d, e) => {
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

	private _switchNCEStatisticsChart(){
			if(this._nceStatistics.chartLevel == 1)
			{
				let alert = this._toastCtrl.create({
					message: '已到最顶层',
					duration: 1500,
					position: 'bottom'
				});
				alert.present();
			}
			else if(this._nceStatistics.chartLevel == 2)
			{
				this._nceStatistics.chartCtrl = this._generateNCEStatisticsChartByBookList();
			}
			else
			{
				this._nceStatistics.chartCtrl = this._generateNCEStatisticsChartByBook(this._nceStatistics.chartIndex);
				if(this._nceStatistics.chartCtrl.data()[0].values.length > 10)
	        	{
	        		this._nceStatistics.chartCtrl.zoom([0, 10]);
	        	}
			}
	}

	private _transformNCEStatisticsChartType(){
		let actionSheet = this._actionSheetCtrl.create({
		title: '改变图表类型',
		buttons: [
				{
					text: '折线图',
					handler: () => {
						this._nceStatistics.chartType = 'line';
						this._nceStatistics.chartCtrl.transform('line');
					}
				},
				{
					text: '曲线图',
					handler: () => {

						this._nceStatistics.chartType = 'spline';
						this._nceStatistics.chartCtrl.transform('spline');
					}
				},
				{
					text: '柱状图',
					handler: () => {
						this._nceStatistics.chartType = 'bar';
						this._nceStatistics.chartCtrl.transform('bar');
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

	private _generateNCEStatisticsChart(){
		this._statisticsService.getNCEStatistics().then(
			nceStatistics => {
				if(nceStatistics.data.length > 0)
				{
					this._nceStatistics.rowData = { data: {}, title: [] };
					this._nceStatistics.rowData.data = _.groupBy(nceStatistics.data, (value) => { return value.book });
					let temp = this._nceService.getBookList();
					for(let i = 0; i < temp.length; i++)
					{
						this._nceStatistics.rowData.title.push(_.pick(temp[i], 'title').title);
					}
					this._nceStatistics.chartCtrl = this._generateNCEStatisticsChartByBookList();		
				}
				else
				{
					this._nceStatistics.chartCtrl = false;
				}
				this._resolveChartLoading();
			});
	}

	private _generateNCEStatisticsChartByBookList(){
		this._nceStatistics.chartLevel = 1;
		this._nceStatistics.chartIndex = 'book';
		this._nceStatistics.title = false;
		let correct = ['correct'];
		let incorrect = ['incorrect'];
		let title = [];
		for(let i = 0; i < this._nceStatistics.rowData.title.length; i++)
		{
			title.push(this._nceStatistics.rowData.title[i]);
		}
		let mark = 0;
		for(let k in this._nceStatistics.rowData.data)
		{
			let tempCorrect = 0, tempIncorrect = 0;
			for(let i = 0; i < this._nceStatistics.rowData.data[k].length; i++)
			{
				tempCorrect = tempCorrect + this._nceStatistics.rowData.data[k][i].correct;
				tempIncorrect = tempIncorrect + this._nceStatistics.rowData.data[k][i].incorrect;
			}
			correct.push((tempCorrect /  this._nceStatistics.rowData.data[k].length).toFixed(2));			
			incorrect.push((tempIncorrect /  this._nceStatistics.rowData.data[k].length).toFixed(2));
		}
		return c3.generate({
			data: {
		        columns: [
		        	correct,
		        	incorrect
		        ],
		        type: 'bar',
		        onclick: (d, e) => {
		        	this._nceStatistics.chartCtrl = this._generateNCEStatisticsChartByBook(d.x + 1);
		        	if(this._nceStatistics.chartCtrl.data()[0].values.length > 10)
		        	{
		        		this._nceStatistics.chartCtrl.zoom([0, 10]);
		        	}
		        }
		    },
		    axis: {
		    	x: {
		    		type: 'category',
		    		categories: title
		    	}
		    },
		    tooltip: {
		    	show: false
		    },
		    bindto: '#nceChart'
		});
	}

	private _generateNCEStatisticsChartByBook(index: number){
		this._nceStatistics.chartLevel = 2;
		this._nceStatistics.chartIndex = index;
		this._nceStatistics.title = this._nceStatistics.rowData.title[index - 1];
		let temp = _.sortBy((this._nceStatistics.rowData.data[index.toString()]), ['lession', 'date']);

		let tempCorrect = temp[0].correct, tempIncorrect = temp[0].incorrect;
		let title = [temp[0].lession];
		let correct = ['correct'], incorrect = ['incorrect'];
		let mark = 0;
		for(let i = 1; i < temp.length; i++)
		{
			if(temp[i].lession != temp[i - 1].lession)
			{
				correct.push((tempCorrect / (i - mark)).toFixed(2));
				incorrect.push((tempIncorrect / (i - mark)).toFixed(2));
				title.push(temp[i].lession);
				tempCorrect = temp[i].correct;
				tempIncorrect = temp[i].incorrect;
				mark = i;
			}
			else
			{
				tempCorrect = tempCorrect + temp[i].correct;
				tempIncorrect = tempIncorrect + temp[i].incorrect;
			}
		}

		return c3.generate({
			data: {
		        columns: [
		        	correct,
		        	incorrect
		        ],
		        type: 'bar',
		        onclick: (d, e) => {
		        	this._nceStatistics.chartCtrl = this._generateNCEStatisticsChartByLession(title[d.x]);
		        }
		    },
		    axis: {
		    	x: {
		    		type: 'category',
		    		categories: title,
		    	}
		    },
		    tooltip: {
		    	show: false
		    },
		    subchart: {
		    	show: true
		    },
		    bindto: '#nceChart'
		});
	}

	private _generateNCEStatisticsChartByLession(lession: number){
		this._nceStatistics.chartLevel = 3;
		let t = this._nceService.getBookList();
		for(let i = 0; i < t[this._nceStatistics.chartIndex - 1].lession.length; i++)
		{
			if(t[this._nceStatistics.chartIndex - 1].lession[i].id == lession)
			{
				this._nceStatistics.title = t[this._nceStatistics.chartIndex - 1].lession[i].title;
				break;
			}
		}
		let temp = _.sortBy(_.pickBy(this._nceStatistics.rowData.data[this._nceStatistics.chartIndex.toString()], (o) => { return o.lession == lession } ), ['date']);
		let correct = ['correct'], incorrect = ['incorrect'];
		let date = [];
		for(let i = 0; i < temp.length; i++)
		{
			correct.push(temp[i].correct);
			incorrect.push(temp[i].incorrect);
			date.push(temp[i].date);
		}

		return c3.generate({
			data: {
		        columns: [
		        	correct,
		        	incorrect
		        ],
		        type: 'bar',
		        onclick: (d, e) => {
		        	console.log(d);
		        }
		    },
		    axis: {
		    	x: {
		    		type: 'category',
		    		categories: date
		    	}
		    },
		    tooltip: {
		    	show: false
		    },
		    subchart: {
		    	show: true
		    },
		    bindto: '#nceChart'
		});
	}
}
