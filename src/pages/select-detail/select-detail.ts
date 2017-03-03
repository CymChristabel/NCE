import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';

import { RecitationService } from '../../providers/recitation.service';
import { TaskService } from '../../providers/task.service';

import { ModalContentPage } from './modal-content';

/*
  Generated class for the SelectDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
	selector: 'page-select-detail',
	templateUrl: 'select-detail.html'
})

export class SelectDetailPage {
	private _detail;
	private _time;
	private _type;
	private _img;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _modalCtrl: ModalController, private _recitationService: RecitationService, private _taskService: TaskService) {
		this._detail = this._navParams.get('detail');
		this._type = this._navParams.get('type');
		if(this._type == 'NCE')
		{
			this._img = 'assets/img/NCE2.jpg';
		}
		else
		{
			this._detail = this._recitationService.getVocabulary(this._detail.id);
			this._img = 'assets/img/tawawa.jpg';
		}
		this._time = '10:00';
	}

	private _showModal(){
		let modal;
		if(this._type == 'NCE')
		{
			modal = this._modalCtrl.create(ModalContentPage, { 'detail': this._detail.lession, 'type': this._type});
		}
		else
		{
			modal = this._modalCtrl.create(ModalContentPage, { 'detail': this._detail.word, 'type': this._type});
		}
		modal.present();
	}

	private _submitTask(){
		this._taskService.addTask({
			type: this._type,
			title: this._detail.title,
			progress: 0,
			time: this._time,
			isFinished: false
		});
		this._navCtrl.pop();
	}
}
