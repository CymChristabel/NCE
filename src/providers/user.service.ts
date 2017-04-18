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

	public synchronizeData(callback){
		if(this._userData)
		{
			this._httpService.post('/user/getUserDetail', {
				email: this._userData.user.email
			}).map(res => res.json())
			.subscribe(
				data => {
					this._userData.user = data;
					callback(null, true);
				}, err => {
					console.log(err);
					callback(false, null);
				});
		}
	}

	private _updateUser(userData: any){
		this._userData = userData;
		this._httpService.getAuthToken('JWT ' + userData.token);
		this._storageService.set('userData', userData);
	}

	public login(account: any){
		return this._httpService.post('/auth/login', account).map(
			res => {
				if(res != undefined)
				{
					this._updateUser(res.json());
					console.log(this._userData);
					return true;
					
				}
				return false;
			});
	}
	
	public signUp(user: any){
		return this._httpService.post('/auth/signup', user).map(
			res => {
				if(res != undefined)
				{	
					if(res.json().token == -1)
					{
						return -1;
					}
					else
					{
						this._updateUser(res.json());
						return true;	
					}
				}
				return false;
			});
	}

	public changeNickname(nickname: string){
		return this._httpService.post('/user/changeNickname', {
			email: this._userData.user.email,
			nickname: nickname
		}).map(res => {
			if(res.ok == true)
			{
				this._userData.user.nickname = res.json().nickname;
			}
			this._storageService.set('userData', this._userData);
			return res.json();
		});
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

	public getUserID(){
		return this._userData.user.id;
	}

	public changePassword(oldPassword: number, newPassword: number){
		return this._httpService.post('/auth/resetPassword', {
			email: this._userData.user.email,
			oldPassword: oldPassword,
			newPassword: newPassword
		}).map(res => res.json())
	}

	public deleteLocalData(callback){
		this._storageService.remove('userData').then(callback(null, true)); 
	}
}
