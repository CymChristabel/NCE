import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { UserService } from './user.service';

import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class StatisticsService {
	private _timeCount;
	private _hasStudyTimeSynchronized;

	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
		this._timeCount = {};
		this._hasStudyTimeSynchronized = true;
	}

	private _createTestData(){
		var temp = {};
		temp['2016-01-01'] = { nceTime: 11, recitationTime: 12 };
		temp['2016-01-02'] = { nceTime: 11, recitationTime: 12};
		temp[moment().format('YYYY-MM-DD')] = { nceTime: 15, recitationTime: 15};
		this._storageService.set('time_count', temp).then(() => this.syncStatistics());
	}

	private _deleteTestData(){
		this._storageService.remove('time_count');
	}

	//get date in YYYY-MM-DD format, no parameter will return current date
	private _getDate(date: any = undefined){
		return moment(date).format("YYYY-MM-DD");
	}

	public syncStatistics(){
		let userID = this._userService.getUser().user.id;

		if(userID)
		{
			let tempDate = moment().format('YYYY-MM-DD');
			//sync time count statistics

			this.getTimeCount().then(
				localData => {
					if(localData && _.keys(_.omit(localData, tempDate)).length > 0)
					{
						this._httpService.post('/studytimestatistics/synchronize', {
								user: userID,
								data: _.omit(localData, tempDate)
							}).map(res => res.json())
							.subscribe(
								complete => {
										this._storageService.set('time_count', _.pick(localData, tempDate));
								}, err => console.log(err));
					}
					
				});
		}
		
	}

	public startTimeCount(type: string){
		this._timeCount.count = moment();
		this._timeCount.type = type;
	}

	public endTimeCount(){
		let timeDuration = moment().diff(this._timeCount.count, 'seconds');

		this.getTimeCount().then(
			timeCountStatistics => {
				if(timeCountStatistics == undefined)
				{
					timeCountStatistics = {}
				}
				let tempTime = this._timeCount.count.format('YYYY-MM-DD');
				if(timeCountStatistics[tempTime] == undefined)
				{
					timeCountStatistics[tempTime] = {};
					timeCountStatistics[tempTime].nceTime = ['新概念', 0.1, 0, 0 ] ;  //third value stands for old data, forth for new data
					timeCountStatistics[tempTime].recitationTime = ['背诵单词', 0.1, 0, 0 ];
				}

				this._timeCount.type == 'NCE'
					? timeCountStatistics[tempTime].nceTime[3] = timeCountStatistics[tempTime].nceTime[3] + timeDuration
					: timeCountStatistics[tempTime].recitationTime[3] = timeCountStatistics[tempTime].recitationTime[3] + timeDuration;

				// post or put to remote server
				let userID = this._userService.getUser().user.id;

				this._httpService.post('/studytimestatistics/createOrUpdate', {
					hasSynchronized: this._hasStudyTimeSynchronized, 
					data: 
					{
						date: tempTime,
						nceTime: timeCountStatistics[tempTime].nceTime[2] + timeCountStatistics[tempTime].nceTime[3],
						recitationTime: timeCountStatistics[tempTime].recitationTime[2] + timeCountStatistics[tempTime].recitationTime[3],
						user: userID
					}
				}).map(res => res.json())
				.subscribe(
					result => {
						if(this._hasStudyTimeSynchronized == false)
						{
							timeCountStatistics[tempTime].nceTime[2] = result[0].nceTime;
							timeCountStatistics[tempTime].recitationTime[2] = result[0].recitationTime;
							timeCountStatistics[tempTime].nceTime[3] = 0;
							timeCountStatistics[tempTime].recitationTime[3] = 0;
							this._hasStudyTimeSynchronized = true;
						}
						this._storageService.set('time_count', timeCountStatistics);
					}, err =>{
						console.log(err);
						this._storageService.set('time_count', timeCountStatistics);
					});
			}, err => console.log(err));
	}

	public getTimeCount(){
		return this._storageService.get('time_count');
	}

	public getHistoryTimeCount(){
		return this._httpService.get({
			url: '/studytimestatistics',
			data: {
				user: this._userService.getUser().user.id
			}
		}).map(res => res.json());
	}

	public resetCalled(key: string, data: any){
		this._storageService.set(key, data);
	}

	public setNCEStatistics(bookID: number, lessionID: number, correct: number, incorrect: number){

	}
}
