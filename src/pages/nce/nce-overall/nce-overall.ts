import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { NCEModalPage } from './modal';
import { NCEStudyMainPage } from '../nce-study/nce-study-main';

import { NCEService } from '../../../providers/nce.service';

@Component({
  selector: 'page-nce-overall',
  templateUrl: 'nce-overall.html'
})
export class NCEOverallPage {
	private _book;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _nceService: NCEService, private _modalCtrl: ModalController, private _viewCtrl: ViewController) {
		this._book = this._nceService.getBook(this._navParams.get('id'));
	}

	private _showModal(){
		let modal = this._modalCtrl.create(NCEModalPage, { bookID: this._book.id, lession: this._book.lession });

		modal.onDidDismiss(param => {
			if(param.selectedLession)
			{
				this._navCtrl.push(NCEStudyMainPage, { bookID: this._book.id, lession: param.selectedLession });
			}
		});

		modal.present();
	}

	private _submitTask(){

	}
}
