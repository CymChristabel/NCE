import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as moment from 'moment';

@Component({
	selector: 'page-community-post-list',
	templateUrl: 'community-post-list.html'
})

export class CommunityPostListPage {
	private _community: { name: string, description: string, topic: number };
	private _post: Array<{ username: string, avatar: string, postName: string, detail: string, img: string, like: number, commentNum: number, createdAt: string, dateDiff: string }>;

	constructor(private _navCtrl: NavController, private _navParam: NavParams) {
		this._community = this._navParam.get('community');
		this._post = [];
		this._post.push(
			{ username: 'Kuon', avatar: 'img/temp-avatar.jpg', postName: '岁月使皮肤起皱，放弃使灵魂起皱。', detail: '词霸小编：笑一笑，十年少。来个笑话乐呵乐呵：2012年，李开复受邀在牛津大学毕业典礼讲', img: null, like: 0, commentNum: 11, createdAt: '2017-01-15 21:19:48', dateDiff: null },
			{ username: 'Kuon', avatar: 'img/temp-avatar.jpg', postName: '理想就像内裤，虽然你有，但是你不能逢人就证明你有。', detail: '古人云：“人无志，非人也。”一个人假若没有理想,是不可能有所作为的。话虽如此小编相信还是有很多人现在还没制定自己的理想呢……', img: 'img/advance-card-bttf.png', like: 10, commentNum: 111, createdAt: '2016-12-26 11:19:48', dateDiff: null }
		);

		for(let i = 0; i < this._post.length; i++)
		{
			this._post[i].dateDiff = moment(this._post[i].createdAt).toNow().substr(3);
		}

	}	

	private _doRefresh(refresher){
		console.log('Begin async operation', refresher);

	    setTimeout(() => {
	      console.log('Async operation has ended');
	      refresher.complete();
	    }, 2000);
	}

}
