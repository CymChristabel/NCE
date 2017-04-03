import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';

import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RecitationSelectPage } from '../pages/recitation/recitation-select/recitation-select';

import { MainPage } from '../pages/main/main';

import { GeneralPage } from '../pages/general/general';
import { TaskSelectPage } from '../pages/task-select/task-select';

import { FavoritePage } from '../pages/favorite/favorite';

import { NCESelectPage } from '../pages/nce/nce-select/nce-select';

import { TaskService } from '../providers/task.service';
import { RecitationService } from '../providers/recitation.service';
import { NCEService } from '../providers/nce.service';
import { UserService } from '../providers/user.service';
import { StorageService } from '../providers/storage.service';
import { FileService } from '../providers/file.service';
import { StatisticsService } from '../providers/statistics.service';

declare var cordova:any;

@Component({
  templateUrl: 'app.html',
  providers: [ StorageService, RecitationService, NCEService, UserService, TaskService, FileService, StatisticsService ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    private _toastCtrl: ToastController,
    private _storageService: StorageService,
    private _userService: UserService,
    private _RecitationService: RecitationService,
    private _nceService: NCEService,
    private _taskService: TaskService,
    private _fileService: FileService,
    private _statisticService: StatisticsService
  ) {
    this._storageService.get('isFirst').then(
      isFirst => {
        if(isFirst)
        {
          if(this._userService.getUser() == undefined)
          {
            this.rootPage = LoginPage;
          }
          else
          {
            this._userService.testAuth().subscribe(
              res => {
                if(res.code == "E_UNAUTHORIZED")
                {
                  this.rootPage = LoginPage;
                }
                else
                {
                  this.rootPage = MainPage;
                  // this._statisticService.synchronizeData();
                }
              }, err => {
                this._generateToast('network error').present();  
                this.rootPage = MainPage;
              });
          }
        }
        else
        {
          this._storageService.set('isFirst', true);
          this.rootPage = LandingPage;
        }
      }, err => console.log(err));
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Recitation', component: RecitationSelectPage },
      { title: 'landing', component: LandingPage },
      { title: 'login', component: LoginPage },
      { title: 'register', component: RegisterPage },
      { title: 'task', component: GeneralPage },
      { title: 'NCE', component: NCESelectPage },
      { title: 'select', component: TaskSelectPage },
      { title: 'favorite', component: FavoritePage }
    ];
  }

  initializeApp() {
    console.log('nimazhale');
    this.platform.ready().then(() => {
      //check network
      Network.onConnect().subscribe(
        () => {
          this._generateToast('connection establish').present();
      });
      
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  private _generateToast(message: string){
    return this._toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });
  }
}
