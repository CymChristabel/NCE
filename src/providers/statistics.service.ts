import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class StatisticsService {
	private _timeCount;
	private _today;
	private _hasKey;

	constructor(private _httpService: HttpService, private _storageService: StorageService) {
		this._today = moment();
		this._hasKey = false;
		this._createTestData();
	}

	private _createTestData(){
		let timecount = { NCE: [ '新概念', 0.1, 0.1, 0.3 ], recitation: [ '背诵单词', 0.1, 0.1, 0.5 ], hasCalled: false};
		this._storageService.set('time_count:' + moment().format("YYYY-MM-DD"), timecount);
	}

	private _deleteTestData(){
		this._storageService.remove('time_count:' + moment().format("YYYY-MM-DD"));
	}

	private _getDate(){
		return moment().format("YYYY-MM-DD");
	}

	private _setStorageKey(category: string, date: string){
		this._storageService.get(category).then(key => {
			if(key == undefined)
			{
				key = [];
			}
			key.push(date);
			this._storageService.set(category, key);
		});
	}

	private _getStorageKey(category: string){
		return this._storageService.get(category);
	}

	public startTimeCount(){
		this._timeCount = moment();
	}

	public endTimeCount(type: string){
		let tempTimeCount = moment().second() - this._timeCount.second();

		this._storageService.get('time_count:' + this._timeCount.format("YYYY-MM-DD")).then(
			timeCount => {
				if(timeCount == undefined)
				{
					timeCount = { NCE: [ '新概念', 0.1, 0.1 ], recitation: [ '背诵单词', 0.1, 0.1 ] };
					this._setStorageKey('time_count', this._timeCount.format("YYYY-MM-DD"));
				}
				if(type == 'NCE')
				{
					timeCount.NCE.push(tempTimeCount);
				}
				else
				{
					timeCount.recitation.push(tempTimeCount);
				}
				timeCount.hasCalled = false;
				this._storageService.set('time_count:' + this._timeCount.format("YYYY-MM-DD"), timeCount);
			}, err => console.log(err));
	}

	public getTimeCount(date: string){
		return this._storageService.get('time_count:' + date);
	}

	public getTimeCountKey(){
		return this._getStorageKey('time_count');
	}

	public resetCalled(key: string, data: any){
		this._storageService.set(key, data);
	}

}
