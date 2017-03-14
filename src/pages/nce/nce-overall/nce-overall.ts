import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { NCEListPage } from './nce-list';

import { NCEService } from '../../../providers/nce.service';

@Component({
  selector: 'page-nce-overall',
  templateUrl: 'nce-overall.html'
})
export class NCEOverallPage {
	private _book;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _nceService: NCEService) {
		this._book = this._nceService.getBook(this._navParams.get('id'));
	}

	private _goListPage(){
		this._navCtrl.push(NCEListPage, { bookID: this._book.id, lession: this._book.lession });
	}

	private _submitTask(){

	}
}
