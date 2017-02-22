import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RecitationVocabularyOverallPage } from '../recitation-vocabulary-overall/recitation-vocabulary-overall';

import { RecitationService } from '../../../providers/recitation.service';

import { Vocabulary } from '../../../interfaces/vocabulary.interface';

@Component({
  selector: 'page-recitation-select',
  templateUrl: 'recitation-select.html',
  providers: [RecitationService]
})

export class RecitationSelectPage implements OnInit{
	private _vocabulary: Vocabulary;

  	constructor(private _navCtrl: NavController, private _recitationService: RecitationService) {

  	}

  	ngOnInit(){
  		this._recitationService.getVocabularyList().subscribe(
  			data => {
  				this._vocabulary = data; 
  			}, error => console.log(error)
  		);
  	}

  private _doRefresh(refresher){
    console.log('Begin async operation', refresher);

      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
  }

	private _goVocabularyOverall(vocabulary: Object){
		this._navCtrl.push(RecitationVocabularyOverallPage, { 
			vocabulary: vocabulary
		});
	}
}
