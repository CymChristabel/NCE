import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';
import { EmailPage } from '../forget-password/email-page/email-page';

import { StatisticsService } from '../../providers/statistics.service';
import { RecitationService } from '../../providers/recitation.service';
import { NCEService } from '../../providers/nce.service';
import { UserService } from '../../providers/user.service';
import { TaskService } from '../../providers/task.service';

import * as async from 'async';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  private _loginForm: FormGroup;

  constructor(private _navCtrl: NavController, private _menuCtrl: MenuController, private _loadingCtrl: LoadingController, private _taskService: TaskService, private _userService: UserService, private _recitationService: RecitationService, private _nceService: NCEService, private _statisticsService: StatisticsService, private _toastCtrl: ToastController, private _formBuilder: FormBuilder) {
    this._menuCtrl.swipeEnable(false);
    this._loginForm = this._formBuilder.group({
        'email': new FormControl('test@qq.com', Validators.compose([Validators.required, this._mailFormat])),
        'password': new FormControl('nimazhale',Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])),
      });
  }

  private _mailFormat(c: AbstractControl){
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
        return { "incorrectMailFormat": true };
    }

    return null;
  }

  private _goRegisterPage(){
  	this._navCtrl.push(RegisterPage);
  }

  private _generateToast(message: string){
    return this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'buttom'
    });
  }

  private _onSubmit(form: FormGroup){

    if(form.valid)
    {
      this._userService.login(form.value).subscribe(
        result => {
            let loading = this._loadingCtrl.create({
              content: 'synchronizing...'
            });
            loading.present();
            async.series([
               (callback) => {
                 this._taskService.synchronizeData(callback);
               },
               (callback) => {
                 this._statisticsService.synchronizeData(callback);
               },
               (callback) => {
                 this._recitationService.synchronizeData(callback);
               },
               (callback) => {
                 this._nceService.synchronizeData(callback);
               }], (err, ok) => {
                  loading.dismiss();
                  this._navCtrl.setRoot(MainPage);
            });
        }, err => {
          console.log(err);
          this._generateToast(err.json().message).present();
        });
    }
    else
    {
      if(form.get('email').valid == false)
      {
        this._generateToast('invalid email input').present();
      }
      else
      {
        this._generateToast('password should between 8 and 16 characters').present();
      }
    }
  }

  private _goEmailPage(){
    this._navCtrl.push(EmailPage);
  }
}
