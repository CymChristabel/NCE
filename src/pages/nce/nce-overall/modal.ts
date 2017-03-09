import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';

import { NCEStudyPage } from '../nce-study/nce-study';

import * as _ from 'lodash';

@Component({
  templateUrl: 'modal.html'
})

export class NCEModalPage{
	private _lession;
	constructor(private _platform: Platform, private _navCtrl: NavController, private _navParams: NavParams, private _viewCtrl: ViewController){
		this._lession = this._navParams.get('lession');
		
	}
  
  private _goNCEStudy(lession: any){
    this._navCtrl.push(NCEStudyPage, { lession: lession });
  }
  
	private _dismiss(){
		this._viewCtrl.dismiss();
	}
  
}
