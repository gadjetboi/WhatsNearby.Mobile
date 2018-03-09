import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { ILoginCredential, IRegisterUser } from '../../interfaces/interface';

import { Constant } from '../../constants/constant';

import { Storage } from '@ionic/storage';
//TODO: 
//1. clean up code
@Injectable()
export class RestProvider {

  private apiUrl = "https://vanznearbyapi.azurewebsites.net/api/";
  private headers = new Headers();
  private authorizeHeader: string;
  
  constructor(public http: Http,
              private storage: Storage) {
    this.headers.append('Content-Type', 'application/json');
  }

  public getToken(): Promise<any> {
    return this.storage.get(Constant.TOKEN);
  }

  login(loginCredential: ILoginCredential) {
    
    let requestOptions = new RequestOptions();

    requestOptions.headers = this.headers;
  
    let body = { "username": loginCredential.username, "password": loginCredential.password };

    let promise = new Promise((resolve, reject) => {
      
      this.http.post(
        this.apiUrl + 'auth/token',
        JSON.stringify(body),
        requestOptions
        ).toPromise().then(
          res => { // Success
            
            if(res.status == 200)
              resolve(res.json());
            else
              reject(res.status);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });

    return promise;
  }

  async getUserByUsername(username: string) {
    
    let requestOptions = new RequestOptions();
    let tokenResult = await this.getToken();
    
    let promise = new Promise((resolve, reject) => {
  
        if(!this.headers.has('Authorization')) {
          this.headers.delete('Authorization');

          this.authorizeHeader = 'Bearer ' + tokenResult;
          this.headers.append('Authorization', this.authorizeHeader);
        }

        requestOptions.headers = this.headers;

        this.http.get(
          this.apiUrl + 'user/by/?username=' + username,
          requestOptions
          ).toPromise().then(
            res => { // Success
              resolve(res.json());
            },
            msg => { // Error
              reject(msg);
            }
          );
      });
      
    return promise;
  }

  registerUser(registerUser: IRegisterUser) {
    let requestOptions = new RequestOptions();
    
    requestOptions.headers = this.headers;
  
    let body = registerUser;

    let promise = new Promise((resolve, reject) => {
      
      this.http.post(
        this.apiUrl + 'auth/register',
        JSON.stringify(body),
        requestOptions
        ).toPromise().then(
          res => { // Success
            if(res.status == 201)
              resolve(res.status);
            else  
              reject(res.status);
            //resolve(res.json());
          },
          msg => { // Error
            reject(msg);
          }
        );
    });

    return promise;
  }

  async getBusinessByLatLng(latitude: number, longitude: number, categories: string): Promise<{}> {
    let requestOptions = new RequestOptions();
    let tokenResult = await this.getToken();

    let promise = new Promise((resolve, reject) => {

        if(!this.headers.has('Authorization')) {
          this.headers.delete('Authorization');

          this.authorizeHeader = 'Bearer ' + tokenResult;
          this.headers.append('Authorization', this.authorizeHeader);
        }

        requestOptions.headers = this.headers;

        this.http.get(
          this.apiUrl + 'yelp/GetBusiness?lat=' + latitude + '&lng=' + longitude + '&categories=' + categories,
          requestOptions
          ).toPromise().then(
            res => { // Success
              resolve(res.json());
            },
            msg => { // Error
              reject(msg);
            }
          );
      });
      
    return promise;
    
  }

}  