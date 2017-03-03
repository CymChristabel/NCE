import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()

export class RecitationService{
	private _vocabularyList;

	constructor(private _httpService: HttpService, private _storageService: StorageService) {
		console.log('init vocabulary service....');
		this._vocabularyList = [];
		this.getVocabularyList().subscribe(
			vocabularyList => {
				this._vocabularyList = vocabularyList;
				this._storageService.set('vocabularyList', vocabularyList);
				this._checkDownload();
			}, err => {
				console.log('vocabulary remote:' + err);
				this._storageService.get('vocabularyList').then(
					localVocabularyList => {
						if(localVocabularyList != undefined)
						{
							this._vocabularyList = localVocabularyList;
							this._checkDownload();
						}
					}, err => console.log('vocabulary local:' + err))
			});
	}

	private _checkDownload(){
		for(let i = 0; i < this._vocabularyList.length; i++)
		{
			this._storageService.get('vocabulary:' + this._vocabularyList[i].id).then(
				vocabulary => {
					if(vocabulary == undefined)
					{
						this._vocabularyList[i].isDownloaded = false;
					}
					else
					{
						this._vocabularyList[i].isDownloaded = true;
						this._storageService.get('vocabularyProgress:' + this._vocabularyList[i].id).then(
							progress => {
								if(typeof progress === 'number')
								{
									this._vocabularyList[i].progress = progress;
								}
							}, err => console.log(err));
					}
				}, err => console.log(err));
		}
	}

	public get(){
		return this._vocabularyList;
	}

	public getVocabulary(vocabularyID: number){
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
		if(temp.isDownloaded == false)
		{
			this._httpService.get({
				url: '/recitationvocabulary',
				data: {
					id: vocabularyID
				}
			})
			.map(res => res.json())
			.subscribe(
				vocabulary => {
					this._storageService.set('vocabulary:' + vocabularyID, vocabulary[0].word);
					this._storageService.set('vocabularyProgress:' + vocabularyID, 0);
					temp.isDownloaded = true;
					temp.word = vocabulary[0].word;
					temp.progress = 0;
				}, err => console.log(err));
		}
		else
		{
			this._storageService.get('vocabulary:' + vocabularyID).then(
				word => {
					temp.word = word;
				}, err => console.log(err));
			this._storageService.get('vocabularyProgress:' + vocabularyID).then(
				progress => {
					temp.progress = progress;
				}, err => console.log(err));
		}
		return temp;
	}

	public getVocabularyList(){
		return this._httpService.get({
			url: '/recitationvocabulary',
			data: {}
		}).map(res => res.json());
	}

	// public getVocabulary(vocabularyID: number){
	// 	return this._httpService.get({
	// 		url: '/recitationvocabulary',
	// 		data: {
	// 			id: vocabularyID
	// 		}
	// 	}).map(res => res.json());
	// }

	public getLocalVocabularyList(id: number){
		return this._storageService.get('vocabularyList');
	}

	public setLocalVocabularyList(vocabularyList: any){
		return this._storageService.set('vocabularyList', vocabularyList);
	}
	
	public getCurrentProcess(id: number){
		//return this._storageService.get();
	}

	public updateCurrentProcess(id: number, change: number){
		this.getLocalVocabularyList(id)
			.then(data => {
				data.currentProcess = data.currentProcess + change;
				this.setLocalVocabularyList(data);
			})
	}
}