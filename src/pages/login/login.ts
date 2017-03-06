import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { RegisterPage } from '../register/register';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { GeneralPage } from '../general/general';

import { UserService } from '../../providers/user.service';
import { StorageService } from '../../providers/storage.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  private _loginForm: FormGroup;

  constructor(private _navCtrl: NavController, private _userService: UserService, private _storageService: StorageService, private _toastCtrl: ToastController, private _formBuilder: FormBuilder) {
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

  private _goForgetPasswordPage(){
  	this._navCtrl.push(ForgetPasswordPage);
  }

  private _goGeneralPage(){
    this._navCtrl.setRoot(GeneralPage);
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
        data => {
          this._userService.updateUser(data);
          this._goGeneralPage();
        },
        err => {
          this._generateToast(JSON.parse(err._body).message).present();
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

}
