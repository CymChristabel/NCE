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
		this._storageService.clear();
	}

	public synchronizeData(){
		let userID = this._userService.getUser().user.id;
		if(userID)
		{
			//synchronize time count statistics
			this._storageService.get('time_count').then(
				timeCount => {
					if(timeCount == undefined)
					{
						timeCount = { data: [], unSubscribe: [] };
					}
					//test data
					// timeCount.unSubscribe.push(
					// 	{ date: '2015-01-01', nceTime: 5, recitationTime: 5},
					// 	{ date: '2016-01-01', nceTime: 6, recitationTime: 6},
					// 	{ date: '2016-01-02', nceTime: 7, recitationTime: 7},
					// 	{ date: '2017-01-01', nceTime: 8, recitationTime: 8});
					if(timeCount.unSubscribe.length == 0)
					{
						this._httpService.get({
							url: '/studytimestatistics',
							data: {
								userID: userID
							}
						}).map(res => res.json())
						.subscribe(
							data => {
								timeCount.data = data;
								console.log(timeCount);
								this._storageService.set('time_count', timeCount);
							}, err => {
								console.log(err);
							});
					}
					else
					{
						this._httpService.post('/studytimestatistics/synchronize', {
							userID: userID,
							data: timeCount.unSubscribe
						}).map(res => res.json())
						  .subscribe(
						  	data => {
							  	timeCount.data = data;
							  	timeCount.unSubscribe = [];
							  	this._storageService.set('time_count', timeCount);
							  }, err => {
							  		console.log(err);
							  });
					}
			});
			//synchronize recitation statistics
			this._storageService.get('recitation_statistics').then(
				recitationStatistics => {
					if(recitationStatistics == undefined)
					{
						recitationStatistics = { data: [], unSubscribe: [] };
					}
					// test data
					// recitationStatistics.unSubscribe.push(
					// 	{ date: '2015-01-01', correct: 5, incorrect: 5, vocabularyID: 1},
					// 	{ date: '2015-01-01', correct: 6, incorrect: 5, vocabularyID: 2},
					// 	{ date: '2016-01-01', correct: 7, incorrect: 5, vocabularyID: 1},
					// 	{ date: '2016-01-02', correct: 8, incorrect: 5, vocabularyID: 1},
					// 	{ date: '2017-01-01', correct: 9, incorrect: 5, vocabularyID: 1});
					if(recitationStatistics.unSubscribe.length == 0)
					{
						this._httpService.get({
							url: '/recitationstatistics',
							data: {
								userID: userID
							}
						}).map(res => res.json())
						.subscribe(
							data => {
								recitationStatistics.data = data;
								this._storageService.set('recitation_statistics', recitationStatistics);
							}, err => console.log(err));
					}
					else
					{
						this._httpService.post('/recitationstatistics/synchronize', {
							userID: userID,
							data: recitationStatistics.unSubscribe
						}).map(res => res.json())
						.subscribe(
							data => {
								recitationStatistics.data = data;
								recitationStatistics.unSubscribe = [];
								console.log(recitationStatistics);
								this._storageService.set('recitation_statistics', recitationStatistics);
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
		let date = moment().format('YYYY-MM-DD');
		this._storageService.get('time_count').then(
			timeCount => {
				if(timeCount)
				{
					if(timeCount.data[timeCount.data.length - 1].date != date)
					{
						timeCount.push({
							date: date,
							nceTime: 0,
							recitationTime: 0
						});
					}
					this._timeCount.type == 'NCE'? timeCount.data[timeCount.data.length - 1].nceTime = timeCount.data[timeCount.data.length - 1].nceTime + timeDuration : timeCount.data[timeCount.data.length - 1].recitationTime = timeCount.data[timeCount.data.length - 1].recitationTime + timeDuration;
				}
				else
				{
					timeCount = { data: [], unSubscribe: [] };
					timeCount.push({
							date: date,
							nceTime: 0,
							recitationTime: 0
						});
					this._timeCount.type == 'NCE'? timeCount.data[timeCount.data.length - 1].nceTime = timeCount.data[timeCount.data.length - 1].nceTime + timeDuration : timeCount.data[timeCount.data.length - 1].recitationTime = timeCount.data[timeCount.data.length - 1].recitationTime + timeDuration;
				}

				let nceTime = 0;
				let recitationTime = 0;
				this._timeCount.type == 'NCE'? nceTime = nceTime + timeDuration : recitationTime = recitationTime + timeDuration;

				this._httpService.post('/studytimestatistics/createOrUpdate', {
					date: date,
					nceTime: nceTime,
					recitationTime: recitationTime,
					userID: this._userService.getUser().user.id
				}).map(res => res)
				.subscribe(
					ok => {
						this._storageService.set('time_count', timeCount);
					}, err =>{
						let flag = false;
						for(let i = timeCount.unSubscribe.length - 1; i >= 0; i--)
						{
							if(timeCount.unSubscribe[i].date == date)
							{
								timeCount.unSubscribe[i].nceTime = timeCount.unSubscribe[i].nceTime + nceTime;
								timeCount.unSubscribe[i].recitationTime = timeCount.unSubscribe[i].recitationTime + recitationTime;
								flag = true;
								break;
							}
						}
						if(!flag)
						{
							timeCount.unSubscribe.push({
								date: date,
								nceTime: nceTime,
								recitationTime: recitationTime
							});
						}
						this._storageService.set('time_count', timeCount);
					});
			});
	}

	public getTimeCount(){
		return this._storageService.get('time_count');
	}

	public setRecitationStatistics(vocabularyID: number, correct: number, incorrect: number){
		let date = moment().format('YYYY-MM-DD');
		this._storageService.get('recitation_statistics').then(
			recitationStatistics => {
				if(recitationStatistics)
				{
					let flag = false;
					for(let i = recitationStatistics.data.length - 1; i >= 0 && recitationStatistics.data[i].date == date; i--)
					{
						if(recitationStatistics.data[i].vocabularyID == vocabularyID)
						{
							recitationStatistics.data[i].correct = recitationStatistics.data[i].correct + correct;
							recitationStatistics.data[i].incorrect = recitationStatistics.data[i].incorrect + incorrect;
							flag = true;
							break;
						}
					}
					if(!flag)
					{
						recitationStatistics.data.push({
							vocabularyID: vocabularyID,
							date: date,
							correct: correct,
							incorrect: incorrect
						});
					}
				}
				else
				{
					recitationStatistics = { data: [{ date: date, vocabularyID: vocabularyID, correct: correct, incorrect: incorrect }], unSubscribe: [] };
				}
				this._httpService.post('/recitationstatistics/createOrUpdate', {
					userID: this._userService.getUser().user.id,
					vocabularyID: vocabularyID,
					correct: correct,
					incorrect: incorrect,
					date: date
				}).map(res => res)
				.subscribe(
					ok => {
						this._storageService.set('recitation_statistics', recitationStatistics);
				}, err => {
					let flag = false;
					for(let i = recitationStatistics.unSubscribe.length - 1; i >= 0 && recitationStatistics.unSubscribe[i].date == date; i--)
					{
						if(recitationStatistics.unSubscribe[i].vocabularyID == vocabularyID)
						{
							recitationStatistics.unSubscribe[i].correct = recitationStatistics.unSubscribe[i].correct + correct;
							recitationStatistics.unSubscribe[i].incorrect = recitationStatistics.unSubscribe[i].incorrect + incorrect;
							flag = true;
							break;
						}
					}
					if(!flag)
					{
						recitationStatistics.unSubscribe.push({
							date: date,
							correct: correct,
							incorrect: incorrect,
							vocabularyID: vocabularyID
						});
					}
					console.log(recitationStatistics);
					this._storageService.set('recitation_statistics', recitationStatistics);
				});
			});
	}

	public getRecitationStatistics(){
		return this._storageService.get('recitation_statistics');
	}
}
