import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RecitationVocabularyOverallPage } from '../recitation-vocabulary-overall/recitation-vocabulary-overall';

import { RecitationService } from '../../../providers/recitation.service';

@Component({
  selector: 'page-recitation-select',
  templateUrl: 'recitation-select.html'
})

export class RecitationSelectPage implements OnInit{
	private _vocabulary;

  	constructor(private _navCtrl: NavController, private _recitationService: RecitationService) {

  	}

  	ngOnInit(){
      this._vocabulary = this._recitationService.getVocabularyList();
  	}

  private _doRefresh(refresher){
    console.log('Begin async operation', refresher);

      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
  }

	private _goVocabularyOverall(id: number){
		this._navCtrl.push(RecitationVocabularyOverallPage, { 
			id: id
		});
	}
}
