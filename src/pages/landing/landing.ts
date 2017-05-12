import { Component } from '@angular/core';
import { NavController, MenuController } from "ionic-angular";

import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-landing',
    templateUrl: 'landing.html'
})


export class LandingPage {

    constructor(private _navCtrl: NavController, private _menuCtrl: MenuController) {
        this._menuCtrl.swipeEnable(false);
    }

    slides = [
        {
            title: "New Concept English",
            description: "Best English learning app",
            image: "assets/img/NCE2.jpg",
        },
        {
            title: "Recitation",
            description: "Scientific recitation methodologies",
            image: "assets/img/NCE2.jpg",
        },
        {
            title: "Graphical Study Statistics",
            description: "Let you see your study progress more easily",
            loginbutton: "Log in",
            image: "assets/img/NCE2.jpg",
            createaccountbutton: "Sign up"
        }
    ];

    goLoginPage() {
        this._navCtrl.setRoot(LoginPage);
    }

    goRegisterPage() {
        this._navCtrl.setRoot(RegisterPage);
    }
}