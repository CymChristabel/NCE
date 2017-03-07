import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { NCEModalPage } from './modal';
import { NCEStudyPage } from '../nce-study/nce-study';

import { NCEService } from '../../../providers/nce.service';

@Component({
  selector: 'page-nce-overall',
  templateUrl: 'nce-overall.html'
})
export class NCEOverallPage {
	private _book;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _nceService: NCEService, private _modalCtrl: ModalController) {
		this._book = this._nceService.getBook(this._navParams.get('id'));
	}

	private _showModal(){
		let modal = this._modalCtrl.create(NCEModalPage, { lession: this._book.lession });
		modal.present();
	}

	private _submitTask(){
	}
}
