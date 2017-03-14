import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NCEStudyPage } from '../nce-study/nce-study';
import { NCEStudyMainPage } from '../nce-study/nce-study-main';

import * as _ from 'lodash';

@Component({
    selector: 'page-nce-list',
  	templateUrl: 'nce-list.html'
})

export class NCEListPage{
	private _lession;
	constructor(private _navCtrl: NavController, private _navParams: NavParams){
		this._lession = this._navParams.get('lession');
	}
  
	private _goNCEStudyPage(selectedLession: any){
		this._navCtrl.push(NCEStudyMainPage, { bookID: this._navParams.get('bookID'), lession: selectedLession });
	}
  
}
