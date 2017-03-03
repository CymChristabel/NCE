import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

/*
  Generated class for the NCEService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
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

	public getBook(booklist: number, book: number){
		if(this._bookList[booklist].lession[book] != undefined)
		{
			return this._bookList[booklist].lession[book];
		}
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

}
