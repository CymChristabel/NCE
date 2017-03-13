import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';

import * as _ from 'lodash';

@Component({
  templateUrl: 'word-modal.html'
})

export class WordModalPage{
	private _word;
	private _favorite;
	private _favoriteChanged;
	constructor(private _platform: Platform, private _navParams: NavParams, private _viewCtrl: ViewController){
		this._word = this._navParams.get('word');
		this._favoriteChanged = false;
		//deal with explainnation
		let temp = _.words(this._word.explainnation);
		let mark = -1;
		if(Array.isArray(this._word.example) == false)
		{
			for(let i = 0; i < temp.length; i++)
				{
					if(temp[i][0].toLowerCase() >= 'a' && temp[i][0].toLowerCase() <= 'z')
					{
						mark = i;
						temp[i] = temp[i] + '.';
					}
					else
					{
						temp[mark] = temp[mark] + ' ' + temp[i];
					}
				}
				//remove Chinese item
				_.remove(temp, (value) => {
					return !(value[0].toLowerCase() >= 'a' && value[0].toLowerCase() <= 'z');
				});
				this._word.explainnation = temp;
				
				//deal with example
				temp  =  _.split(this._word.example, '\n');
				this._word.example = [];
				for(let i = 0; i < temp.length; i = i + 2)
				{
					this._word.example.push({engText: temp[i], chnText: temp[i + 1]});
				}
		}

		this._navParams.get('recitationService')
						.getFavoriteList()
						.then(favoriteList => {
							console.log(favoriteList);
							if(_.find(favoriteList, { vocabularyID: this._navParams.get('vocabularyID'), wordID: this._word.id}))
							{
								this._favorite = true;
							}
							else
							{
								this._favorite = false;
							}
						}, err => console.log(err));
	}

	private _dismiss(){
		if(this._favoriteChanged)
		{
			this._navParams.get('recitationService').changeFavorite(this._navParams.get('vocabularyID'), this._word.id, this._word.name, this._favorite);
		}
		this._viewCtrl.dismiss();
	}

	private _changeFavorite(){
		this._favorite = !this._favorite;
		this._favoriteChanged = true;
	}
}