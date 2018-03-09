import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoaderProvider {

  private loading: any;
  private _loadingCtrl: LoadingController;

  constructor(loadingCtrl: LoadingController) {
    this._loadingCtrl = loadingCtrl;
  }
  
  showLoading() {
    this.loading = this._loadingCtrl.create({
      content: 'Authenticating...'
    });
  
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

}