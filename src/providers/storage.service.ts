import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageService{
	constructor(private _storage: Storage){
		/*
		test only
		this.storage.length().then(r => console.log(r));
		this.storage.keys().then(r => console.log(r));
		*/
	}	

	public set(key: string, value: any){
		return this._storage.set(key, value);
	}

	public get(key: string){
		return this._storage.get(key);
	}

	public clear(){
		return this._storage.clear();
	}

	public remove(key: string){
		return this._storage.remove(key);
	}

}