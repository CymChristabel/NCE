import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()
export class NCEService {
	private _bookList;
  	constructor(private _httpService: HttpService, private _storageService: StorageService) {
  		console.log('init book service...');
		this.getLocalBookList().then(
			localBookList => {
				if(localBookList == undefined)
				{
					this.getRemoteBookList().subscribe(
						bookList => {
							this._bookList = bookList;
							this._storageService.set('NCE_book_list', bookList);
						}, err => console.log(err));
				}
				else
				{
					this._bookList = localBookList;
				}
			}, err => console.log(err));
	}

	public getBookList(){
		return this._bookList;
	}

	public getBook(id: number){
		return _.find(this._bookList, { id: id });
	}

	public getLession(bookID: number, lessionID: number){
		return _.find(_.find(this._bookList, { id: bookID} ).lession, {id: lessionID});
	}

	public getRemoteBookList(){
		return this._httpService.get({
			url: '/nce_book',
			data: {}
		}).map(res => res.json());
	}

	public getLocalBookList(){
		return this._storageService.get('NCE_book_list');
	}

	public addFavorite(bookID: number, lessionID: number, title: string){
		return this._storageService.get('NCE_favorite').then(
			favoriteList => {
				if(favoriteList == undefined)
				{
					favoriteList = [];	
				}
				favoriteList.push({ bookID: bookID, lessionID: lessionID, title: title });
				this._storageService.set('NCE_favorite', favoriteList);
				return true;
			}, err => {
				console.log(err);
				return false;
			});
	}

	public removeFavorite(bookID: number, lessionID: number){
		return this._storageService.get('NCE_favorite').then(
			favoriteList => {
				_.remove(favoriteList, { bookID: bookID, lessionID: lessionID });
				this._storageService.set('NCE_favorite', favoriteList);
				return favoriteList;
			}, err => console.log(err));
	}

	public getFavoriteList(){
		return this._storageService.get('NCE_favorite');
	}

}
