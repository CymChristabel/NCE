import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

import * as socketIOClient from 'socket.io-client';
import * as sailsIOClient from 'sails.io.js';

@Injectable()
export class FriendService {
  	constructor(private _httpService: HttpService, private _storageService: StorageService, private _userService: UserService) {
      this._httpService.directGet('http://v.163.com/special/opencourse/englishs1.html').map(res => res.json()).subscribe(data => console.log(data), err => console.log(err));
  	}

  	public searchUser(key: string){
  		return this._httpService.get({
  			url: '/friend/searchUser',
  			data: {
  				key: key,
  				userID: this._userService.getUserID()
  			}
  		}).map(res => res.json());
  	}

  	public sendRequest(targetID: any){
  		return this._httpService.post('/friend/postRequest', {
  			userID: this._userService.getUserID(),
  			responseUserID: targetID
  		}).map(res => res.json());
  	}

    public acceptRequest(targetID: any){
      return this._httpService.post('/friend/resolveRequest', {
        userID: this._userService.getUserID(),
        requestUserID: targetID
      }).map(res => res.json());
    }

    public getFriend(){
      return this._httpService.get({
          url: '/friend/getFriend',
          data: {
            userID: this._userService.getUserID()
          }
        }).map(res => res.json());
    }

    public getRequest(){
      return this._httpService.get({
        url: '/friend/getRequest',
        data: {
          userID :this._userService.getUserID()
        }
      }).map(res => res.json());
    }

    public sayGoodbye(targetID: number){
      return this._httpService.post('/friend/sayGoodbye', {
        userID: this._userService.getUserID(),
        friendID: targetID
      }).map(res => res)
    }

    public rejectRequest(targetID: number){
      return this._httpService.post('/friend/rejectRequest', {
        userID: this._userService.getUserID(),
        requestUserID: targetID
      }).map(res => res);
    }
}