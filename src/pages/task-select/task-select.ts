import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TaskCreatePage } from '../task-create/task-create';

import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';
/*
  Generated class for the Select page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-select',
  templateUrl: 'task-select.html'
})
export class TaskSelectPage {
	private _select;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _recitationService: RecitationService, private _nceService: NCEService) {
		this._select = 'NCE';
	}

	ionViewDidLoad() {
		
	}

	private _goDetailPage(object: any){

	}

}
