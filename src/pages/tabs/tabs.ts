import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { IUser } from '../../interfaces/interface';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  loggedUser: IUser;

  constructor(private navParams: NavParams) {
   this.loggedUser = this.navParams.get("loggedUser") as IUser;
  }
}
