import { Component  } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';

import { LatLng } from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation';

import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { RestProvider } from '../../providers/rest/rest';
import { MapProvider } from '../../providers/map/map';
import { IBusinessResult } from '../../interfaces/interface';

import { CategoryModalPage } from '../category-modal/category-modal';
import { NavParams } from 'ionic-angular/navigation/nav-params';

//TODO:
//1. UI design
//2. hover list of POI
//3. clean up code
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public addressLabel: string;
  public navigateTo: string;

  private _mapProvider: MapProvider;
  private _selectedCategories: string;
 
  private loggedUser: any;

  constructor(public navCtrl: NavController,
    private platform:Platform,
    public modalCtrl: ModalController,
    private geolocation : Geolocation,
    public restapiService: RestProvider,
    private nativeGeocoder: NativeGeocoder,
    private launchNavigator: LaunchNavigator,
    private navParams: NavParams
  ) {
      this.loggedUser = this.navParams.data;
  }

  async ionViewDidEnter(){
    await this.platform.ready();
    this.initMap();
  }  

  async initMap() {
    this._mapProvider = new MapProvider('home_map', this.geolocation, this.nativeGeocoder, this.launchNavigator);//geolocation parameter can remove if businessmap separate to new class or provider
    await this._mapProvider.onMapReady();
    this.initiateCurrentLocation();
  }

  public refreshCurrentLocation() {
    this._mapProvider.clearMarkers();
    this.initiateCurrentLocation();
  }

  private async initiateCurrentLocation() {
    try {
      let geoPosition = await this._mapProvider.initiateCurrentLocation();
      
      let location = new LatLng(geoPosition.coords.latitude, geoPosition.coords.longitude); 
      
      this.setCurrentMarker(location);
  
      this.setAddress(location);
  
      this.setBusinessMarkers(location);
    }
    catch(e) {
      alert(e);
    }
  }

  public navigate() {
    this._mapProvider.navigate();
  }

  public showCategoryModalPage() {
    let modal = this.modalCtrl.create(CategoryModalPage);
    
    modal.onDidDismiss(data => { 
      this._selectedCategories = data;
      
      this._mapProvider.clearMarkers();
      this.setCurrentMarker(this._mapProvider.getCurrentLocation());
      this.setBusinessMarkers(this._mapProvider.getCurrentLocation(), this._selectedCategories)
    });

    modal.present();
  }

  async setAddress(location: LatLng) {
    try {
      let result = await this._mapProvider.getAddress(location);
      this.addressLabel = result[0].locality + " " + result[0].subLocality;
    }
    catch(e) {
      alert(e);
    }
  }

  setCurrentMarker(location: LatLng) {
    
    this._mapProvider.setCurrentLocation(location);
    this._mapProvider.animateMap(location);
    this._mapProvider.addMarker(location, "blue", "Current Location");
  }
  
  async setBusinessMarkers(location: LatLng, categories: string = "") {
    try {
      let businessResult = await this.restapiService.getBusinessByLatLng(location.lat, location.lng, categories) as IBusinessResult;
      
      for (let i=0; i<businessResult.businesses.length; i++) {
      
        let location = new LatLng(businessResult.businesses[i].coordinates.latitude,         
          businessResult.businesses[i].coordinates.longitude) 
      
         this._mapProvider.addMarker(location, 'green', businessResult.businesses[i].name);
      }
    }
    catch(e) {
      alert(e);
    }
  } 
  
}
