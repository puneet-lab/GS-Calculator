import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  email = 'contact@puneetkushwah.com';
  website = 'https://puneetkushwah.com/landing/portfolio';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  async copyEmail(): Promise<void> {
    await Clipboard.write({
      string: this.email,
    });
  }

  async copyWebsite(): Promise<void> {
    await Clipboard.write({
      string: this.website,
    });
  }
}
