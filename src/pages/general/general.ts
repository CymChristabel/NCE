import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import { TaskCreatePage } from '../task-create/task-create';
import { NCEStudyMainPage } from '../nce/nce-study/nce-study-main';

import { TaskService } from '../../providers/task.service';
import { NCEService } from '../../providers/nce.service';

import * as c3 from 'c3';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-general',
  templateUrl: 'general.html'
})

export class GeneralPage {
	private _taskList;

	constructor(private _navCtrl: NavController, private _menu: MenuController, private _taskService: TaskService, private _nceService: NCEService) {
  		this._taskList = this._taskService.get();
	}


  ionViewDidEnter() {
    this._menu.swipeEnable(true, 'left');
    let numerator = 0, denominator = 0;
    for(let i = 0; i < this._taskList.recitationTask.length; i++)
    {
      numerator = numerator + this._taskList.recitationTask[i].current;
      denominator = denominator + this._taskList.recitationTask[i].goal;
    }
    let temp = denominator / 2;
    for(let i = 0; i < this._taskList.nceTask.length; i++)
    {
      denominator = denominator + temp;
      if(this._taskList.nceTask[i].dailyFinished)
      {
        numerator = numerator + temp;
      }
    }
    let result = (numerator * 100 / denominator).toFixed(1);
    var chart = c3.generate({
        data: {
            columns: [
                ['data', result]
            ],
            type: 'gauge'
        },
        gauge: {
           label: {
               format: function(value, ratio) {
                   return value;
               },
               show: true
           },
           min: 0,
           max: 100,
           units: ' %',
           width: 50
        },
        size: {
          height: 120
        },
        tooltip: {
          show: true
        }
    });

  }

  private _goTaskCreatePage(){
    this._navCtrl.push(TaskCreatePage);
  }

  private _goNCEStudyPage(item: any){
    this._navCtrl.push(NCEStudyMainPage, { bookID: item.bookID, lession: this._nceService.getLession(item.bookID, item.lessionID) });
  }

  private _deleteNCETask(bookID: number){
    for(let i = 0; i < this._taskList.nceTask.length; i++)
    {
      if(this._taskList.nceTask[i].bookID == bookID)
      {
        this._taskList = this._taskService.deleteNCETask(i);
        break;
      }
    }
  }

  private _deleteRecitationTask(vocabularyID: number){
    for(let i = 0; i < this._taskList.recitationTask.length; i++)
    {
      if(this._taskList.recitationTask[i].vocabularyID == vocabularyID)
      {
        this._taskService.deleteRecitationTask(i);
        break;
      }
    }
  }
}
