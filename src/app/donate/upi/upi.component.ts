import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upi',
  templateUrl: './upi.component.html',
  styleUrls: ['./upi.component.scss'],
})
export class UpiComponent implements OnInit {
  upiID = '9907053804@paytm';
  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  async copyUPI(): Promise<void> {
    await Clipboard.write({
      string: this.upiID,
    });
    await Toast.show({
      text: this.translate.instant('donate_text.upi_copied'),
      duration: 'long',
    });
  }
}
