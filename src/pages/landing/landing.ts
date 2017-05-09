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
            title: "Learning english",
            description: "Kies producten van je favoriete supermarkt(en) in onze webshop.",
            image: "../../img/tutorial1.png",
        },
        {
            title: "Kies je bezorgadres",
            description: "Ontvang je boodschappen al binnen 2 uur of op het moment dat jij wenst.",
            image: "../../img/tutorial2.png",
        },
        {
            title: "Ontvang je boodschappen",
            description: "Boodschappen uit lokale supermarkten bezorgd tot in je keuken.",
            loginbutton: "Log in",
            image: "../../img/tutorial3.png",
            createaccountbutton: "Registreer nieuw account"
        }
    ];

    goLoginPage() {
        this._navCtrl.setRoot(LoginPage);
    }

    goRegisterPage() {
        this._navCtrl.setRoot(RegisterPage);
    }
}