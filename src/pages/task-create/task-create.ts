import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TaskService } from '../../providers/task.service';
import { NCEService } from '../../providers/nce.service';
import { RecitationService } from '../../providers/recitation.service';

import * as moment from 'moment';

@Component({
	selector: 'page-task-create',
	templateUrl: 'task-create.html'
})
export class TaskCreatePage {
	private _select;
	private _nce;
	private _recitation;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _taskService: TaskService, private _nceService: NCEService, private _recitationService: RecitationService) {
		this._select = 'NCE';
		this._nce = { book: [], lessionData: [], lession: [], bookSelect: true, lessionSelect: true };
		this._recitation = { vocabulary: [], vocabularySelect: true, goalRange: 50 };
		
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
		this._nce.lession = { id: this._nce.lessionData[0].id, title: this._nce.lessionData[0].title };
		this._nce.lessionSelect = this._nce.lession.title[0];
		console.log(this._nce);
		this._recitation.vocabulary = this._recitationService.getVocabularyList();
		this._recitation.vocabularySelect = this._recitation.vocabulary[0].title;
	}

	private _changeNCEBook(){
		for(let i = 0; i < this._nce.book.length; i++)
		{
			if(this._nce.book[i].title == this._nce.bookSelect)
			{
				this._nce.lession = this._nce.lessionData[i];
				this._nce.lessionSelect = this._nce.lession.title[0];
				break;
			}
		}
	}

	private _createNCETask(){
		let bookID, lessionID;
		for(let i = 0; i < this._nce.book.length; i++)
		{
			if(this._nce.book[i].title == this._nce.bookSelect)
			{
				bookID = this._nce.book[i].id;
				break;
			}
		}
		for(let i = 0; i < this._nce.lession.title.length; i++)
		{
			if(this._nce.lession.title[i] == this._nce.lessionSelect)
			{
				lessionID = this._nce.lession.id[i];
				break;
			}
		}
		this._taskService.createNCETask(bookID, lessionID, this._nce.bookSelect, this._nce.lessionSelect);
		this._navCtrl.pop();
	}

	private _createRecitationTask(){
		let vocabularyID;
		for(let i = 0; i < this._recitation.vocabulary.length; i++)
		{
			if(this._recitation.vocabulary[i].title == this._recitation.vocabularySelect)
			{
				vocabularyID = this._recitation.vocabulary[i].id;
				break;
			}
		}
		this._taskService.createRecitationTask(vocabularyID, this._recitation.vocabularySelect, this._recitation.goalRange);
		this._navCtrl.pop();
	}
}
