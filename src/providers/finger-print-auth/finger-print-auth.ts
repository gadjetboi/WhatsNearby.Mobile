import { Injectable } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Storage } from '@ionic/storage';

import { IFingerPrintIdCredential, IUser } from '../../interfaces/interface';
import { Constant } from '../../constants/constant';
import { RestProvider } from '../rest/rest';

@Injectable()
export class FingerPrintAuthProvider {
  isFingerPrintEnabled: boolean;
  fingerPrintIdCredential: IFingerPrintIdCredential;

  constructor(
    private storage: Storage, 
    private faio: FingerprintAIO,
    private restapiService: RestProvider) {
    
  }

  saveCredential(fingerPrintIdCredential: IFingerPrintIdCredential) {
    this.storage.set(Constant.FINGER_PRINT_ID_INFO, fingerPrintIdCredential);
  }

  async signInUsingFingerPrintId(fingerPrintIdCredential: IFingerPrintIdCredential) : Promise<IUser> {
    let loggedUser = await this.restapiService.getUserByUsername(fingerPrintIdCredential.username) as IUser;
    return loggedUser;
  }

  async getCredential() : Promise<IFingerPrintIdCredential> {
    return await this.storage.get(Constant.FINGER_PRINT_ID_INFO) as IFingerPrintIdCredential;
  }

  async showFingerPrint(): Promise<any>{
    try {
      const available = await this.faio.isAvailable();
      if(available === 'Available') {
        const result = await this.faio.show({
          clientId: "Please sign on."
        });
        return result;
      }
    } 
    catch(e) {
      //alert(e);
    }
  }
}
