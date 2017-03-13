import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()

export class RecitationService{
	private _vocabularyList;

	constructor(private _httpService: HttpService, private _storageService: StorageService) {
		console.log('init vocabulary service....');
		this._storageService.get('vocabularyList').then(
			localVocabularyList => {
				if(localVocabularyList == undefined)
				{
					this._httpService.get({
						url: '/recitationvocabulary',
						data: {}
					})
					.map(res => res.json())
					.subscribe(
						vocabularyList => {
							this._vocabularyList = vocabularyList;
							this._storageService.set('vocabularyList', vocabularyList);
							this._checkDownload();
						}, err => console.log('vocabulary remote:' + err));
				}
				else
				{
					this._vocabularyList = localVocabularyList;
					this._checkDownload();
				}
			}
		)
	}
	//check whether words are downloaded and set the progress
	private _checkDownload(){
		for(let i = 0; i < this._vocabularyList.length; i++)
		{
			this._storageService.get('vocabulary:' + this._vocabularyList[i].id).then(
				vocabulary => {
					if(vocabulary == undefined)
					{
						this._vocabularyList[i].isDownloaded = false;
						this._vocabularyList[i].progress = 0;

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

	public getVocabulary(vocabularyID: number){
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
		if(_.has(temp, 'word') == false)
		{
			this._storageService.get('vocabulary:' + vocabularyID).then(
				word => {
					temp.word = word;
				}, err => console.log(err));
		}
		return temp;
	}

	public downloadVocabulary(vocabularyID: number, loading: any = undefined){
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
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
				if(loading)
				{
					loading.dismiss();
				}
			}, err => {
				console.log(err);
				loading.dismiss();
			});
		return temp;
	}

	public getVocabularyList(){
		return this._vocabularyList;
	}

	public updateProgress(vocabularyID: number, value: number){
		_.find(this._vocabularyList, ['id', vocabularyID]).progress = _.find(this._vocabularyList, ['id', vocabularyID]).progress + value;
		this._storageService.set('vocabularyProgress:' + vocabularyID, _.find(this._vocabularyList, ['id', vocabularyID]).progress);
	}

	public changeFavorite(vocabularyID: number, wordID: number, name: string, add: boolean){
		this._storageService.get('word_favorite').then(
			favoriteList => {
				if(add == true)
				{
					if(favoriteList == undefined)
					{
						favoriteList = [];
					}	
					favoriteList.push({ vocabularyID: vocabularyID, wordID: wordID, name: name });
				}
				else
				{
					_.remove(favoriteList, { vocabularyID: vocabularyID, wordID: wordID });
				}
				this._storageService.set('word_favorite', favoriteList);
			}, err => console.log(err));
	}

	public getFavoriteList(){
		return this._storageService.get('word_favorite');
	}

}