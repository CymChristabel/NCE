import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import { TaskCreatePage } from '../task-create/task-create';
 
import { TaskService } from '../../providers/task.service';

import * as c3 from 'c3';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-general',
  templateUrl: 'general.html'
})

export class GeneralPage {
	private _taskList;

	constructor(private _navCtrl: NavController, private _menu: MenuController, private _taskService: TaskService) {
  		this._taskList = this._taskService.get();
	}


  ionViewDidEnter() {
    this._menu.swipeEnable(true, 'left');
   var chart = c3.generate({
        data: {
            columns: [
                ['data', 91.4]
            ],
            type: 'gauge',
            // onclick: function (d, i) { console.log("onclick", d, i); },
            // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        gauge: {
           label: {
               format: function(value, ratio) {
                   return value;
               },
               show: true // to turn off the min/max labels.
           },
           min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
           max: 100, // 100 is default
           units: ' %',
           width: 50 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
    //            unit: 'value', // percentage is default
    //            max: 200, // 100 is default
                values: [30, 60, 90, 100]
            }
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
}
