import { Component } from '@angular/core';

import { GeneralPage } from '../general/general';
import { StatisticsPage } from '../statistics/statistics';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})

export class MainPage {
	private _generalPage;
	private _statisticsPage;
	private _settingPage;
	constructor() {
		this._generalPage = GeneralPage;
		this._statisticsPage = StatisticsPage;
		this._settingPage = SettingPage;
	}

}
