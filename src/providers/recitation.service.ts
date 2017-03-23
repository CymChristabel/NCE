import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()

export class RecitationService{
	private _vocabularyList;

	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
		console.log('init vocabulary service....');
		//test favorite
		// this._storageService.remove('vocabularyWord:' + 1);
		// this._storageService.remove('vocabularyProgress:' + 1);
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
			this._storageService.get('vocabularyProgress:' + this._vocabularyList[i].id).then(
				progress => {
					if(progress == undefined)
					{
						this._vocabularyList[i].isDownloaded = false;
					}
					else if(typeof progress === 'number')
					{
						this._vocabularyList[i].isDownloaded = true;
						this._vocabularyList[i].progress = progress;
					}
				}, err => console.log(err));
		}
	}

	public getVocabulary(vocabularyID: number){
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
		if(_.has(temp, 'word') == false)
		{
			this._storageService.get('vocabularyWord:' + vocabularyID).then(
				word => {
					temp.word = word;
				}, err => console.log(err));
		}
		return temp;
	}

	public getWord(vocabularyID: number, wordID: number){
		let temp = _.find(this._vocabularyList, { id: vocabularyID });
		if(temp.isDownloaded == false)
		{
			return new Promise((resolve, reject) => {
				reject('You have to download vocabulary first');
			});
		}
		else if(_.has(temp, 'word') == false)
		{
			return this._storageService.get('vocabularyWord:' + vocabularyID).then(
				word => {
					temp.word = word;
					return  _.find(temp.word, { id: wordID });
				}, err => console.log(err));
		}
		else
		{
			return new Promise((resolve, reject) => {
				resolve(_.find(temp.word, { id: wordID }));
			});
		}
	}

	public downloadVocabulary(vocabularyID: number){
		return this._httpService.get({
			url: '/recitationvocabulary',
			data: {
				id: vocabularyID
			}
		})
		.map(res => {
			if(_.has(res.json(), 'ok') == false)
			{
				let temp = _.find(this._vocabularyList, { id: vocabularyID });
				this._storageService.set('vocabularyWord:' + vocabularyID, res.json()[0].word);
				this._storageService.set('vocabularyProgress:' + vocabularyID, 0);
				temp.progress = 0;
				temp.isDownloaded = true;
				temp.word = res.json()[0].word;
				return temp;
			}
			return res.json();
		});
	}

	public getVocabularyList(){
		return this._vocabularyList;
	}

	public updateProgress(vocabularyID: number, value: number){
		_.find(this._vocabularyList, ['id', vocabularyID]).progress = _.find(this._vocabularyList, ['id', vocabularyID]).progress + value;
		this._storageService.set('vocabularyProgress:' + vocabularyID, _.find(this._vocabularyList, ['id', vocabularyID]).progress);
	}

	public addFavorite(vocabularyID: number, wordID: number, name: string = undefined){
		return this._httpService.post('/wordfavorite/add', {
			vocabularyID: vocabularyID,
			wordID: wordID,
			userID: this._userService.getUser().user.id
		}).map(res => {
			this.getFavoriteList().then(
				favoriteList => {
					if(favoriteList == undefined)
					{
						favoriteList = [];
					}
					let id = -1;
					if(res.ok == true)
					{
						id = res.json();
					}
					else
					{
						this._storageService.set('word_favorite_sync', false);
					}
					favoriteList.push({
						id: id,
						vocabularyID: vocabularyID,
						wordID: wordID,
						name: name
					});
					this._storageService.set('word_favorite', favoriteList);
			});
			return res.json();
		});
	}

	public removeFavorite(vocabularyID: number, wordID: number, favoriteID: number){
		if(favoriteID != -1)
		{
			this._httpService.put('/wordfavorite/remove', {
				id: favoriteID
			}).map(res => res).subscribe(success => {}, err => console.log(err));
		}
		return this._storageService.get('word_favorite').then(
			favoriteList => {
				_.remove(favoriteList, { vocabularyID: vocabularyID, wordID: wordID });
				this._storageService.set('word_favorite', favoriteList);
				return favoriteList;
			});
	}

	public getFavoriteList(){
		return this._storageService.get('word_favorite');
	}

}