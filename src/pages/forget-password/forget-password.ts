import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-forget-password',
  	templateUrl: 'forget-password.html'
})

export class ForgetPasswordPage{
	constructor(private _navCtrl: NavController){
		
	}

	private _onSubmit(form: NgForm){
		console.log(form.value);
	}
}