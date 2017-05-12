import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { WordCrawledPage } from '../word-crawled/word-crawled';

import { RecitationService } from '../../providers/recitation.service';
@Component({
  selector: 'page-word-search',
  templateUrl: 'word-search.html'
})
export class WordSearchPage {
	private _word;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _recitationService: RecitationService, private _loadingCtrl: LoadingController, private _toastCtrl: ToastController) {}

	ionViewDidLoad() {

	}

	private _submit(){
		let loading = this._loadingCtrl.create({
			content: 'crawling...'
		});
		loading.present();
		this._recitationService.wordCrawler(this._word).then((word, err) => {
			loading.dismiss();
			if(err)
			{
				
				let toast = this._toastCtrl.create({
					message: 'crawling failed',
					duration: 2000,
					position: 'bottom'
				});
				toast.present();
				return;
			}
			this._navCtrl.push(WordCrawledPage, { word: word });
		});
	}
}
