import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

	private _userData;

	constructor(private _httpService: HttpService, private _storageService: StorageService) {
		this._storageService.get('userData').then(
			userData => {
				this._userData = userData;
			}, err => console.log(err));
	}

	public login(user: any){
		return this._httpService.post('/auth/login', user).map(res => res.json());
	}

	public updateUser(userData: any){
		this._userData = userData.user;
		this._httpService.updateAuthToken('JWT ' + userData.token);
		this._storageService.set('userData', userData);
	}

	public logout(){
		return this._storageService.set('auth_token', '');
	}
	
	public signUp(user: any){
		return this._httpService.post('/auth/signup', user).map(res => res.json());
	}

	public testAuth(){
		return this._httpService.get({
			url: '/auth/testAuth',
			data: {}
		}).map(res => res.json());
	}

	public getUser(){
		return this._userData;
	}

}
