import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { UserService } from './user.service';

import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as async from 'async';

@Injectable()
export class StatisticsService {
	private _timeCount;

	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
		this._timeCount = {};
	}

	public synchronizeData(callback){
		let userID = this._userService.getUserID();
		if(userID)
		{
			async.series([
				(cb) => {
					//synchronize time count statistics
					this._storageService.get('time_count').then(
						timeCount => {
							if(timeCount == undefined)
							{
								timeCount = { data: [], unSubscribe: [] };
							}
							//test async data
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
										cb(null, true);
									}, err => {
										console.log(err);
										cb(err, null);
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
									  	cb(null, true);
									  }, err => {
								  		console.log(err);
								  		cb(err, null);
									  });
							}
					});
				},
				(cb) => {
					//synchronize recitation statistics
					this._storageService.get('recitation_statistics').then(
						recitationStatistics => {
							if(recitationStatistics == undefined)
							{
								recitationStatistics = { data: [], unSubscribe: [] };
							}
							// test async data
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
										recitationStatistics.data = _.sortBy(data, ['date'])
										this._storageService.set('recitation_statistics', recitationStatistics);
										cb(null, true);
									}, err => {
										console.log(err)
										cb(err, null);
									});
							}
							else
							{
								this._httpService.post('/recitationstatistics/synchronize', {
									userID: userID,
									data: recitationStatistics.unSubscribe
								}).map(res => res.json())
								.subscribe(
									data => {
										recitationStatistics.data = _.sortBy(data, ['date'])
										recitationStatistics.unSubscribe = [];
										this._storageService.set('recitation_statistics', recitationStatistics);
										cb(null, true);
									}, err => {
										console.log(err)
										cb(err, null);
									});
							}
					});
				},
				(cb) => {
					//synchronize nce_statistics
					this._storageService.get('NCE_statistics').then(
						nceStatistics => {
							if(nceStatistics == undefined)
							{
								nceStatistics = { data: [], unSubscribe: [] };
							}
							// test async data
							// nceStatistics.unSubscribe = [
							// 	{ lession: 1, date: '2016-03-03 19:32:02'}, 
							// 	{ lession: 1, date: '2015-03-03 19:32:02'}, 
							// 	{ lession: 2, date: '2017-03-03 19:32:02'}, 
							// 	{ lession: 3, date: '2015-03-03 19:32:02'}, 
							// 	{ lession: 2, date: '2016-03-03 19:32:02'}
							// ];
							if(nceStatistics.unSubscribe.length == 0)
							{
								this._httpService.get({
									url: '/nce_statistics',
									data: {
										userID: userID
									}
								}).map(res => res.json())
								.subscribe(
									data => {
										nceStatistics.data = _.sortBy(data, ['book', 'lession', 'date']);
										this._storageService.set('NCE_statistics', nceStatistics);
										cb(null, true);
									}, err => {
										console.log(err);
										cb(err, null);
									});
							}
							else
							{
								this._httpService.post('/nce_statistics/synchronize', {
									userID: userID,
									data: nceStatistics.unSubscribe
								}).map(res => res.json())
								.subscribe(
									data => {
										nceStatistics.data = _.sortBy(data, ['book', 'lession', 'date']);
										nceStatistics.unSubscribe = [];
										this._storageService.set('NCE_statistics', nceStatistics);
										cb(null, true);
									}, err => {
										console.log(err);
										cb(err, null);
									});
							}
						});
				}], (err, result) => {
					callback(null, true);
				});
		}
		else
		{
			callback(null, true);
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
				if(timeCount == undefined)
				{
					timeCount = { data: [], unSubscribe: [] };
				}
				if(timeCount.data.length == 0 || timeCount.data[timeCount.data.length - 1].date != date)
				{
					timeCount.data.push({
						date: date,
						nceTime: 0,
						recitationTime: 0
					});
				}
				this._timeCount.type == 'NCE'? timeCount.data[timeCount.data.length - 1].nceTime = timeCount.data[timeCount.data.length - 1].nceTime + timeDuration : timeCount.data[timeCount.data.length - 1].recitationTime = timeCount.data[timeCount.data.length - 1].recitationTime + timeDuration;

				let nceTime = 0;
				let recitationTime = 0;
				this._timeCount.type == 'NCE'? nceTime = nceTime + timeDuration : recitationTime = recitationTime + timeDuration;
				this._httpService.post('/studytimestatistics/createOrUpdate', {
					date: date,
					nceTime: nceTime,
					recitationTime: recitationTime,
					userID: this._userService.getUserID()
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
					userID: this._userService.getUserID(),
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

	public setNCEStatistics(lessionID: number, bookID: number, correct: number, incorrect: number){
		let date = moment();
		this._storageService.get('NCE_statistics').then(
			nceStatistics => {
				if(nceStatistics == undefined)
				{
					nceStatistics = { data: [], unSubscribe: [] };
				}
				nceStatistics.data.push({
					lession: lessionID,
					book: bookID,
					correct: correct,
					incorrect: incorrect,
					date: date.format('YYYY-MM-DD HH:mm:ss')
				});
				console.log(nceStatistics.data);
				nceStatistics.data = _.sortBy(nceStatistics.data, ['lession', 'date']);
				this._httpService.post('/nce_statistics', {
					lessionID: lessionID,
					bookID: bookID,
					userID: this._userService.getUserID(),
					correct: correct,
					incorrect: incorrect,
					date: date.format('YYYY-MM-DD HH:mm:ss')
				}).map(res => res)
				.subscribe(
					ok => {
						this._storageService.set('NCE_statistics', nceStatistics);
					}, err => {
						console.log(err);
						nceStatistics.unSubscribe.push(nceStatistics.data[nceStatistics.data.length - 1]);
						nceStatistics.unSubscribe[nceStatistics.unSubscribe.length - 1].bookID = nceStatistics.unSubscribe[nceStatistics.unSubscribe.length - 1].book;
						delete nceStatistics.unSubscribe[nceStatistics.unSubscribe.length - 1].book;
						this._storageService.set('NCE_statistics', nceStatistics);
					});
			});
	}

	public getNCEStatistics(){
		return this._storageService.get('NCE_statistics');
	}

	public deleteLocalData(callback){
		async.series([
			(cb) => {
				this._storageService.remove('NCE_statistics').then(cb(null, true));
			},
			(cb) => {
				this._storageService.remove('recitation_statistics').then(cb(null, true));
			},
			(cb) => {
				this._storageService.remove('time_count').then(cb(null, true));
			}], (err, ok) => {
				callback(null, true);
			});
	}
}
