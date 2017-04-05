import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

import { UserService } from './user.service';

import * as _ from 'lodash';

@Injectable()
export class TaskService {
	private _taskList;
	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService : UserService) {
		// console.log('init task service...');
		// this._storageService.get('taskList').then(
		// 	task => {
		// 		if(task == undefined)
		// 		{
		// 			this._taskList = [];
		// 		}
		// 		else
		// 		{
		// 			this._taskList = task;
		// 		}
		// 	}, err => console.log(err));
	}

	public synchronizeData(){
		let userID = this._userService.getUser().user.id;
		if(userID)
		{
			this._storageService.get('taskList').then(
				taskList => {
					if(taskList == undefined)
					{
						taskList = { data: { nceTask: {}, recitationTask: {} }, unSubscribe: { nceTask: {}, recitationTask: {} } };
					}
					if(taskList.unSubscribe.nceTask.length > 0 || taskList.unSubscribe.recitationTask.length > 0)
					{
						this._httpService.post('/task/synchronize', {
							userID: userID,

						}).map(res => res.json())
						.subscribe(
							data => {

							}, err => console.log(err));
					}
					else
					{
						this._httpService.get({
							url: '/task/getTask',
							data: {
								userID: userID
							}
						}).map(res => res.json())
						.subscribe(
							data => {

							}, err => console.log(err));
					}
			});
		}
	}

	public addTask(task: any){
		this._taskList.push(task);	
		console.log(this._taskList);
		this._storageService.set('taskList', this._taskList);
	}

	public deleteTask(task: any){
		_.remove(this._taskList, task);
		this._storageService.set('taskList', this._taskList);
	}

	public get(){
		return this._taskList;
	}

}
