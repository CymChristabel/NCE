import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TaskService } from '../../providers/task.service';
import { NCEService } from '../../providers/nce.service';
import { RecitationService } from '../../providers/recitation.service';

/*
  Generated class for the TaskCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-task-create',
	templateUrl: 'task-create.html'
})
export class TaskCreatePage {
	private _select;
	private _nce;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _taskService: TaskService, private _nceService: NCEService, private _recitationService: RecitationService) {
		this._select = 'NCE';
		this._nce = { book: [], lessionData: [], lessionTitle: true, bookSelect: true, lessionSelect: true };
		
	}

	ionViewWillEnter(){
		let temp = this._nceService.getBookList();
		for(let i = 0; i < temp.length; i++)
		{
			this._nce.book.push({ id: temp[i].id, title: temp[i].title});
			this._nce.lessionData.push({ id: [], title: [] })
			for(let j = 0; j < temp[i].lession.length; j++)
			{
				this._nce.lessionData[i].id.push(temp[i].lession[j].id);
				this._nce.lessionData[i].title.push(temp[i].lession[j].title);
			}
		}
		this._nce.bookSelect = this._nce.book[0].title;
		this._nce.lessionTitle = this._nce.lessionData[0].title;
	}

	private _createNCETask(){
		console.log(this._nce);
	}
}
