import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';

/*
  Generated class for the TaskService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TaskService {
	private _taskList;
	constructor(private _httpService: HttpService, private _storageService: StorageService) {
		console.log('init task service...');
		this._storageService.get('taskList').then(
			task => {
				if(task == undefined)
				{
					this._taskList = [];
				}
				else
				{
					this._taskList = task;
				}
				console.log(this._taskList);
			}, err => console.log(err));
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
