import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CommunityPostListPage } from '../community-post-list/community-post-list';

@Component({
  selector: 'page-community-entry',
  templateUrl: 'community-entry.html'
})
export class CommunityEntryPage {


// selectedItem: any;
// icons: string[];
	private _communityList: Array<{ name: string, description: string, topic: number }>;

	constructor(private _navCtrl: NavController) {
		this._communityList = [];
		this._communityList.push(
			{ name: 'dummy 1', description: 'This is a dummy topic', topic: 100 },
			{ name: 'dummy 2', description: 'This is a dummy dummy topic', topic: 200 },
			{ name: 'dummy 1', description: '这是一个假的主题', topic: 10000 }
		);
	}

	private _doRefresh(refresher){
		console.log('Begin async operation', refresher);

	    setTimeout(() => {
	      console.log('Async operation has ended');
	      refresher.complete();
	    }, 2000);
	}
	
	private _goPostList(community: Object){
		this._navCtrl.push(CommunityPostListPage, { 'community': community });
	}

}
