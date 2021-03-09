import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { isEmpty } from 'lodash';
import {
  ICalculatorPercentageSettings,
  ICurrencyList,
} from 'src/app/models/app.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    public sharedService: SharedService
  ) {}
  settingsForm: FormGroup;

  defaultCurrency = '₹';
  currentCurrency = this.defaultCurrency;
  currencies: ICurrencyList[] = [
    {
      sign: '₹',
      name: 'Rupee',
    },
    {
      sign: '$',
      name: 'Dollar',
    },
    {
      sign: '€',
      name: 'Euro',
    },
    {
      sign: '฿',
      name: 'Baht',
    },
  ];

  async ngOnInit(): Promise<void> {
    this.initSettingsForm();
    const calcSettings = await this.sharedService.getCalculatorSettings();
    this.patchSettingForm(calcSettings);
  }

  patchSettingForm(calcSettings: ICalculatorPercentageSettings): void {
    if (!isEmpty(calcSettings)) {
      Object.entries(calcSettings).forEach(([key, val]) =>
        key !== 'currency'
          ? this.settingsForm?.get(key)?.patchValue(val || 0)
          : this.settingsForm?.get(key)?.patchValue(val || this.defaultCurrency)
      );
      this.currentCurrency = this.settingsForm.get('currency').value;
    }
  }

  initSettingsForm(): void {
    this.settingsForm = this.fb.group({
      saving: [0, [Validators.required]],
      gst: [0, [Validators.required]],
      currency: [this.currentCurrency],
    });
  }

  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  onSettingFormSubmit() {
    try {
      const isSettingFormValid = this.settingsForm.valid;
      if (isSettingFormValid) {
        const settingFormValues = this.settingsForm
          .value as ICalculatorPercentageSettings;
        console.log('😍 ~ isSettingFormValid', settingFormValues);
        this.sharedService.setCalculatorSettings(settingFormValues);
        this.closeModal();
      } else {
      }
    } catch (error) {
      console.log('😍 ~ onSettingFormSubmit', error);
    }
  }

  onClickCurrency(currency: ICurrencyList) {
    this.currentCurrency = currency.sign;
    this.settingsForm.get('currency').patchValue(this.currentCurrency);
  }
}
