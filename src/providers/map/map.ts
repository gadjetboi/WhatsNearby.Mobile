import { Injectable } from '@angular/core';

import {
  GoogleMaps,
  GoogleMap,
  LatLng,
  GoogleMapsEvent
} from '@ionic-native/google-maps';

import { 
  Geolocation,
  GeolocationOptions,
  Geoposition } from '@ionic-native/geolocation';

import { 
  NativeGeocoder, 
  NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

  import { 
    LaunchNavigator, 
    LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
  

import { Observable } from 'rxjs/Observable';
//TODO:
//1. clean up code
@Injectable()
export class MapProvider {
  private map: GoogleMap;
  private _currentLocation: LatLng;
  private _destination: LatLng;

  public selectedMarkerTitle: string;

  constructor(
    private mapElement: string, 
    private geolocation: Geolocation, 
    private nativeGeocoder: NativeGeocoder,
    private launchNavigator: LaunchNavigator) {
    this.createMap();
  }

  private createMap() {
    let mapOptions = {
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      }
    };
    
    this.map = GoogleMaps.create(this.mapElement, mapOptions);
  }

  public onMapReady(): Promise<any> {
    return this.map.one(GoogleMapsEvent.MAP_READY);
  }

  public initiateCurrentLocation(): Promise<Geoposition> {

    let options: GeolocationOptions = {
      enableHighAccuracy : true,
      timeout: 10000
    };
  
    return this.geolocation.getCurrentPosition(options);
    
  }

  public watchPosition(): Observable<Geoposition> {
    
    let options: GeolocationOptions = {
      enableHighAccuracy: true, //change to false if less accurate and less power
      timeout: 1000,
      maximumAge: 0
    };

    let watch = this.geolocation.watchPosition(options);

    return watch;
  }

  public setCurrentLocation(currentLocation: LatLng) {

    this._currentLocation = currentLocation;
  }

  public getCurrentLocation(): LatLng {
    return this._currentLocation;
  }

  public getAddress(location: LatLng): Promise<NativeGeocoderReverseResult> {
    return this.nativeGeocoder.reverseGeocode(location.lat, location.lng);
  }

  public animateMap(targetLocation: LatLng) {
    let options = {
      target: targetLocation,
      zoom: 10,
      tilt: 60,
      bearing: 140,
      duration: 5000
    };

    this.map.animateCamera(options);
  }

  public navigate() {
    if(this._destination == null) {
      return;
    }

    let options: LaunchNavigatorOptions = {
      start: [this._currentLocation.lat, this._currentLocation.lng],
      app: this.launchNavigator.APP.GOOGLE
    };
    
    this.launchNavigator.navigate([this._destination.lat, this._destination.lng], options)
    .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

  public addMarker(latLngs: LatLng, markerColor: string, markerTitle: string) {

    this.map.addMarker({
      title: markerTitle,
      icon: markerColor,
      animation: 'DROP',
      position: {
        lat: latLngs.lat,
        lng: latLngs.lng
      }
    })
    .then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this._destination = marker.getPosition();
        //this.selectedMarkerTitle = markerTitle;        
      });
    });  
  }

  public clearMarkers() {
    this.map.clear();
  }
}