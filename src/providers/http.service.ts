import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { StorageService } from './storage.service';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class HttpService{
    // static BASE_URL: string = "http://139.199.195.150:1337";
	static BASE_URL: string = "http://localhost:1337";
    private _authToken: string;    
	constructor(private _http: Http, private _storageService: StorageService) {
        this._storageService.get('userData')
            .then(userData => {
                if (userData != undefined)
                {
                    this._authToken = 'JWT ' + userData.token;
                }
                else
                {
                    console.log('userData not found');
                }
        });
    }

    private _getHeaders(extraHeaders): Headers {
        let temp = { 'Content-Type': 'application/json', 'Authorization': this._authToken };
        if(extraHeaders && typeof extraHeaders == 'object')
        {
            for(let i in extraHeaders)
            {
                temp[i] = extraHeaders[i];
            }
        }
        let headers = new Headers(temp);
        return headers;
    }

    private _parseParameter(param: Object){
    	var parameter = param['url'];
    	if(param['data'] && param['data'].length != 0)
    	{
    		parameter = parameter + '?';
    		Object.getOwnPropertyNames(param['data']).forEach(function(val, idx, array){
				parameter = parameter + val + '=' + param['data'][val] + '&';
			});
			parameter = parameter.slice(0, -1);
    	}
    	return parameter;
    }

    public getBaseURL(){
        return HttpService.BASE_URL;
    }
    
    //http get must have a url key
    public get(param: Object, headers?: Object){
		return this._http.get(HttpService.BASE_URL + this._parseParameter(param), { headers: this._getHeaders(headers) });
    }

    public post(route: String, param: Object, headers?: Object){
        return this._http.post(HttpService.BASE_URL + route, JSON.stringify(param), { headers: this._getHeaders(headers) });
    }

    public put(route: String, param: Object, headers?: Object){
        return this._http.put(HttpService.BASE_URL + route, JSON.stringify(param), { headers: this._getHeaders(headers) });
    }

    public getAuthToken(authToken: string){
        this._authToken = authToken;
    }

    public handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) 
        {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else 
        {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }

    public directGet(url: string, headers?: Object){
        return this._http.get(url, { headers: new Headers(headers) });
    }
}