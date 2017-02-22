import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { RegisterPage } from '../register/register';
import { ForgetPasswordPage } from '../forget-password/forget-password';

import { UserService } from '../../providers/user.service';
import { StorageService } from '../../providers/storage.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ UserService ]
})

export class LoginPage {

  constructor(private _navCtrl: NavController, private _userService: UserService, private _storageService: StorageService) {

  }

  private _goRegisterPage(){
  	this._navCtrl.push(RegisterPage);
  }

  private _goForgetPasswordPage(){
  	this._navCtrl.push(ForgetPasswordPage);
  }

  private _onSubmit(form: NgForm){

    this._userService.login(form.value).subscribe(
      data => {
        this._userService.updateUser(data);
      },
      err => console.log(err));
  }

}
