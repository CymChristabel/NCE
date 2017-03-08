import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController} from 'ionic-angular';

import { RecitationSlidePage } from '../recitation-slide/recitation-slide';
import { RecitationResultPage } from '../recitation-result/recitation-result';

import * as _ from 'lodash';

@Component({
	selector: 'page-recitation-test',
	templateUrl: 'recitation-test.html'
})

export class RecitationTestPage{
	private _wordList;
	private _problem;
	private _currentProblem;

	constructor(private _navCtrl: NavController, private _navParam: NavParams, private _toastCtrl: ToastController){
		this._wordList = this._navParam.get('wordList');
		this._currentProblem = 0;

		for(let i = 0; i < this._wordList.length * this._wordList.length; i++)
		{
			let randomNum_1 = Math.floor(Math.random() * this._wordList.length);
			let randomNum_2 = Math.floor(Math.random() * this._wordList.length);
			[this._wordList[randomNum_1], this._wordList[randomNum_2]] = [this._wordList[randomNum_2], this._wordList[randomNum_1]];
		}
		this._generateProblem();
	}

	private _generateProblem(){
		this._problem = {
			name: this._wordList[this._currentProblem].name,
			set: []
		};

		this._problem.set.push({
			explainnation: this._wordList[this._currentProblem].explainnation[Math.floor(Math.random() * this._wordList[this._currentProblem].explainnation.length)],
			isTrue: true
		});

		for(let i = 1; i <= 3; i++)
		{
			this._problem.set.push({
				explainnation: this._wordList[(this._currentProblem + i) % this._wordList.length].explainnation[0],
				isTrue: false
			})
		}

		for(let i = 0; i < this._problem.set.length * this._problem.set.length; i++)
		{
			let randomNum_1 = Math.floor(Math.random() * this._problem.set.length);
			let randomNum_2 = Math.floor(Math.random() * this._problem.set.length);
			[this._problem.set[randomNum_1], this._problem.set[randomNum_2]] = [this._problem.set[randomNum_2], this._problem.set[randomNum_1]];
		}
	}

	private _onAnswerClick(isTrue: boolean){
		if(isTrue)
		{
			if(_.has(this._wordList[this._currentProblem], 'correct') == false)
			{
				this._wordList[this._currentProblem].correct = true;	
			}
			this._currentProblem = this._currentProblem + 1;
			//go to next question
			if(this._currentProblem != this._wordList.length) 
			{
				this._generateProblem();
			}
			//go to next list
			else
			{
				this._navCtrl.pop();
				this._navCtrl.push(RecitationResultPage, { wordList: this._wordList, id: this._navParam.get('id'), type: this._navParam.get('type') });
				// if(this._navParam.get('type') == 'NCE')
				// {

				// }
				// else
				// {
				// 	this._recitationService.updateProgress(this._navParam.get('id'), this._wordList.length);
				// }
			}
		}
		else
		{
			this._wordList[this._currentProblem].correct = false;
			let toast = this._toastCtrl.create({
				message: 'incorrect',
				duration: 1500,
				position: 'bottom'
			});
			
			toast.present();
		}
	}
}