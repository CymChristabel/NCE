import { Component, AfterViewInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { StatisticsService } from '../../providers/statistics.service';
import { UserService } from '../../providers/user.service';

import * as c3 from 'c3';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-friend-compare',
  templateUrl: 'friend-compare.html'
})
export class FriendComparePage implements AfterViewInit {
	private _chartCtrl;
	private _user;
	private _friend;
	private _topLevel;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _toastCtrl: ToastController, private _loadingCtrl: LoadingController, private _userService: UserService, private _statisticsService: StatisticsService) {
		this._user = this._userService.getUser().user;
		this._friend = this._navParams.get('friend');
		console.log(this._user);
	}

	ngAfterViewInit() {
		let loading = this._loadingCtrl.create({
			content: 'init chart...'
		});
		loading.present();
		this._statisticsService.compareStatistics(this._friend.id).subscribe(
			data => {
				this._user.rowData = data.user;
				this._friend.rowData = data.friend;
				let userStudyTimeStatistics = ['your'];
				let friendStudyTimeStatistics = ['friends'];
				let userCorrectRateStatistics = ['you', 0];
				let friendCorrectRateStatistics = ['friend', 0]
				//1. total study time
				userStudyTimeStatistics.push(((data.user.studyTime.nceTime + data.user.studyTime.recitationTime) / 3600).toFixed(2));
				friendStudyTimeStatistics.push(((data.friend.studyTime.nceTime + data.friend.studyTime.recitationTime) / 3600).toFixed(2));
				//2. nce correct rate
				userCorrectRateStatistics.push((data.user.nce.correct / (data.user.nce.correct + data.user.nce.incorrect)).toFixed(2));
				friendCorrectRateStatistics.push((data.friend.nce.correct / (data.friend.nce.correct + data.friend.nce.incorrect)).toFixed(2));
				//3. recitation correct rate
				userCorrectRateStatistics.push((data.user.recitation.correct / (data.user.recitation.correct + data.user.recitation.incorrect)).toFixed(2));
				friendCorrectRateStatistics.push((data.friend.recitation.correct / (data.friend.recitation.correct + data.friend.recitation.incorrect)).toFixed(2));
				this._user.statistics = { userStudyTimeStatistics: userStudyTimeStatistics, userCorrectRateStatistics: userCorrectRateStatistics };
				this._friend.statistics = { friendStudyTimeStatistics: friendStudyTimeStatistics, friendCorrectRateStatistics: friendCorrectRateStatistics };

				this._chartCtrl = this._generateGeneralChart();
				loading.dismiss();
			}, err => {
				console.log(err);
				loading.dismiss();
				let toast = this._toastCtrl.create({
					message: 'network err',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
			});
	}

	private _generateGeneralChart(){
		this._topLevel = true;
		return c3.generate({
				    data: {
				        columns: [
				            this._user.statistics.userStudyTimeStatistics,
				            this._friend.statistics.friendStudyTimeStatistics,
				            this._user.statistics.userCorrectRateStatistics,
				            this._friend.statistics.friendCorrectRateStatistics
				        ],
				        type: 'bar',
				        axes: {
				        	your: 'y',
				        	friends: 'y',
				        	you: 'y2',
				        	friend: 'y2'
				        },
				        onclick: (d) => {
				        	if(d.x == 0)				//study time
				        	{
				        		this._chartCtrl = this._generateStudyTimePieChart();
				        	}
				        	else if(d.x == 1) 			//nce correct rate
				        	{
				        		this._chartCtrl = this._generateCorrectRatePieChart(this._chartCtrl.data(['you'])[0].values[1].value, this._chartCtrl.data(['friend'])[0].values[1].value);
				        	}
				        	else						//recitation correct rate
				        	{
				        		this._chartCtrl = this._generateCorrectRatePieChart(this._chartCtrl.data(['you'])[0].values[2].value, this._chartCtrl.data(['friend'])[0].values[2].value);
				        	}
				        }
				    },
				    axis: {
				    	x: {
				    		type: 'category',
				    		categories: ['study time', 'nce', 'recitation']
				    	},
				    	y: {
				    		label: 'hour'
				    	},
				    	y2: {
				    		label: 'rate',
				    		show: true
				    	}
				    },
				    tooltip: {
				    	show: false
				    },
				    bindto: '#compareChart'
				});
	}

	private _generateStudyTimePieChart(){
		let c1 = ['you', (this._user.rowData.studyTime.nceTime / 3600).toFixed(2), (this._user.rowData.studyTime.recitationTime / 3600).toFixed(2)];
		let c2 = ['friend', (this._friend.rowData.studyTime.nceTime / 3600).toFixed(2), (this._friend.rowData.studyTime.recitationTime / 3600).toFixed(2)];
		this._topLevel = false;

		return c3.generate({
			data: {
				columns: [
					c1,
					c2
				],
				type: 'bar'
			},
			axis: {
				x: {
					type: 'category',
					categories: ['nce time', 'recitation time']
				},
				y: {
					label: 'hour'
				}
			},
			tooltip: {
				show: false
			},
			bindto: '#compareChart'
		});
	}

	private _generateCorrectRatePieChart(user: number, friend: number){
		let c1 = ['you', user];
		let c2 = ['friend', friend];
		this._topLevel = false;
		return c3.generate({
			data: {
		        columns: [
		        	c1,
		        	c2
		        ],
		        type: 'pie'
		    },
		    tooltip: {
		    	show: false
		    },
		    bindto: '#compareChart'
		});
	}

	private _goUpper(){
		if(this._topLevel == false)
		{
			this._chartCtrl = this._generateGeneralChart();
		}
		else
		{
			let toast = this._toastCtrl.create({
				message: 'already top',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
		}
	}
}
