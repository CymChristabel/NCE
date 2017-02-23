import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { StorageService } from './storage.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class HttpService{

	static BASE_URL: string = "http://localhost:1337";
    private _authToken: string;    
	constructor(private _http: Http, private _storageService: StorageService) {
        this._storageService.get('user')
            .then(user => {
                if (user != undefined)
                {
                    this._authToken = 'JWT ' + user.token;
                }
                else
                {
                    console.log('user not found');
                }
        });
    }

    private _getHeaders(extraHeaders): Headers {
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': this._authToken});
        // let headers = new Headers({'Content-Type': 'application/json'});
        console.log(headers);
        if(extraHeaders && typeof extraHeaders == 'object')
        {
            extraHeaders.forEach((key, value) => {
                headers.append(key, value);
            });
        }
        return headers;
    }

    private _parseParameter(param: Object){
    	var parameter = param['url'];
    	if(param['data'].length != 0)
    	{
    		parameter = parameter + '?';
    		Object.getOwnPropertyNames(param['data']).forEach(function(val, idx, array){
				parameter = parameter + val + '=' + param['data'][val] + '&';
			});
			parameter = parameter.slice(0, -1);
    	}
    	return parameter;
    }

    public get(param: Object, headers?: Object){
		return this._http.get(HttpService.BASE_URL + this._parseParameter(param), { headers: this._getHeaders(headers) });
    }

    public post(route: String, param: Object, headers?: Object){
        return this._http.post(HttpService.BASE_URL + route, JSON.stringify(param), { headers: this._getHeaders(headers) });
    }

    public put(route: String, param: Object, headers?: Object){
        return this._http.put(HttpService.BASE_URL + route, JSON.stringify(param), { headers: this._getHeaders(headers) });
    }

    public updateAuthToken(authToken: string){
        this._authToken = authToken;
    }

}