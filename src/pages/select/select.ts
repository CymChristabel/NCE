import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';
/*
  Generated class for the Select page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
  providers: [ RecitationService, NCEService ]
})
export class SelectPage {
	private select: string = 'NCE';
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _recitationService: RecitationService, private _nceService: NCEService) {

	}

	ionViewDidLoad() {
		
	}

}
