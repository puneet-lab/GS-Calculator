import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from 'lodash';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SettingsComponent } from '../components/settings/settings.component';
import { ICalculatorFormValues, LanguageTypes } from '../models';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  savingPercent = 0;
  gstPercent = 0;
  calcForm: FormGroup;
  sellingPrice = 0;
  calcSaving = 0;
  calcGST = 0;
  totalWithTransport = 0;
  totalPrice = 0;
  constructor(
    private modalCtrl: ModalController,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.setCalcDefaultPercent();
    this.initCalculatorForm();
    this.calculateSellingPrice();
  }

  initCalculatorForm(): void {
    this.calcForm = this.fb.group({
      buy_price: [null, [Validators.required]],
      transport: [null, [Validators.required]],
      insurance: [null, [Validators.required]],
    });
  }

  calculateSellingPrice(): void {
    this.calcForm.valueChanges
      .pipe(
        tap((calcValues: ICalculatorFormValues) => {
          const isValid = this.validateCalcFormFields(calcValues);
          if (isValid) {
            calcValues = this.initCalculatorFormValues(calcValues);
            this.performCalculation(calcValues);
          }
        }),
        catchError(() => {
          this.sellingPrice = 0;
          return EMPTY;
        })
      )
      .subscribe();
  }

  performCalculation(calcValues: ICalculatorFormValues): void {
    const { buy_price, transport, insurance } = calcValues;
    this.totalWithTransport = buy_price + transport;
    this.totalPrice = this.totalWithTransport + insurance;
    this.calcSaving =
      this.totalPrice * this.calculatePercentage(this.savingPercent);
    this.calcGST =
      (this.totalPrice + this.calcSaving) *
      this.calculatePercentage(this.calcSaving);
    this.sellingPrice = this.totalPrice + this.calcSaving + this.calcGST;
  }

  calculatePercentage(value: number): number {
    value = value ?? 0;
    return value / 100;
  }

  initCalculatorFormValues(
    calcValues: ICalculatorFormValues
  ): ICalculatorFormValues {
    for (const key in calcValues) {
      calcValues[key] = +calcValues[key] ? +calcValues[key] : 0;
    }
    return calcValues;
  }

  validateCalcFormFields(calcValues: ICalculatorFormValues): boolean {
    let isValidWholeNumber = false;
    for (const key in calcValues) {
      const val = calcValues[key];
      isValidWholeNumber = !isNaN(val) && val >= 0;
      if (!isValidWholeNumber) break;
    }
    return isValidWholeNumber;
  }

  async setCalcDefaultPercent(): Promise<void> {
    const calcDefaultSettings = await this.sharedService.getCalculatorSettings();
    if (!isEmpty(calcDefaultSettings)) {
      const { gst, saving } = calcDefaultSettings;
      this.savingPercent = saving;
      this.gstPercent = gst;
    }
  }

  async openSettingsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: SettingsComponent });
    void modal.present();
    modal
      .onDidDismiss()
      .finally(async () => await this.setCalcDefaultPercent());
  }

  changeLanguage(): void {
    const currentLanguage = this.translate.currentLang as LanguageTypes;
    const switchLanguage =
      currentLanguage === LanguageTypes.HINDI
        ? LanguageTypes.ENGLISH
        : LanguageTypes.HINDI;

    const setLanguage = this.sharedService.setLanguage(switchLanguage);
  }
}
