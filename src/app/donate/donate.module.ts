import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonatePageRoutingModule } from './donate-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from './card/card.component';
import { DonatePage } from './donate.page';
import { UpiComponent } from './upi/upi.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonatePageRoutingModule,
    TranslateModule,
  ],
  declarations: [DonatePage, CardComponent, UpiComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DonatePageModule {}
