import { NgModule, ErrorHandler, Provider } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

//recitation related
import { RecitationSelectPage } from '../pages/recitation/recitation-select/recitation-select';
import { RecitationVocabularyOverallPage } from '../pages/recitation/recitation-vocabulary-overall/recitation-vocabulary-overall';
import { RecitationSlidePage } from '../pages/recitation/recitation-slide/recitation-slide';
import { RecitationSummaryPage } from '../pages/recitation/recitation-summary/recitation-summary';
import { RecitationTestPage } from '../pages/recitation/recitation-test/recitation-test';
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
    LandingPage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    CommunityEntryPage,
    CommunityPostListPage,
    GeneralPage
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
    LandingPage,
    LoginPage,
    RegisterPage,
    ForgetPasswordPage,
    CommunityEntryPage,
    CommunityPostListPage,
    GeneralPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage,
    HttpService,
    StorageService
  ]
})
export class AppModule {}

    // provide(AuthHttp, {
    //   useFactory: (http) => {
    //     return new AuthHttp(new AuthConfig, http);
    //   },
    //   deps: [Http]
    // })