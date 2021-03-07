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
  isValid = true;
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
          this.isValid = this.validateCalcFormFields(calcValues);
          if (this.isValid) {
            calcValues = this.initCalculatorFormValues(calcValues);
            this.performCalculation(calcValues);
          } else {
            this.resetVariables();
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
      this.calculatePercentage(this.gstPercent);
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
      if (!isValidWholeNumber) {
        this.calcForm.get(key).setErrors({ notNumber: true });
        break;
      }
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
    modal.onDidDismiss().finally(async () => {
      this.savingPercent = 0;
      this.gstPercent = 0;
      this.resetForm();
      this.resetVariables();
      await this.setCalcDefaultPercent();
    });
  }

  resetVariables(): void {
    this.sellingPrice = 0;
    this.calcSaving = 0;
    this.calcGST = 0;
    this.totalWithTransport = 0;
    this.totalPrice = 0;
  }

  resetForm(): void {
    this.calcForm.reset();
  }

  changeLanguage(): void {
    const currentLanguage = this.translate.currentLang as LanguageTypes;
    const switchLanguage =
      currentLanguage === LanguageTypes.HINDI
        ? LanguageTypes.ENGLISH
        : LanguageTypes.HINDI;

    this.sharedService.setLanguage(switchLanguage);
  }
}
