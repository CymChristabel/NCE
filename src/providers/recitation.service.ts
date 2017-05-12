import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as async from 'async';
import * as superagent from 'superagent';
import * as cheerio from 'cheerio';

@Injectable()

export class RecitationService{
	private _vocabularyList;

	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
		console.log('init vocabulary service....');
		this._storageService.get('vocabularyList').then(
			localVocabularyList => {
				console.log(localVocabularyList);
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
							this._checkDownload();
							this._storageService.set('vocabularyList', vocabularyList);
						}, err => console.log('vocabulary remote:' + err));
				}
				else
				{
					this._vocabularyList = localVocabularyList;
					this._checkDownload();
				}
			}
		);
	}

	public synchronizeData(callback){
		let userID = this._userService.getUserID();
		if(userID)
		{
			async.series([
				(cb) => {
					this._httpService.get({
						url: '/wordfavorite',
						data: {
							userID: userID
						}
					}).map(res => res.json())
					.subscribe(
						favoriteList => {
							for(let i = 0; i < favoriteList.length; i++)
							{
								favoriteList[i] = {
									id: favoriteList[i].id,
									vocabularyID: favoriteList[i].vocabulary,
									wordID: favoriteList[i].word.id,
									name: favoriteList[i].word.name
								};
							}
							this._storageService.set('word_favorite', favoriteList);
							cb(null, true);
					}, err => {
						console.log(err)
						cb(err, null);
					});
				},
				(cb) => {
					this._httpService.get({
						url: '/recitationprogress',
						data: {
							userID: userID
						}
					}).map(res => res.json())
					.subscribe(
						progressList => {
							this._storageService.get('vocabularyProgress').then(
								localProgressList => {
									if(localProgressList)
									{
										for(let i = 0; i < progressList.length; i++)
										{
											let flag = false;
											for(let j = 0; j < localProgressList.length; j++)
											{
												if(progressList[i].vocabulary == localProgressList[j].id)
												{
													if(progressList[i].progress > localProgressList[j].progress)
													{
														localProgressList[j].progress = progressList[i].progress;
													}
													else
													{
														this._httpService.post('/recitationprogress/createOrUpdate', {
															userID: this._userService.getUserID(),
															vocabularyID: localProgressList[j].id,
															progress: localProgressList[j].progress,
															time: localProgressList[j].time
														}).map(res => res)
														.subscribe(ok => true, err => console.log(err));
													}
													flag = true;
													break;
												}
												if(!flag)
												{
													localProgressList.push({
														id: progressList[i].vocabulary,
														progress: progressList[i].progress,
														time: progressList[i].time
													});
												}
											}
										}
									}
									else
									{
										localProgressList = [];
										for(let i = 0; i < progressList.length; i++)
										{
											localProgressList.push({
												id: progressList[i].vocabulary,
												progress: progressList[i].progress,
												time: progressList[i].time
											});
										}
									}
									if(this._vocabularyList)
									{
										for(let i = 0; i < this._vocabularyList.length; i++)
										{
											let flag = false;
											for(let j = 0; j < localProgressList.length; j++)
											{
												if(this._vocabularyList[i].id == localProgressList[j].id)
												{
													this._vocabularyList[i].progress = localProgressList[j].progress;
													this._vocabularyList[i].time = localProgressList[j].time;
													flag = true;
													break;
												}
											}
											if(!flag)
											{
												this._vocabularyList[i].progress = 0;
												this._vocabularyList[i].time = 0;
												localProgressList.push({ id: this._vocabularyList[i].id, progress: 0, time: 0 });
											}
										}
										this._storageService.set('vocabularyProgress', localProgressList);
									}
									cb(null, true);
								});
						}, err => {
							console.log(err)
							cb(err, null);
						});	
					}
				], (err, result) => {
					callback(null, true);
				});
		}
		else
		{
			callback(null, true);
		}
		
	}

	private _checkDownload(){
		for(let i = 0; i < this._vocabularyList.length; i++)
		{
			this._storageService.get('vocabularyWord:' + this._vocabularyList[i].id).then(
				result => {
					result ? this._vocabularyList[i].isDownloaded = true : this._vocabularyList[i].isDownloaded = false;
					result ? this._vocabularyList[i].wordNumber = result.length : this._vocabularyList[i].wordNumber = 0;
				});
		}
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

	public resetProgress(vocabularyID: number){
		return this._httpService.post('/recitationprogress/resetProgress', {
			userID: this._userService.getUserID(),
			vocabularyID: vocabularyID
		}).map(res => {
			console.log(res);
			if(res.ok)
			{
				for(let i = 0; i < this._vocabularyList.length; i++)
				{
					if(vocabularyID == this._vocabularyList[i].id)
					{
						this._vocabularyList[i].progress = 0;
						break;
					}
				}
				this._storageService.get('vocabularyProgress').then(
					progressList => {
						for(let i = 0; i < progressList.length; i++)
						{
							if(vocabularyID == progressList[i].id)
							{
								progressList[i].progress = 0;
								break;
							}
						}
						this._storageService.set('vocabularyProgress', progressList);
					});
			}
			return res;
		});
	}

	public getVocabularyForSlide(vocabularyID: number){
		return _.find(this._vocabularyList, ['id', vocabularyID]);
	}

	public updateProgress(vocabularyID: number, value: number){
		let temp = _.find(this._vocabularyList, ['id', vocabularyID]);
		temp.progress = temp.progress + value;
		this._storageService.get('vocabularyProgress').then(progress => {
			for(let i = 0; i < progress.length; i++)
			{
				if(progress[i].id == vocabularyID)
				{
					progress[i].progress = progress[i].progress + value;
					if(temp.progress == temp.word.length)
					{
						progress[i].time = progress[i].time + 1;
					}
					this._storageService.set('vocabularyProgress', progress);
					break;
				}
			}
		});

		this._httpService.post('/recitationprogress/createOrUpdate', {
			userID: this._userService.getUserID(),
			vocabularyID: vocabularyID,
			progress: temp.progress,
			time: temp.time
		}).map(res => res)
		.subscribe(ok => true, err => console.log(err));
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
				id: vocabularyID,
				userID: this._userService.getUserID()
			}
		})
		.map(res => {
			if(_.has(res.json(), 'ok') == false)
			{
				let temp = _.find(this._vocabularyList, { id: vocabularyID });
				this._storageService.set('vocabularyWord:' + vocabularyID, res.json().word.word);
				temp.isDownloaded = true;
				temp.wordNumber = res.json().word.word.length;
				temp.word = res.json().word.word;
				return temp;
			}
			return res.json();
		});
	}

	public getVocabularyList(){
		return this._vocabularyList;
	}

	public getAudioPath(path: string){
		return this._httpService.getBaseURL() + '/file/getAudio?audio=' + path;
	}

	public getAlternateAudioPath(name: string){
		return superagent.get('http://www.iciba.com/' + name)
				.then((html, err) => {
					if(err)
					{
						return err;
					}
					console.log(html);
					let $ = cheerio.load(html.text);
					let temp;
					$('i.new-speak-step').each((i, elem) => {
						if($(elem).attr('ms-on-mouseover'))
						{
							temp = $(elem).attr('ms-on-mouseover').slice(7, $(elem).attr('ms-on-mouseover').length - 2);
							return;
						}
					});
					console.log(temp);
					return temp;
				});
	}

	public wordCrawler(name: string){
		return superagent.get('http://www.iciba.com/' + name)
				.then((html, err) => {
					if(err)
					{
						return err;
					}
					let $ = cheerio.load(html.text);
					let word = { name: name, audio: '', meaning: [], example: [] };
					$('i.new-speak-step').each((i, elem) => {
						if($(elem).attr('ms-on-mouseover'))
						{
							word.audio = $(elem).attr('ms-on-mouseover').slice(7, $(elem).attr('ms-on-mouseover').length - 2);
							return false;
						}
					});
					$('ul.base-list').find('span.prop').each((i, elem) => {
						let temp = { attribute: $(elem).text(), explainnation: [] };
						word.meaning.push(temp);
					});
					let count = 0;
					$('ul.base-list').find('p').each((i, elem) => {
						$(elem).find('span').each((item, element) => {
							word.meaning[count].explainnation.push($(element).text());
						});
						count = count + 1;
					});
					$('div.sentence-item').each((i, elem) => {
						if(!$(elem).find('p.family-english').find('i.icon-sound').attr('ms-on-click'))
						{
							return false;
						}
						let temp = { engText: '', chnText: '', audio: '' };
						temp.engText = $(elem).find('p.family-english').find('span').text();
						temp.chnText = $(elem).find('p.family-chinese').text();
						temp.audio = $(elem).find('p.family-english').find('i.icon-sound').attr('ms-on-click');
						temp.audio = temp.audio.slice(7, temp.audio.length - 2);
						word.example.push(temp);
					});
					return word;
				});
	}

	public addFavorite(vocabularyID: number, wordID: number, name: string = undefined){
		return this._httpService.post('/wordfavorite/add', {
			vocabularyID: vocabularyID,
			wordID: wordID,
			userID: this._userService.getUserID()
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

	public deleteLocalData(callback){
		async.series([
			(cb) => {
				this._storageService.remove('word_favorite').then(cb(null, true));
			},
			(cb) => {
				this._storageService.remove('vocabularyProgress').then(cb(null, true));
			}], (err, ok) => {
				callback(null, true);
			});
	}

}