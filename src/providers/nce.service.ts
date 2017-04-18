/*
	****storage variable declare****

	NCE_book_list: nce book list, include every book lession
	NCE_favorite:  nce favorite list
	nce_favorite_sync: has favorite list synchronized, can only be true in successful synchronize function
*/

import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable()
export class NCEService {
	private _bookList;
  	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
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

	public synchronizeData(callback){
		let userID = this._userService.getUserID();
		if(userID)
		{
			this._httpService.get({
				url: '/nce_favorite',
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
							bookID: favoriteList[i].book,
							lessionID: favoriteList[i].lession.id,
							title: favoriteList[i].lession.title
						};
					}
					this._storageService.set('NCE_favorite', favoriteList);
					callback(null, true);
			}, err => {
				console.log(err)
				callback(err, null);
			});
		}
		else
		{
			callback(null, true);
		}
		
	}

	public getBookList(){
		return this._bookList;
	}

	public getBook(id: number){
		return _.find(this._bookList, { id: id });
	}

	public getLession(bookID: number, lessionID: number){
		return _.find(_.find(this._bookList, { id: bookID } ).lession, { id: lessionID });
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

	public getAudioPath(path: string){
		return this._httpService.getBaseURL() + '/file/getAudio?audio=' + path; 
	}

	public addFavorite(bookID: number, lessionID: number, title: string){
		return this._httpService.post('/nce_favorite/add', {
			bookID: bookID,
			lessionID: lessionID,
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
					else //http error occur
					{
						this._storageService.set('nce_favorite_sync', false);
					}
					favoriteList.push({
						id: id,
						bookID: bookID,
						lessionID: lessionID,
						title: title
					});
					this._storageService.set('NCE_favorite', favoriteList);
				});
			return res.json();
		});
	}

	public removeFavorite(bookID: number, lessionID: number, favoriteID: number){
		if(favoriteID != -1) // do exist on server
		{
			this._httpService.post('/nce_favorite/remove', {
				id: favoriteID
			}).map(res => res).subscribe(success => console.log(success), err => {
				console.log('server', err);
				this._storageService.set('nce_favorite_sync', false);
			});
		}
		return this._storageService.get('NCE_favorite').then(
			favoriteList => {
				_.remove(favoriteList, { bookID: bookID, lessionID: lessionID });
				this._storageService.set('NCE_favorite', favoriteList);
				return favoriteList;
			});

	}

	public getFavoriteList(){
		return this._storageService.get('NCE_favorite');
	}

	public deleteLocalData(callback){
		this._storageService.remove('NCE_favorite').then(callback(null, true));
	}
}
