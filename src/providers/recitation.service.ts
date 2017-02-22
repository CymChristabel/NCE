import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Vocabulary } from '../interfaces/vocabulary.interface';

@Injectable()

export class RecitationService{
	
	constructor(private _httpService: HttpService, private _storageService: StorageService) {
		// this._storageService.clear();
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
		return this._storageService.get('vocabularyList:' + id);
	}

	public setLocalVocabularyList(vocabulary: Vocabulary){
		return this._storageService.set('vocabularyList:' + vocabulary.id, vocabulary);
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