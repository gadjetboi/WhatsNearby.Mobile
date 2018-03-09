import { Component } from '@angular/core';
import { NavParams, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-touch-id-agreement',
  templateUrl: 'touch-id-agreement.html',
})
export class TouchIdAgreementPage {

  isTouchIdAgree: boolean;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    
  }

  cancel() {
    this.viewCtrl.dismiss(false);
  }

  save() {
    if(this.isTouchIdAgree)
      this.viewCtrl.dismiss(true);
  }
}
