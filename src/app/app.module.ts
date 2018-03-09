import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CategoryModalPage } from '../pages/category-modal/category-modal';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TouchIdAgreementPage } from '../pages/touch-id-agreement/touch-id-agreement';

import { RestProvider } from '../providers/rest/rest';
import { MapProvider } from '../providers/map/map';
import { FingerPrintAuthProvider } from '../providers/finger-print-auth/finger-print-auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { IonicStorageModule } from '@ionic/storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Camera } from '@ionic-native/camera';
import { LoaderProvider } from '../providers/loader/loader';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    CategoryModalPage,
    LoginPage,
    RegisterPage,
    TouchIdAgreementPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    CategoryModalPage,
    LoginPage,
    RegisterPage,
    TouchIdAgreementPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    Geolocation,
    Camera,
    RestProvider,
    MapProvider,
    NativeGeocoder,
    LaunchNavigator,
    FingerprintAIO,
    FingerPrintAuthProvider,
    LoaderProvider
  ]
})
export class AppModule {}
