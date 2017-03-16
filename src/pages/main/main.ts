import { Component } from '@angular/core';

import { GeneralPage } from '../general/general';
import { StatisticsPage } from '../statistics/statistics';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})

export class MainPage {
	private _generalPage;
	private _statisticsPage;
	constructor() {
		this._generalPage = GeneralPage;
		this._statisticsPage = StatisticsPage;
	}

}
