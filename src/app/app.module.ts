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
import { RecitationResultPage } from '../pages/recitation/recitation-result/recitation-result';
//user related
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
//task manager related
import { GeneralPage } from '../pages/general/general';
import { TaskSelectPage } from '../pages/task-select/task-select';
import { TaskCreatePage } from '../pages/task-create/task-create';
//NCE related
import { NCEStudyTextPage, PopoverMenuPage } from '../pages/nce/nce-study/nce-study-text';
import { NCESelectPage } from '../pages/nce/nce-select/nce-select';
import { NCEOverallPage } from '../pages/nce/nce-overall/nce-overall';
import { NCEListPage } from '../pages/nce/nce-overall/nce-list';
import { NCEStudyMainPage } from '../pages/nce/nce-study/nce-study-main';
import { NCEStudyWordPage } from '../pages/nce/nce-study/nce-study-word';
//etc
import { WordModalPage } from '../pages/word-modal/word-modal';
import { FavoritePage } from '../pages/favorite/favorite';
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
    RecitationResultPage,
    LandingPage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    GeneralPage,
    PopoverMenuPage,
    TaskSelectPage,
    MainPage,
    NCEStudyTextPage,
    NCESelectPage,
    NCEOverallPage,
    NCEListPage,
    WordModalPage,
    FavoritePage,
    NCEStudyMainPage,
    NCEStudyTextPage,
    NCEStudyWordPage
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
    RecitationResultPage,
    LandingPage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    GeneralPage,
    NCEStudyTextPage,
    PopoverMenuPage,
    TaskSelectPage,
    MainPage,
    NCESelectPage,
    NCEOverallPage,
    NCEListPage,
    WordModalPage,
    FavoritePage,
    NCEStudyMainPage,
    NCEStudyTextPage,
    NCEStudyWordPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage,
    HttpService,
    StorageService
  ]
})
export class AppModule {}
