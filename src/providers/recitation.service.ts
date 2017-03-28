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
							this._checkDownloadAndProgress();
							this._storageService.set('vocabularyList', vocabularyList);
						}, err => console.log('vocabulary remote:' + err));
				}
				else
				{
					this._vocabularyList = localVocabularyList;
					this._checkDownloadAndProgress();
				}
			}
		).then(r => {console.log(this._vocabularyList)})
	}

	private _checkDownloadAndProgress(){
		for(let i = 0; i < this._vocabularyList.length; i++)
		{
			this._storageService.get('vocabularyWord:' + this._vocabularyList[i].id).then(
				result => {
					result ? this._vocabularyList[i].isDownloaded = true : this._vocabularyList[i].isDownloaded = false;
				});
		}
		this._storageService.get('vocabularyProgress').then(
			progress => {
				if(progress)
				{
					for(let i = 0; i < this._vocabularyList.length; i++)
					{
						for(let j = 0; j < progress.length; j++)
						{
							if(this._vocabularyList[i].id == progress[j].id)
							{
								this._vocabularyList[i].progress = progress[j].progress;
								break;
							}
							if(j == progress.length - 1)
							{
								this._vocabularyList[j].progress = 0;
								progress.push({ id: this._vocabularyList[i].id, progress: 0 });
							}
						}		
					}
				}
				else
				{
					progress = [];
					for(let i = 0; i < this._vocabularyList.length; i++)
					{
						progress.push({ id: this._vocabularyList[i].id, progress: 0 });
					}
				}
				this._storageService.set('vocabularyProgress', progress);
			});
	}

	public getVocabulary(vocabularyID: number){
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
		if(_.has(temp, 'word') == false)
		{
			this._storageService.get('vocabularyWord:' + vocabularyID).then(
				word => {
					temp.word = word;	
				});
		}

		return temp;

	}

	public updateProgress(vocabularyID: number, value: number){
		this._storageService.get('vocabularyProgress').then(progress => {
			for(let i = 0; i < progress.length; i++)
			{
				if(progress[i].id == vocabularyID)
				{
					progress[i].progress = progress[i].progress + value;
					this._storageService.set('vocabularyProgress', progress);
					//need to add server update
					break;
				}
			}
		});
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
		temp.progress = temp.progress + value;	
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