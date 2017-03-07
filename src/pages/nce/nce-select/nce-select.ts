import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NCEOverallPage } from '../nce-overall/nce-overall';

import { NCEService } from '../../../providers/nce.service';

/*
  Generated class for the NceSelect page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nce-select',
  templateUrl: 'nce-select.html'
})
export class NCESelectPage {

  constructor(private _navCtrl: NavController, private _navParams: NavParams, private _nceService: NCEService) {

  }

  private _goOverallPage(id: number){
  	this._navCtrl.push(NCEOverallPage, { id: id });
  }
}
