import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

import { GeneralPage } from '../general/general';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-landing',
    templateUrl: 'landing.html'
})


export class LandingPage {

    constructor(private _navCtrl: NavController) {

    }

    slides = [
        {
            title: "Shop online",
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

    goGeneralPage() {
        this._navCtrl.setRoot(GeneralPage);
    }
}