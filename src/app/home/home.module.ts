import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { ChartsModule } from "ng2-charts";
import { ProductsModule } from "../components/products/products.module";
import { SettingsModule } from "../components/settings/settings.module";
import { NumericModule } from "../directives/numeric.module";
import { HomePageRoutingModule } from "./home-routing.module";
import { HomePage } from "./home.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SettingsModule,
    NumericModule,
    ReactiveFormsModule,
    TranslateModule,
    ChartsModule,
    ProductsModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
