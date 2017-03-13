import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';

@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html'
})
export class FavoritePage {

  	private _select;
  	private _nceList;
  	private _wordList;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _recitationService: RecitationService, private _nceService: NCEService) {
		this._select = 'NCE';

		this._recitationService.getFavoriteList().then(
			favoriteList => {
				this._wordList = favoriteList;
			}, err => console.log(err));
		this._nceService.getFavoriteList().then(
			favoriteList => {
				this._nceList = favoriteList;
			}, err => console.log(err));
	}

	private _goDetailPage(object: any){
		// this._navCtrl.push(SelectDetailPage, {'detail': object, 'type': this._select});
	}
}
