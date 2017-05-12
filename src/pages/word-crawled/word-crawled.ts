import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-word-crawled',
  templateUrl: 'word-crawled.html'
})
export class WordCrawledPage {
	@ViewChild('word_audio', { read: ElementRef }) wordAudioCtrl: ElementRef;
	@ViewChild('sentence_audio', { read: ElementRef }) sentenceAudioCtrl: ElementRef;
	private _word;
	constructor(private _navCtrl: NavController, private _navParams: NavParams) {
		this._word = this._navParams.get('word');
		console.log(this._word);
	}

	private _sentenceAudioPlay(audioPath: string){
		this.sentenceAudioCtrl.nativeElement.src = audioPath;
		this.sentenceAudioCtrl.nativeElement.play();
	}

}
