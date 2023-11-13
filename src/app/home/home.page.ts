import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from 'lodash-es';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { AboutComponent } from '../components/about/about.component';
import { ProductsComponent } from '../components/products/products.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { ICalculatorFormValues, IProduct, LanguageTypes } from '../models';
import { defaultCurrency } from '../resources/currencies';
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
  currency: string;
  buyPrice = 0;
  transport = 0;
  insurance = 0;
  productName: string;
  isProductModalOpen = false;
  currencySymbol: string;
  menuItems = [
    {
      title: 'Products',
      action: this.openProductsModal.bind(this),
      iconName: 'layers-outline',
    },
    {
      title: 'Language',
      action: this.changeLanguage.bind(this),
      iconName: 'language-outline',
    },
    {
      title: 'Settings',
      action: this.openSettingsModal.bind(this),
      iconName: 'cog-outline',
    },
    {
      title: 'About',
      action: this.openAboutModal.bind(this),
      iconName: 'information-circle-outline',
    },
  ];
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private translate: TranslateService,
    public sharedService: SharedService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.setCalcDefaultPercent();
    this.initCalculatorForm();
    this.calculateSellingPrice();
    // this.openDonate();
  }

  initCalculatorForm(): void {
    this.calcForm = this.fb.group({
      buy_price: [0, [Validators.required]],
      transport: [0, [Validators.required]],
      insurance: [0, [Validators.required]],
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
    this.buyPrice = buy_price;
    this.transport = transport;
    this.insurance = insurance;
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
    const calcDefaultSettings =
      await this.sharedService.getCalculatorSettings();
    this.currency = defaultCurrency.code;
    if (!isEmpty(calcDefaultSettings)) {
      const { gst, saving, currency, currencySymbol } = calcDefaultSettings;
      this.savingPercent = saving ? saving : 0;
      this.gstPercent = gst ? gst : 0;
      this.currency = currency ? currency : defaultCurrency.code;
      this.currencySymbol = currencySymbol
        ? currencySymbol
        : defaultCurrency.symbol;
    }
  }

  async openSettingsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: SettingsComponent });
    void modal.present();
    modal.onDidDismiss().finally(async () => {
      this.resetVariables();
      await this.setCalcDefaultPercent();
      const calcValues = this.calcForm.value;
      this.performCalculation(calcValues);
    });
  }

  async openProductsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: ProductsComponent });
    void modal.present();
  }

  async openAboutModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: AboutComponent });
    void modal.present();
  }

  resetVariables(): void {
    this.sellingPrice = 0;
    this.calcSaving = 0;
    this.calcGST = 0;
    this.totalWithTransport = 0;
    this.totalPrice = 0;
  }

  resetForm(): void {
    const calcDefaultValues: ICalculatorFormValues = {
      buy_price: 0,
      insurance: 0,
      transport: 0,
    };
    Object.entries(calcDefaultValues).forEach(([key, val]) =>
      this.calcForm.get(key).patchValue(val)
    );
  }

  changeLanguage(): void {
    const currentLanguage = this.translate.currentLang as LanguageTypes;
    const switchLanguage =
      currentLanguage === LanguageTypes.HINDI
        ? LanguageTypes.ENGLISH
        : LanguageTypes.HINDI;

    this.sharedService.setLanguage(switchLanguage);
  }

  cancel(): void {
    this.isProductModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }

  confirm(): void {
    this.isProductModalOpen = false;
    this.modal.dismiss(this.productName, 'confirm');
    this.saveProduct();
  }

  openSaveProductModal(): void {
    this.productName = '';
    this.isProductModalOpen = true;
  }

  async saveProduct(): Promise<void> {
    try {
      const products = await this.sharedService.getProducts();
      const isProductExists = this.getProductsExists(products);
      if (isProductExists) {
        const productExistsMessage = this.translate.instant(
          'Product already exists'
        );
        this.showToast(productExistsMessage);
        return;
      }
      const calcSettings = await this.sharedService.getCalculatorSettings();

      const formValues = this.calcForm.value as ICalculatorFormValues;
      const product: IProduct = {
        id: uuid(),
        ...formValues,
        sellingPrice: this.sellingPrice,
        tax: this.calcGST,
        profit: this.calcSaving,
        productName: this.productName,
        updatedAt: Date.now(),
        isOpen: false,
        calcSettings,
      };
      await this.sharedService.setProducts(
        products ? [...products, product] : [product]
      );
      const message = this.translate.instant('Product saved');
      await this.showToast(message);
      this.resetForm();
    } catch (error) {
      const message = this.translate.instant('Product not saved, try later');
      await this.showToast(message);
      throw error;
    }
  }

  getProductsExists(products: IProduct[]): boolean {
    if (!products?.length) return false;
    const isProductExists = products?.findIndex(
      ({ productName }) =>
        productName.toLowerCase() === this.productName.toLowerCase()
    );
    return isProductExists !== -1;
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }

  openDonate(): void {
    this.router.navigate(['/donate']);
  }
}
