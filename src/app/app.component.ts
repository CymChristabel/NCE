import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';

import { RecitationVocabularyOverallPage } from '../pages/recitation/recitation-vocabulary-overall/recitation-vocabulary-overall';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { CommunityEntryPage } from '../pages/community/community-entry/community-entry';

import { GeneralPage } from '../pages/general/general';
import { SelectPage } from '../pages/select/select';

import { NCEStudyPage } from '../pages/nce-study/nce-study';

import { TaskService } from '../providers/task.service';
import { RecitationService } from '../providers/recitation.service';
import { NCEService } from '../providers/nce.service';
import { UserService } from '../providers/user.service';
import { StorageService } from '../providers/storage.service';


@Component({
  templateUrl: 'app.html',
  providers: [ StorageService, RecitationService, NCEService, UserService, TaskService ]
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
    private _taskService: TaskService
  ) {
    this._storageService.get('isFirst').then(
      isFirst => {
        if(isFirst == undefined)
        {
          this._storageService.set('isFirst', true);
          this.rootPage = LandingPage;
        }
        else
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
                  this.rootPage = GeneralPage;
                }
              }, err => console.log(err));
          }
        }
      }, err => console.log(err));
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Recitation', component: RecitationVocabularyOverallPage },
      { title: 'landing', component: LandingPage },
      { title: 'login', component: LoginPage },
      { title: 'register', component: RegisterPage },
      { title: 'community', component: CommunityEntryPage },
      { title: 'task', component: GeneralPage },
      { title: 'NCE', component: NCEStudyPage },
      { title: 'select', component: SelectPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      Network.onConnect().subscribe(
        () => {
          let toast = this._toastCtrl.create({
            message: 'network connected',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
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
}
