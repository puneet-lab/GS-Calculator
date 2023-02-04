import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { isEmpty } from "lodash-es";
import {
  ICalculatorPercentageSettings,
  ICurrencyList,
} from "src/app/models/app.model";
import { allCurrencies, defaultCurrency } from "src/app/resources/currencies";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    public sharedService: SharedService
  ) {}
  settingsForm: FormGroup;
  defaultCurrency = defaultCurrency.code;
  defaultCurrencySymbol = defaultCurrency.symbol;
  currentCurrency = this.defaultCurrency;
  currentCurrencySymbol = this.defaultCurrencySymbol;
  currencies: ICurrencyList[] = this.getMappedCurrencies();

  async ngOnInit(): Promise<void> {
    this.initSettingsForm();
    const calcSettings = await this.sharedService.getCalculatorSettings();
    this.patchSettingForm(calcSettings);
  }

  searchCurrencies($event: any): void {
    let search = $event.detail.value;
    if (!search) {
      this.currencies = this.getMappedCurrencies();
      return;
    }
    search = search.toLowerCase();
    const matchedCurrencies = allCurrencies.filter(
      ({ name, code }) =>
        name.toLowerCase().includes(search) || name.toLowerCase().includes(code)
    );
    this.currencies = this.getMappedCurrencies(matchedCurrencies);
  }

  resetCurrencyList(): void {}

  getMappedCurrencies(currencies = allCurrencies): ICurrencyList[] {
    currencies = currencies?.length ? currencies : allCurrencies;
    return currencies.map(({ name, symbolNative, code }) => ({
      name,
      sign: symbolNative,
      code,
    }));
  }

  patchSettingForm(calcSettings: ICalculatorPercentageSettings): void {
    if (!isEmpty(calcSettings)) {
      Object.entries(calcSettings).forEach(([key, val]) => {
        switch (key) {
          case "currency":
            this.settingsForm
              ?.get(key)
              ?.patchValue(val || this.defaultCurrency);
            break;
          case "currencySymbol":
            this.settingsForm
              ?.get(key)
              ?.patchValue(val || this.defaultCurrencySymbol);
            break;
          default:
            this.settingsForm?.get(key)?.patchValue(val || 0);
            break;
        }
      });
      this.currentCurrency = this.settingsForm.get("currency").value;
      this.currentCurrencySymbol =
        this.settingsForm.get("currencySymbol").value;
    }
  }

  initSettingsForm(): void {
    this.settingsForm = this.fb.group({
      saving: [0, [Validators.required]],
      gst: [0, [Validators.required]],
      currency: [this.currentCurrency],
      currencySymbol: [this.defaultCurrencySymbol],
    });
  }

  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  onSettingFormSubmit(): void {
    try {
      const isSettingFormValid = this.settingsForm.valid;
      if (isSettingFormValid) {
        let settingFormValues = this.settingsForm
          .value as ICalculatorPercentageSettings;
        settingFormValues = {
          ...settingFormValues,
          currencySymbol: allCurrencies.find(
            (cur) => cur.code === settingFormValues.currency
          ).symbolNative,
        };
        this.sharedService.setCalculatorSettings(settingFormValues);
        this.closeModal();
      } else {
      }
    } catch (error) {
      console.log("😍 ~ onSettingFormSubmit", error);
    }
  }

  onClickCurrency(currency: ICurrencyList) {
    this.currentCurrency = currency.code;
    this.settingsForm.get("currency").patchValue(this.currentCurrency);

    this.currentCurrencySymbol = allCurrencies.find(
      (cur) => cur.code === this.currentCurrency
    ).symbolNative;

    this.settingsForm
      .get("currencySymbol")
      .patchValue(this.currentCurrencySymbol);
  }
}
