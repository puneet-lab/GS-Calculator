import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ICalculatorPercentageSettings, StorageKeyTypes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private storage: Storage) {}

  setCalculatorSettings(calcSettings: ICalculatorPercentageSettings): void {
    try {
      this.storage.set(
        StorageKeyTypes.GS_CALCULATOR_PERCENTAGE_SETTING,
        calcSettings
      );
    } catch (error) {
      console.log('😍 ~ setCalculatorSettings', error);
      throw new Error(error);
    }
  }

  async getCalculatorSettings(): Promise<ICalculatorPercentageSettings> {
    const calcSettings = (await this.storage.get(
      StorageKeyTypes.GS_CALCULATOR_PERCENTAGE_SETTING
    )) as ICalculatorPercentageSettings;
    return calcSettings;
  }
}
