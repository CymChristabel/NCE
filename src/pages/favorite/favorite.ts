import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';

import { NCEStudyMainPage } from '../nce/nce-study/nce-study-main';
import { WordModalPage } from '../word-modal/word-modal';

import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';

import * as _ from 'lodash';

@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html'
})
export class FavoritePage {

  	private _select;
  	private _nceList;
  	private _wordList;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _viewCtrl: ViewController, private _alertCtrl: AlertController, private _modalCtrl: ModalController, private _recitationService: RecitationService, private _nceService: NCEService) {
		
	}

	ionViewWillEnter(){
		this._select = 'NCE';

		this._recitationService.getFavoriteList().then(
						favoriteList => {
							this._wordList = favoriteList;
							console.log(this._wordList);
						}, err => console.log(err));

		this._nceService.getFavoriteList().then(
			favoriteList => {
				this._nceList = favoriteList;
			}, err => console.log(err));
	}

	private _goNCEStudyPage(item: any){
		this._navCtrl.push(NCEStudyMainPage, { bookID: item.bookID, lession: this._nceService.getLession(item.bookID, item.lessionID) });
	}

	private _goWordModal(item: any){
		this._recitationService.getWord(item.vocabularyID, item.wordID).then(
			word => {
				let modal = this._modalCtrl.create(WordModalPage, { vocabularyID: item.vocabularyID, word: word, recitationService: this._recitationService });
				modal.onWillDismiss(data => {
					this._recitationService.getFavoriteList().then(
						favoriteList => {
							this._wordList = favoriteList;
						}, err => console.log(err));
				});
				modal.present();
			}, err => {
				let alert = this._alertCtrl.create({
					title: '单词本未下载',
					subTitle: '请去单词列表下载单词本',
					buttons: ['ok']
				});
				alert.present();
			});
	}

	private _removeFavorite(item: any){
		if(this._select == 'NCE')
		{
			this._nceService.removeFavorite(item.bookID, item.lessionID, item.id).then(favoriteList => {
				this._nceList = favoriteList;
				}, err => console.log(err));
		}
		else
		{
			this._recitationService.removeFavorite(item.vocabularyID, item.wordID, item.id).then(favoriteList => {
				this._wordList = favoriteList;
				}, err => console.log(err));
		}
	}

	private _synchronize(refresher){
    	console.log(this._nceList);
    	console.log(this._wordList);
    	refresher.complete();
	}
}
