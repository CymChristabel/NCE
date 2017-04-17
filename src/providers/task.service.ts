import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { NCEService } from './nce.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class TaskService {
	private _taskList;

	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService : UserService, private _nceService: NCEService) {
		this._storageService.get('task_list').then(
			taskList => {
				if(taskList == undefined)
				{
					taskList = { data: { nceTask: [], recitationTask: [] }, unSubscribe: { nceTask: [], recitationTask: [] } };
				}
				this._taskList = taskList;
			});
	}

	public synchronizeData(callback){
		let userID = this._userService.getUser().user.id;
		if(userID)
		{
			this._storageService.get('task_list').then(
				taskList => {
					if(taskList == undefined)
					{
						taskList = { data: { nceTask: [], recitationTask: [] }, unSubscribe: { nceTask: [], recitationTask: [] } };
					}
					if(taskList.unSubscribe.nceTask.length > 0 || taskList.unSubscribe.recitationTask.length > 0)
					{
						this._httpService.post('/task/synchronize', {
							userID: userID,
							nceTask: taskList.unSubscribe.nceTask,
							recitationTask: taskList.unSubscribe.recitationTask
						}).map(res => res.json())
						.subscribe(
							data => {
								for(let i = 0; i < data.nceTask.length; i++)
								{
									let flag = false;
									for(let j = 0; j < taskList.data.nceTask.length; j++)
									{
										let temp = false;
										if(moment(data.nceTask[i].updatedAt).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD'))
										{
											temp = true;
										}
										if(taskList.data.nceTask[j].bookID == data.nceTask[i].book.id)
										{
											taskList.data.nceTask[j].lessionID = data.nceTask[i].nextLession.id;
											taskList.data.nceTask[j].lessionTitle = data.nceTask[i].nextLession.title;
											taskList.data.nceTask[j].lastUpdateDate = data.nceTask[i].updatedAt;
											taskList.data.nceTask[j].dailyFinished = temp;
											flag = true;
											break;
										}
									}
									if(!flag)
									{
										let temp = false;
										if(moment(data.nceTask[i].updatedAt).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD'))
										{
											temp = true;
										}
										taskList.data.nceTask.push({
											bookID: data.nceTask[i].book.id,
											lessionID: data.nceTask[i].nextLession.id,
											bookTitle: data.nceTask[i].book.title,
											lessionTitle: data.nceTask[i].nextLession.title,
											startDate: data.nceTask[i].startDate,
											lastUpdateDate: data.nceTask[i].updatedAt,
											dailyFinished: temp
										});
									}
								}
								taskList.unSubscribe.nceTask = [];

								taskList.data.recitationTask = [];
								for(let i = 0; i < data.recitationTask.length; i++)
								{
									taskList.data.recitationTask.push({
										vocabularyID: data.recitationTask[i].vocabulary.id,
										vocabularyTitle: data.recitationTask[i].vocabulary.title,
										current: data.recitationTask[i].current,
										goal: data.recitationTask[i].goal,
										startDate: data.recitationTask[i].startDate,
										lastUpdateDate: data.recitationTask[i].updatedAt
									});
									if(taskList.data.recitationTask[i].current >= taskList.data.recitationTask[i].goal)
									{
										taskList.data.recitationTask[i].dailyFinished = true;
									}
									else
									{
										taskList.data.recitationTask[i].dailyFinished = false;	
									}
								}
								taskList.unSubscribe.recitationTask = [];
								this._taskList = taskList;
								this._storageService.set('task_list', taskList);
								callback(null, true);
							}, err => {
								console.log(err)
								callback(err, null);
							});
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
								console.log(data);
								for(let i = 0; i < data.nceTask.length; i++)
								{
									let flag = false;
									for(let j = 0; j < taskList.data.nceTask.length; j++)
									{
										if(taskList.data.nceTask[j].bookID == data.nceTask[i].book.id)
										{
											let temp = false;
											if(moment(data.nceTask[i].updatedAt).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD'))
											{
												temp = true;
											}
											taskList.data.nceTask[j].lessionID = data.nceTask[i].nextLession.id;
											taskList.data.nceTask[j].lessionTitle = data.nceTask[i].nextLession.title;
											taskList.data.nceTask[j].lastUpdateDate = data.nceTask[i].updatedAt;
											taskList.data.nceTask[j].dailyFinished = temp;
											flag = true;
											break;
										}
									}
									if(!flag)
									{
										let temp = false;
										if(moment(data.nceTask[i].updatedAt).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD'))
										{
											temp = true;
										}
										taskList.data.nceTask.push({
											bookID: data.nceTask[i].book.id,
											lessionID: data.nceTask[i].nextLession.id,
											bookTitle: data.nceTask[i].book.title,
											lessionTitle: data.nceTask[i].nextLession.title,
											startDate: data.nceTask[i].startDate,
											lastUpdateDate: data.nceTask[i].updatedAt,
											dailyFinished: temp
										});
									}
								}

								taskList.data.recitationTask = [];
								console.log(data);
								for(let i = 0; i < data.recitationTask.length; i++)
								{
									taskList.data.recitationTask.push({
										vocabularyID: data.recitationTask[i].vocabulary.id,
										vocabularyTitle: data.recitationTask[i].vocabulary.title,
										current: data.recitationTask[i].current,
										goal: data.recitationTask[i].goal,
										startDate: data.recitationTask[i].startDate,
										lastUpdateDate: data.recitationTask[i].updatedAt
									});
									if(taskList.data.recitationTask[i].current >= taskList.data.recitationTask[i].goal)
									{
										taskList.data.recitationTask[i].dailyFinished = true;
									}
									else
									{
										taskList.data.recitationTask[i].dailyFinished = false;	
									}
								}
								this._taskList = taskList;
								this._storageService.set('task_list', taskList);
								callback(null, true);
							}, err => {
								console.log(err)
								callback(err, null);
							});
					}
			});
		}
		else
		{
			callback(null, true);
		}
	}

	public createNCETask(bookID: number, lessionID: number, bookTitle: string, lessionTitle: string){
		let date = moment().format('YYYY-MM-DD');
		let flag = false;
		for(let i = 0; i < this._taskList.data.nceTask.length; i++)
		{
			if(this._taskList.data.nceTask[i].bookID == bookID)
			{
				this._taskList.data.nceTask[i].lessionID = lessionID;
				this._taskList.data.nceTask[i].lessionTitle = lessionTitle;
				this._taskList.data.nceTask[i].dailyFinished = false;
				this._taskList.data.nceTask[i].lastUpdatedDate = date;
				flag = true;	
			}
		}
		if(!flag)
		{
			this._taskList.data.nceTask.push({
				bookID: bookID,
				lessionID: lessionID,
				bookTitle: bookTitle,
				lessionTitle: lessionTitle,
				startDate: date,
				lastUpdateDate: date,
				dailyFinished: false
			});
		}
		this._httpService.post('/task/createNCETask', {
			userID: this._userService.getUser().user.id,
			bookID: bookID,
			lessionID: lessionID,
			startDate: date
		}).map(res => res.json())
		.subscribe(
			ok => {
				this._storageService.set('task_list', this._taskList);
			}, err => {
				for(let i = 0; i < this._taskList.unSubscribe.nceTask.length;i++)
				{
					if(this._taskList.unSubscribe.nceTask[i].bookID == bookID)
					{
						this._taskList.unSubscribe.nceTask.splice(i, 1);
					}
				}
				this._taskList.unSubscribe.nceTask.push({
					bookID: bookID,
					lessionID: lessionID,
					startDate: date,
					createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
					deleted: false
				});
				this._storageService.set('task_list', this._taskList);
			});
	}

	public deleteNCETask(index: number){
		let temp = this._taskList.data.nceTask[index];
		this._taskList.data.nceTask.splice(index, 1);
		this._httpService.post('/task/deleteNCETask', {
			userID: this._userService.getUser().user.id,
			bookID: temp.bookID
		}).map(res => res.json())
		.subscribe(ok => {
			this._storageService.set('task_list', this._taskList);
		}, err => {
			for(let i = 0; i < this._taskList.unSubscribe.nceTask.length;i++)
			{
				if(this._taskList.unSubscribe.nceTask[i].bookID == temp.bookID)
				{
					this._taskList.unSubscribe.nceTask.splice(i, 1);
				}
			}
			this._taskList.unSubscribe.nceTask.push({
				bookID: temp.bookID,
				lessionID:  temp.lessionID,
				startDate:  temp.startDate,
				createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted: true
			});
			this._storageService.set('task_list', this._taskList);
		});
		return this._taskList.data;
	}

	public updateNCETask(bookID: number, lessionID: number){
		for(let i = 0; i < this._taskList.data.nceTask.length; i++)
		{
			if(this._taskList.data.nceTask[i].bookID == bookID && this._taskList.data.nceTask[i].lessionID == lessionID)
			{
				let temp = this._nceService.getBook(bookID).lession;
				for(let j = 0; j < temp.length; j++)
				{
					if(temp[j].id == lessionID)
					{
						if(j != temp.length - 1)
						{
							this._taskList.data.nceTask[i].lessionID = temp[j + 1].id;
							this._taskList.data.nceTask[i].lessionTitle = temp[j + 1].title;
							this._taskList.data.nceTask[i].lastUpdateDate = moment().format('YYYY-MM-DD HH:mm:ss');
							this._taskList.data.nceTask[i].dailyFinished = true;

							this._httpService.post('/task/updateNCETask', {
								userID: this._userService.getUser().user.id,
								bookID: bookID,
								lessionID: temp[j + 1].id
							}).map(res => res)
							.subscribe(ok => this._storageService.set('task_list', this._taskList), 
								err => {
									for(let i = 0; i < this._taskList.unSubscribe.nceTask.length;i++)
									{
										if(this._taskList.unSubscribe.nceTask[i].bookID == bookID)
										{
											this._taskList.unSubscribe.nceTask.splice(i, 1);
											break;
										}
									}
									this._taskList.unSubscribe.nceTask.push({
										bookID: bookID,
										lessionID: temp[j + 1].id,
										startDate:  this._taskList.data.nceTask[i].startDate,
										createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
										deleted: false
									});
									this._storageService.set('task_list', this._taskList);
							});
						}
						else
						{
							this._taskList.data.nceTask[i].lastUpdateDate = moment().format('YYYY-MM-DD HH:mm:ss');
							this._taskList.data.nceTask[i].dailyFinished = true;
							this._httpService.post('/task/updateNCETask', {
								userID: this._userService.getUser().user.id,
								bookID: bookID,
								finished: true
							}).map(res => res)
							.subscribe(ok => this._storageService.set('task_list', this._taskList), 
								err => {
									for(let i = 0; i < this._taskList.unSubscribe.nceTask.length;i++)
									{
										if(this._taskList.unSubscribe.nceTask[i].bookID == bookID)
										{
											this._taskList.unSubscribe.nceTask.splice(i, 1);
											break;
										}
									}
									this._taskList.unSubscribe.nceTask.push({
										bookID: bookID,
										lessionID: temp[j + 1].id,
										startDate: this._taskList.data.nceTask[i].startDate,
										createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
										deleted: false
									});
									this._storageService.set('task_list', this._taskList);
								});
						}
						break;
					}
				}
			}
		}
	}

	public createRecitationTask(vocabularyID: number, vocabularyTitle: string, goal: number){
		let date = moment().format('YYYY-MM-DD');
		let flag = false;
		for(let i = 0; i < this._taskList.data.recitationTask.length; i++)
		{
			if(this._taskList.data.recitationTask[i].vocabularyID == vocabularyID)
			{
				this._taskList.data.recitationTask[i].goal = goal;
				flag = true;
				break;
			}
		}
		if(!flag)
		{
			this._taskList.data.recitationTask.push({
				vocabularyID: vocabularyID,
				vocabularyTitle: vocabularyTitle,
				current: 0,
				goal: goal,
				startDate: date,
				lastUpdateDate: date,
				dailyFinished: false
			});
		}
		this._storageService.set('task_list', this._taskList);
		this._httpService.post('/task/createRecitationTask', {
			userID: this._userService.getUser().user.id,
			vocabularyID: vocabularyID,
			goal: goal,
			startDate: date
		}).map(res => res)
		.subscribe(ok => this._storageService.set('task_list', this._taskList), 
			err => {
				for(let i = 0; i < this._taskList.unSubscribe.recitationTask.length;i++)
				{
					if(this._taskList.unSubscribe.recitationTask[i].vocabularyID == vocabularyID)
					{
						this._taskList.unSubscribe.recitationTask.splice(i, 1);
					}
				}
				this._taskList.unSubscribe.recitationTask.push({
					vocabularyID: vocabularyID,
					goal: goal,
					startDate: date,
					createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
					deleted: false,
					current: 0
				});
				this._storageService.set('task_list', this._taskList);
			});
	}

	public updateRecitationTask(vocabularyID: number, num: number){
		let flag = false;
		let temp;
		for(let i = 0; i < this._taskList.data.recitationTask.length; i++)
		{
			if(this._taskList.data.recitationTask[i].vocabularyID == vocabularyID)
			{
				this._taskList.data.recitationTask[i].current = this._taskList.data.recitationTask[i].current + num;
				flag = true;
				temp = this._taskList.data.recitationTask[i];
				break;
			}
		}
		if(flag)
		{
			this._httpService.post('/task/updateRecitationTask', {
				userID: this._userService.getUser().user.id,
				vocabularyID: vocabularyID,
				current: temp.current
			}).map(res => res)
			.subscribe(ok => this._storageService.set('task_list', this._taskList), 
				err => {
					for(let i = 0; i < this._taskList.unSubscribe.recitationTask.length;i++)
					{
						if(this._taskList.unSubscribe.recitationTask[i].vocabularyID == vocabularyID)
						{
							this._taskList.unSubscribe.recitationTask.splice(i, 1);
						}
					}
					this._taskList.unSubscribe.recitationTask.push({
						vocabularyID: vocabularyID,
						goal: temp.goal,
						startDate: temp.startDate,
						createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
						deleted: false,
						current: temp.current
					});
					this._storageService.set('task_list', this._taskList);
				});
		}
	}

	public deleteRecitationTask(index: number){
		let temp = this._taskList.data.recitationTask[index];
		this._taskList.data.recitationTask.splice(index, 1);
		this._httpService.post('/task/deleteRecitationTask', {
			userID: this._userService.getUser().user.id,
			bookID: temp.vocabularyID
		}).map(res => res.json())
		.subscribe(ok => {
			this._storageService.set('task_list', this._taskList);
		}, err => {
			for(let i = 0; i < this._taskList.unSubscribe.recitationTask.length;i++)
			{
				if(this._taskList.unSubscribe.recitationTask[i].vocabularyID == temp.vocabularyID)
				{
					this._taskList.unSubscribe.recitationTask.splice(i, 1);
				}
			}
			this._taskList.unSubscribe.recitationTask.push({
				vocabularyID: temp.vocabularyID,
				createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted: true
			});
			this._storageService.set('task_list', this._taskList);
		});
		return this._taskList.data;
	}

	public get(){
		if(this._taskList == undefined)
		{

		}
		return this._taskList.data;
	}

	public deleteLocalData(callback){
		this._storageService.remove('task_list').then(callback(null, true));
	}
}
