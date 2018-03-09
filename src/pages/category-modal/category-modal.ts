import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-category-modal',
  templateUrl: 'category-modal.html',
})
export class CategoryModalPage {

  private categoryPicked: string;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss(this.categoryPicked);
  }

  pickedCategory(categoryPicked: string) {
    this.categoryPicked = categoryPicked;
    this.dismiss();
  }
}
