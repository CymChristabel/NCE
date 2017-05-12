import { NgModule, ErrorHandler, Provider } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { MainPage } from '../pages/main/main';
import { SettingPage } from '../pages/setting/setting';
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
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ChangeUserDetailPage } from '../pages/change-user-detail/change-user-detail';
import { EmailPage } from '../pages/forget-password/email-page/email-page';
import { ResetPage } from '../pages/forget-password/reset-page/reset-page';
//friend related
import { FriendPage } from '../pages/friend/friend';
import { AddFriendPage } from '../pages/add-friend/add-friend';
import { FriendComparePage } from '../pages/friend-compare/friend-compare';
//task manager and statistics related
import { GeneralPage } from '../pages/general/general';
import { TaskCreatePage } from '../pages/task-create/task-create';
import { StatisticsPage } from '../pages/statistics/statistics';
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
import { WordSearchPage } from '../pages/word-search/word-search';
import { WordCrawledPage } from '../pages/word-crawled/word-crawled';
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
    ChangePasswordPage,
    ChangeUserDetailPage,
    EmailPage,
    ResetPage,

    GeneralPage,
    MainPage,
    StatisticsPage,
    TaskCreatePage,

    FriendPage,
    AddFriendPage,
    FriendComparePage,

    NCEStudyTextPage,
    NCESelectPage,
    NCEOverallPage,
    NCEListPage,
    NCEStudyMainPage,
    NCEStudyTextPage,
    NCEStudyWordPage,
    PopoverMenuPage,

    WordModalPage,
    WordSearchPage,
    WordCrawledPage,
    FavoritePage,

    SettingPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
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
    ChangePasswordPage,
    ChangeUserDetailPage,
    EmailPage,
    ResetPage,
      
    GeneralPage,
    MainPage,
    StatisticsPage,
    TaskCreatePage,

    FriendPage,
    AddFriendPage,
    FriendComparePage,

    NCEStudyTextPage,
    NCESelectPage,
    NCEOverallPage,
    NCEListPage,
    NCEStudyMainPage,
    NCEStudyTextPage,
    NCEStudyWordPage,
    PopoverMenuPage,

    WordModalPage,
    WordSearchPage,
    WordCrawledPage,
    FavoritePage,

    SettingPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpService,
    StorageService
  ]
})
export class AppModule {}
