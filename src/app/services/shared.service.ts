import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ICalculatorPercentageSettings, StorageKeyTypes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private storage: Storage, private translate: TranslateService) {}
  selectedLanguage = '';
  defaultLanguage: string = environment.language;

  setInitialAppLanguage(): void {
    let language = this.translate.getBrowserLang();
    language = language ? language : this.defaultLanguage;
    this.translate.setDefaultLang(language);
    this.storage
      .get(StorageKeyTypes.GS_CALCULATOR_DEFAULT_LANGUAGE)
      .then((val: string) => this.initializeAppLang(val))
      .catch(() => this.initializeAppLang(null));
  }

  initializeAppLang(val: string): void {
    const lang = val ? val : this.defaultLanguage;
    this.setLanguage(lang);
    this.selectedLanguage = lang;
  }

  setLanguage(lang: string): void {
    lang = lang ? lang : this.defaultLanguage;
    this.translate.use(lang);
    this.selectedLanguage = lang;
    void this.storage.set(StorageKeyTypes.GS_CALCULATOR_DEFAULT_LANGUAGE, lang);
  }

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
