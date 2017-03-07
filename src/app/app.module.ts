import { NgModule, ErrorHandler, Provider } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { MainPage } from '../pages/main/main';

//recitation related
import { RecitationSelectPage } from '../pages/recitation/recitation-select/recitation-select';
import { RecitationVocabularyOverallPage } from '../pages/recitation/recitation-vocabulary-overall/recitation-vocabulary-overall';
import { RecitationSlidePage } from '../pages/recitation/recitation-slide/recitation-slide';
import { RecitationSummaryPage } from '../pages/recitation/recitation-summary/recitation-summary';
import { RecitationTestPage } from '../pages/recitation/recitation-test/recitation-test';
import { RecitationModalPage } from '../pages/recitation/recitation-vocabulary-overall/modal';
//user related
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
//community related
import { CommunityEntryPage } from '../pages/community/community-entry/community-entry';
import { CommunityPostListPage } from '../pages/community/community-post-list/community-post-list';
//task manager related
import { GeneralPage } from '../pages/general/general';
import { SelectPage } from '../pages/select/select';
import { SelectDetailPage } from '../pages/select-detail/select-detail';
import { ModalContentPage } from '../pages/select-detail/modal-content';
//NCE related
import { NCEStudyPage, PopoverMenuPage } from '../pages/nce/nce-study/nce-study';
import { NCESelectPage } from '../pages/nce/nce-select/nce-select';
import { NCEOverallPage } from '../pages/nce/nce-overall/nce-overall';
import { NCEModalPage } from '../pages/nce/nce-overall/modal';
//service related
import { HttpService } from '../providers/http.service';
import { StorageService } from '../providers/storage.service';

@NgModule({
  declarations: [
    MyApp,
    RecitationSelectPage,
    RecitationVocabularyOverallPage,
    RecitationSlidePage,
    RecitationSummaryPage,
    RecitationTestPage,
    RecitationModalPage,
    LandingPage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    CommunityEntryPage,
    CommunityPostListPage,
    GeneralPage,
    PopoverMenuPage,
    SelectPage,
    SelectDetailPage,
    ModalContentPage,
    MainPage,
    NCEStudyPage,
    NCESelectPage,
    NCEOverallPage,
    NCEModalPage,

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecitationSelectPage,
    RecitationVocabularyOverallPage,
    RecitationSlidePage,
    RecitationSummaryPage,
    RecitationTestPage,
    RecitationModalPage,
    LandingPage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    CommunityEntryPage,
    CommunityPostListPage,
    GeneralPage,
    NCEStudyPage,
    PopoverMenuPage,
    SelectPage,
    SelectDetailPage,
    ModalContentPage,
    MainPage,
    NCESelectPage,
    NCEOverallPage,
    NCEModalPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage,
    HttpService,
    StorageService
  ]
})
export class AppModule {}
