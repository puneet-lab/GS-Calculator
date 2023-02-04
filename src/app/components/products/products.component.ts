import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { IProduct } from "src/app/models";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  products: IProduct[];
  storedProducts: IProduct[];

  constructor(
    private modalCtrl: ModalController,
    private sharedService: SharedService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initProducts();
  }

  async initProducts(): Promise<void> {
    this.products = await this.sharedService.getProducts();
    this.products = this.products.sort(
      (prev, curr) => curr.updatedAt - prev.updatedAt
    );
    this.storedProducts = JSON.parse(
      JSON.stringify(this.products)
    ) as IProduct[];
  }

  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  resetProducts(): void {
    if (!this.products) return;
    this.products = this.storedProducts;
  }

  searchProducts(event: any): void {
    const search = event?.detail?.value;
    if (!this.products) return;
    if (!search) {
      this.products = this.storedProducts;
    } else {
      this.products = this.storedProducts.filter(({ productName }) =>
        productName.toUpperCase().includes(search.toUpperCase())
      );
    }
  }

  async deleteProduct({ id: productID, productName }: IProduct): Promise<void> {
    const alert = await this.alertController.create({
      header:
        this.translate.instant("Delete Product") + ` ${productName}` + "?",
      buttons: [
        {
          text: this.translate.instant("Cancel"),
          role: "cancel",
          handler: () => {},
        },
        {
          text: this.translate.instant("OK"),
          role: "confirm",
          handler: async () => {
            this.products = this.products.filter(({ id }) => id !== productID);
            await this.sharedService.setProducts(this.products);
            this.initProducts();
          },
        },
      ],
    });

    await alert.present();
  }

  showProductDetails({ id }: IProduct): void {
    const product = this.products.find((product) => product.id === id);
    product.isOpen = !product.isOpen;
  }
}
