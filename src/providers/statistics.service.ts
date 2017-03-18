import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { UserService } from './user.service';

import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class StatisticsService {
	private _timeCount;
	

	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
		this._timeCount = {};
	}

	private _createTestData(){
		var temp = this._generateStatisticsStorageJSON(moment());
		temp.statistics = { NCE: [ '新概念', 0.1, 0.1, 0.3 ], recitation: [ '背诵单词', 0.1, 0.1, 0.5 ] };
		this._storageService.set('time_count', temp);
	}

	private _deleteTestData(){
		this._storageService.remove('time_count');
	}


	private _getDate(){
		return moment().format("YYYY-MM-DD");
	}

	private _compareAndUpdateRemoteStatistics(){
		let userID = this._userService.getUser().user.id;

		if(userID)
		{
			this.getTimeCount().then(
				localData => {
					if(localData && localData.date == moment().format('YYYY-MM-DD'))
					{
						this._httpService.get('/studytimestatistics', {
							user: userID,
							date: moment().format('YYYY-MM-DD')
						}).map(res => res.json())
						.subscribe(
							remoteData => {
								let updateRemote = false;
								if(remoteData[0].nceTime > localData.statistics.nceTime[3] || remoteData[0].recitationTime > localData.statistics.recitationTime[3])
								{
									localData.statistics.nceTime[3] = remoteData[0].nceTime;
									localData.statistics.recitationTime[3] = remoteData[0].recitationTime;
									this._storageService.set('time_count', localData);
								}
								else if(remoteData[0].nceTime < localData.statistics.nceTime[3] || remoteData[0].recitationTime < localData.statistics.recitationTime[3])
								{
									remoteData[0].nceTime = localData.statistics.nceTime[3];
									remoteData[0].recitationTime = localData.statistics.recitationTime[3];
									this._httpService.post('/studytimestatistics/createOrUpdate', remoteData[0])
										.map(res => res.json())
										.subscribe((complete) => console.log(complete), err => console.log(err));
								}
						});
					}
				});
		}
		
	}

	private _generateStatisticsStorageJSON(data: any = undefined){
		if(data == undefined)
		{
			data = { statistics: {}, hasCalled: false };
		}
		return data;
		
	}


	public startTimeCount(type: string){
		this._timeCount.count = moment();
		this._timeCount.type = type;
	}

	public endTimeCount(){
		let timeDuration = moment().diff(this._timeCount.count, 'seconds');

		this.getTimeCount().then(
			timeCountStatistics => {
				timeCountStatistics = this._generateStatisticsStorageJSON(timeCountStatistics);
				//first call
				if(timeCountStatistics.statistics.nceTime == undefined)
				{
					timeCountStatistics.statistics.nceTime = ['新概念', 0.1, 0.1, 0 ] ;
					timeCountStatistics.statistics.recitationTime = ['背诵单词', 0.1, 0.1, 0 ];
				}

				this._timeCount.type == 'NCE'
					? timeCountStatistics.statistics.nceTime[3] = timeCountStatistics.statistics.nceTime[3] + timeDuration
					: timeCountStatistics.statistics.recitationTime[3] = timeCountStatistics.statistics.recitationTime[3] + timeDuration;

				timeCountStatistics.date = this._timeCount.count.format('YYYY-MM-DD');
				timeCountStatistics.hasCalled = false;

				// post or put to remote server
				this._httpService.post('/studytimestatistics/createOrUpdate', {
					date: this._timeCount.count.format('YYYY-MM-DD'),
					nceTime: timeCountStatistics.statistics.nceTime[3],
					recitationTime: timeCountStatistics.statistics.recitationTime[3],
					user: this._userService.getUser().user.id
				})
				.map(res => res.json())
				.subscribe((complete) => console.log(complete), err => console.log(err));

				this._storageService.set('time_count', timeCountStatistics);
			}, err => console.log(err));
	}

	public getTimeCount(){
		return this._storageService.get('time_count');
	}

	public resetCalled(key: string, data: any){
		this._storageService.set(key, data);
	}

	public setNCEStatistics(bookID: number, lessionID: number, correct: number, incorrect: number){

	}
}
