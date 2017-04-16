import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, ToastController, Platform } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';

import { NCEService } from '../../../providers/nce.service';

import * as _ from 'lodash';


@Component({
	selector: 'page-popover', templateUrl: 'popover-menu-page.html'
})
export class PopoverMenuPage {
	private _background: string;
	private _contentEle: any;
	private _textEle: any;
	public fontFamily;

	private _colors = {
		'white': {
		  'bg': 'rgb(255, 255, 255)',
		  'fg': 'rgb(0, 0, 0)'
		},
		'tan': {
		  'bg': 'rgb(249, 241, 228)',
		  'fg': 'rgb(0, 0, 0)'
		},
		'grey': {
		  'bg': 'rgb(76, 75, 80)',
		  'fg': 'rgb(255, 255, 255)'
		},
		'black': {
		  'bg': 'rgb(0, 0, 0)',
		  'fg': 'rgb(255, 255, 255)'
		},
	};

	constructor(private _navParams: NavParams) {

	}

  	ngOnInit() {
	    if (this._navParams.data) {
	      this._contentEle = this._navParams.data.contentEle;
	      this._textEle = this._navParams.data.textEle;

	      this._background = this.getColorName(this._contentEle.style.backgroundColor);
	      this.setFontFamily();
	    }

  	}

	getColorName(background) {
		let colorName = 'white';

		if (!background) return 'white';

		for (let key in this._colors) 
		{
			if (this._colors[key].bg == background) 
			{
				colorName = key;
			}
		}

		return colorName;
	}

	setFontFamily() {
		if (this._textEle.style.fontFamily) 
		{
			this.fontFamily = this._textEle.style.fontFamily.replace(/'/g, "");
		}
	}

	changeBackground(color) {
		this._background = color;
		this._contentEle.style.backgroundColor = this._colors[color].bg;
		this._textEle.style.color = this._colors[color].fg;
	}

	changeFontSize(fontSize) {
		this._textEle.style.fontSize = fontSize;
	}

	changeFontFamily() {
		if (this.fontFamily) 
		{
			this._textEle.style.fontFamily = this.fontFamily;
		}
	}
}


@Component({
	selector: 'page-nce-study-text',
	templateUrl: 'nce-study-text.html'
})

export class NCEStudyTextPage implements OnInit{
	@ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  	@ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  	@ViewChild('textAudio', { read: ElementRef }) audioCtrl: ElementRef;
  	@Input() audioTime = '0';

  	private _lession;
  	private _showTranslation;
  	private _favorite;
  	private _lock;
  	private _favoriteID;
  	private _audioPath;
	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _platform: Platform, private _toastCtrl: ToastController, private _popoverCtrl: PopoverController, private _nceService: NCEService) {
		this._lession = this._navParams.get('lession');
		this._audioPath = this._nceService.getAudioPath(this._lession.audio);
		this._lession.engText = _.split(this._lession.engText, '\n');
		this._lession.chnText = _.split(this._lession.chnText, '\n');
		this._lock = false;

		this._nceService.getFavoriteList()
						.then(
							favoriteList => {
								if(_.find(favoriteList, { bookID: this._navParams.get('bookID'), lessionID: this._lession.id }))
								{
									this._favoriteID = _.find(favoriteList, { bookID: this._navParams.get('bookID'), lessionID: this._lession.id }).id;
									this._favorite = true;
								}
								else
								{
									this._favorite = false;
								}
							}, err => console.log(err));

		this._showTranslation = false;

 	}

	ngOnInit(){
		this.text.nativeElement.style.fontSize = 'medium';
		this.audioCtrl.nativeElement.addEventListener('timeupdate', () => {
			this.audioTime = ((this.audioCtrl.nativeElement.currentTime / this.audioCtrl.nativeElement.duration) * 100).toFixed(1);
		}, false);
	}

	private _presentPopover(myEvent){
	    let popover = this._popoverCtrl.create(PopoverMenuPage, {
			contentEle: this.content.nativeElement,
			textEle: this.text.nativeElement
		});

		popover.present({
			ev: myEvent
		});
	}

	private _decreaseAudioSpeed(){
		if(this.audioCtrl.nativeElement.playbackRate == 0.5)
		{
			let toast = this._toastCtrl.create({
				message: 'Already minimum speed',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return;
		}
		this.audioCtrl.nativeElement.playbackRate = this.audioCtrl.nativeElement.playbackRate - 0.5;
	}

	private _increaseAudioSpeed(){
		if(this.audioCtrl.nativeElement.playbackRate == 1.5)
		{
			let toast = this._toastCtrl.create({
				message: 'Already maximun speed',
				duration: 1500,
				position: 'bottom'
			});
			toast.present();
			return;
		}
		this.audioCtrl.nativeElement.playbackRate = this.audioCtrl.nativeElement.playbackRate + 0.5;
	}

	private _clickAudioProgress(e){
		let rate = e.offsetX / this._platform.width();
		this.audioCtrl.nativeElement.currentTime = this.audioCtrl.nativeElement.duration * rate;
	}

	private _audioFastForward(){
		if(this.audioCtrl.nativeElement.currentTime + 5 < this.audioCtrl.nativeElement.duration)
		{
			this.audioCtrl.nativeElement.currentTime = this.audioCtrl.nativeElement.currentTime + 5;
		}
		else
		{
			this.audioCtrl.nativeElement.currentTime = this.audioCtrl.nativeElement.duration;
		}
	}

	private _audioRewind(){
		if(this.audioCtrl.nativeElement.currentTime - 5 > 0)
		{
			this.audioCtrl.nativeElement.currentTime = this.audioCtrl.nativeElement.currentTime - 5;
		}
		else
		{
			this.audioCtrl.nativeElement.currentTime = 0;
		}
	}

	private _switch(){
		this._showTranslation = !this._showTranslation;
	}

	private _addFavorite(){
		if(this._lock == false)
		{
			this._lock = true;
			this._nceService.addFavorite(this._navParams.get('bookID'), this._lession.id, this._lession.title)
							.subscribe(
								id => {
									this._lock = false;
									this._favorite = !this._favorite;
									this._favoriteID = id;
								});
		}
	}

	private _removeFavorite(){
		if(this._lock == false)
		{
			this._lock = true;
			this._nceService.removeFavorite(this._navParams.get('bookID'), this._lession.id, this._favoriteID)
							.then(
								result => {
									this._lock = false;
									this._favorite = !this._favorite;
								});
		}
	}
}
