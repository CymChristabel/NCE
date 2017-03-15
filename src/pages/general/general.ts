import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import { TaskSelectPage } from '../task-select/task-select';
 
import { TaskService } from '../../providers/task.service';

import * as c3 from 'c3';
import * as _ from 'lodash';
/*
  Generated class for the General page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-general',
  templateUrl: 'general.html'
})
export class GeneralPage {
	chart;
	private _taskList;
	constructor(private _navCtrl: NavController, private _menu: MenuController, private _taskService: TaskService) {
  		this._menu.swipeEnable(true, 'left');
  		this._taskList = this._taskService.get();
  	}


  ionViewDidEnter() {
   this.chart = c3.generate({
      data: {
        // iris data from R
        columns: [
          ['data1', 30],
          ['data2', 120],
        ],
        type: 'pie',
        onclick: (d, i) => { console.log("onclick", d, i); },
      }
    });
    setTimeout(()=> {
      this.chart.load({
        columns: [
          ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
          ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
          ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
        ]
      });
    }, 1500);
    setTimeout(()=> {
      this.chart.unload({
        ids: 'data1'
      });
      this.chart.unload({
        ids: 'data2'
      });
    }, 2500);
  }

  private _goTaskSelectPage(){
    this._navCtrl.push(TaskSelectPage);
  }
}
