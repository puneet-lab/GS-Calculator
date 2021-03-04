import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsComponent } from '../components/settings/settings.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.openSettingsModal();
  }

  async openSettingsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: SettingsComponent });
    void modal.present();
  }
}
