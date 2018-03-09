import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { IToken, IFingerPrintIdCredential, IUser } from '../../interfaces/interface';
import { Constant } from '../../constants/constant';

import { RestProvider } from '../../providers/rest/rest';
import { FingerPrintAuthProvider } from '../../providers/finger-print-auth/finger-print-auth';
import { LoaderProvider } from '../../providers/loader/loader';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { TouchIdAgreementPage } from '../touch-id-agreement/touch-id-agreement';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isShowTouchId: boolean = true;
  fingerPrintIdCredential: IFingerPrintIdCredential;
  
  public backgroundImage = 'assets/imgs/background/login.jpg';

  get usernameFormControl() { return this.loginForm.get('usernameFormControl'); }
  
  get passwordFormControl() { return this.loginForm.get('passwordFormControl'); }

  get isUseTouchIdFormControl() { return this.loginForm.get('isUseTouchIdFormControl'); }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController,
    public loaderService: LoaderProvider,
    private platform:Platform, 
    private restapiService: RestProvider,
    private storage: Storage,
    private fingerPrintAuthService: FingerPrintAuthProvider) 
  {
    
  }

  ngOnInit(): void {
   
    this.loginForm = new FormGroup({
      'usernameFormControl': new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      'passwordFormControl': new FormControl('',[
        Validators.required,
        Validators.minLength(6)
      ]),
      'isUseTouchIdFormControl': new FormControl()
    });
  }

  async ionViewDidLoad() {
    await this.platform.ready();
    this.initiateFingerPrint();
  }

  async initiateFingerPrint() {
    this.fingerPrintIdCredential = await this.fingerPrintAuthService.getCredential();
    
      if(this.fingerPrintIdCredential != null && this.fingerPrintIdCredential.isFingerPrintIdEnabled) {
        this.isShowTouchId = false;
        let result = await this.fingerPrintAuthService.showFingerPrint();
        if(result === 'Success') {
          this.signInUsingFingerPrintId(this.fingerPrintIdCredential);
        }
      }
  }

  async showFingerPrint() {
    if(this.fingerPrintIdCredential.isFingerPrintIdEnabled) {
      let result = await this.fingerPrintAuthService.showFingerPrint();
      if(result === 'Success')
        this.signInUsingFingerPrintId(this.fingerPrintIdCredential);
    }
  }

  async signInUsingFingerPrintId(fingerPrintIdCredential: IFingerPrintIdCredential) {
    this.loaderService.showLoading();
    let loggedUser = await this.fingerPrintAuthService.signInUsingFingerPrintId(fingerPrintIdCredential);
    this.navCtrl.push(TabsPage, {
      'loggedUser': loggedUser
    });
    this.loaderService.dismissLoading();
  }

  async login() {
    try {
      this.loaderService.showLoading();

      let loginCredential = {
        'username': this.usernameFormControl.value,
        'password': this.passwordFormControl.value,
        'isFingerPrintIdEnabled': false
      };
      //TODO: simplify the code below
      let result = await this.restapiService.login(loginCredential);
      let tokenResult = result as IToken;
      this.storage.set(Constant.TOKEN, tokenResult.token);
      let loggedUser = await this.restapiService.getUserByUsername(this.usernameFormControl.value) as IUser;
     
      if(!this.isUseTouchIdFormControl.value) {
        this.navCtrl.push(TabsPage, {
          'loggedUser': loggedUser
        });
        
        return;
      }

      this.loaderService.dismissLoading();
      
      this.navCtrl.push(TouchIdAgreementPage)
      let modal = this.modalCtrl.create(TouchIdAgreementPage);
      
      modal.present();

      modal.onDidDismiss(isAgree => {
        let fingerPrintIdCredential : IFingerPrintIdCredential = {
          'username': this.usernameFormControl.value,
          'isFingerPrintIdEnabled': (isAgree) ? true : false
        };
        this.fingerPrintAuthService.saveCredential(fingerPrintIdCredential);
       
        this.navCtrl.push(TabsPage, loggedUser);
      });
    }
    catch(e) {
      this.loaderService.dismissLoading();
      alert('We do not recognize your \nusername and/or password.\nPlease try again.')
    }
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }
}

