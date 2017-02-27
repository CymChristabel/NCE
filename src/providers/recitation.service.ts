import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Vocabulary } from '../interfaces/vocabulary.interface';

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
						this._vocabularyList[i].isDownloaded = false
					}
					else
					{
						this._vocabularyList[i].isDownloaded = true;
					}
					console.log(this._vocabularyList[i]);
				}, err => console.log(err));
		}
	}

	public getVocabularyList(){
		return this._httpService.get({
			url: '/recitationvocabulary',
			data: {}
		}).map(res => res.json());
	}

	public getVocabulary(vocabularyID: number){
		return this._httpService.get({
			url: '/recitationvocabulary',
			data: {
				id: vocabularyID
			}
		}).map(res => res.json());
	}

	public getLocalVocabularyList(id: number){
		return this._storageService.get('vocabularyList');
	}

	public setLocalVocabularyList(vocabularyList: Vocabulary){
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