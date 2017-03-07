import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';

import { NCEService } from '../../../providers/nce.service';

import * as _ from 'lodash';

/*
  Generated class for the NCEStudy page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


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

	changeFontSize(direction) {
		this._textEle.style.fontSize = direction;
	}

	changeFontFamily() {
		if (this.fontFamily) 
		{
			this._textEle.style.fontFamily = this.fontFamily;
		}
	}
}


@Component({
	selector: 'page-nce-study',
	templateUrl: 'nce-study.html'
})

export class NCEStudyPage implements OnInit{
	@ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  	@ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  	private _lession;
  	private _showTranslation;

	constructor(private _navCtrl: NavController, private _navParams: NavParams, private _popoverCtrl: PopoverController, private _nceService: NCEService) {
		// this._lession = this._nceService.getBook(0, 0);
		this._lession.engText = _.split(this._lession.engText, '\n');
		this._lession.chnText = _.split(this._lession.chnText, '\n');
		this._lession.word = _.split(this._lession.word, '\n')
		this._showTranslation = false;

 	}

	ngOnInit(){

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

	private _switch(){
		this._showTranslation = !this._showTranslation;
	}

}