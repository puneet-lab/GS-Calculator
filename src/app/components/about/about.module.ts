import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AboutComponent } from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, IonicModule, TranslateModule],
  exports: [AboutComponent],
})
export class AboutModule {}
