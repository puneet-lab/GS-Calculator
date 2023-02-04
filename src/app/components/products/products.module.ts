import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { ProductsComponent } from "./products.component";

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, IonicModule, TranslateModule],
  exports: [ProductsComponent],
})
export class ProductsModule {}
