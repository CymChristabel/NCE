import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

export interface User{
	token: string;
	user: UserDetail;
}

export interface UserDetail{
	email: string;
	password: string;
	nickname: string;
	avatar: string;
	studyNotification: string;
}

@Injectable()
export class UserService {

	private _user: UserDetail;

	constructor(private _httpService: HttpService, private _storageService: StorageService) {

	}

	public login(user: User){
		return this._httpService.post('/auth/login', user).map(res => res.json());
	}

	public updateUser(data: User){
		this._user = data.user;
		console.log('JWT ' + data.token);
		this._httpService.updateAuthToken('JWT ' + data.token);
		this._storageService.set('user', data);
	}

	public logout(){
		return this._storageService.set('auth_token', '');
	}
	
	public signUp(user: User){
		return this._httpService.post('/auth/signup', user).map(res => res.json());
	}

}
