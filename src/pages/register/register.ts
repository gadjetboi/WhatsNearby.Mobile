import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { RestProvider } from '../../providers/rest/rest';
import { IRegisterUser } from '../../interfaces/interface';
import { LoginPage } from '../login/login';

//TODO:
//3. ui design
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  
  get usernameFormControl() { return this.registerForm.get('usernameFormControl'); }
  get firstnameFormControl() { return this.registerForm.get('firstnameFormControl'); }
  get lastnameFormControl() { return this.registerForm.get('lastnameFormControl'); }
  get genderFormControl() { return this.registerForm.get('genderFormControl'); }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private restapiService: RestProvider) {
  }

  ngOnInit(): void {
    
     this.registerForm = new FormGroup({
       'usernameFormControl': new FormControl('',[
         Validators.required,
         Validators.email
       ]),
       'firstnameFormControl': new FormControl('',[
         Validators.required
       ]),
       'lastnameFormControl': new FormControl('',[
         Validators.required
       ]),
      'genderFormControl': new FormControl('',[
        Validators.required
       ]),
     });
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    let registerUser = {
      'username': this.usernameFormControl.value,
      'firstname': this.firstnameFormControl.value,
      'lastname': this.lastnameFormControl.value,
      'gender': this.genderFormControl.value
    } as IRegisterUser;

    this.restapiService.registerUser(registerUser).then((result) => {
      alert("Successfully registered!");
      this.navCtrl.push(LoginPage);
    }).catch((err) => {
      alert(err);
    });
  }
}
