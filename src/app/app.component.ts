import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';

import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RecitationSelectPage } from '../pages/recitation/recitation-select/recitation-select';

import { MainPage } from '../pages/main/main';

import { FavoritePage } from '../pages/favorite/favorite';

import { NCESelectPage } from '../pages/nce/nce-select/nce-select';

import { WordSearchPage } from '../pages/word-search/word-search';

import { TaskService } from '../providers/task.service';
import { RecitationService } from '../providers/recitation.service';
import { NCEService } from '../providers/nce.service';
import { UserService } from '../providers/user.service';
import { StorageService } from '../providers/storage.service';
import { StatisticsService } from '../providers/statistics.service';
import { FriendService } from '../providers/friend.service';
import * as async from 'async';

declare var cordova:any;

@Component({
  templateUrl: 'app.html',
  providers: [ StorageService, RecitationService, NCEService, UserService, TaskService, StatisticsService, FriendService ]
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
    private _loadingCtrl: LoadingController,
    private _storageService: StorageService,
    private _userService: UserService,
    private _recitationService: RecitationService,
    private _nceService: NCEService,
    private _taskService: TaskService,
    private _statisticsService: StatisticsService,
    private _friendService: FriendService
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
                  let loading = this._loadingCtrl.create({
                    content: 'synchronizing...'
                  });
                  loading.present();
                  async.series([
                     (callback) => {
                       this._userService.synchronizeData(callback);
                     },
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
                        this.rootPage = MainPage;
                     });
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
      { title: 'General', component: MainPage },
      { title: 'NCE', component: NCESelectPage },
      { title: 'favorite', component: FavoritePage },
      { title: 'word search', component: WordSearchPage }
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
