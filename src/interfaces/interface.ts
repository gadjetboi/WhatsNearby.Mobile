import { DateTime } from "ionic-angular/components/datetime/datetime";

export interface IBusinessResult {
    businesses: Array<IBusiness>
}
  
export interface IBusiness {
    categories: Array<ICategories>
    coordinates: ICoordinate;
    name: string
}

export interface ICategories {
    title: string,
    alias: string
}

export interface ICoordinate {
    latitude: number,
    longitude: number
}

export interface IRegisterUser {
    username: string,
    firstname: string,
    lastname: string,
    gender: string
}

export interface ILoginCredential {
    username: string,
    password: string,
    isFingerPrintIdEnabled: boolean
}

export interface IFingerPrintIdCredential {
    username: string,
    isFingerPrintIdEnabled: boolean
}

export interface IToken{
    token: string;
    expiration: DateTime
}

export interface IFingerPrintIdInfo {
    username: string,
    isFingerPrintIdEnabled: boolean
}

export interface IUser {
    username: string
    firstname: string,
    lastname: string,
    gender: string,
    email: string
}