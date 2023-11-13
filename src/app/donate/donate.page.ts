import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CardComponent } from './card/card.component';
import { UpiComponent } from './upi/upi.component';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.page.html',
  styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {
  constructor(private router: Router, private modalCtrl: ModalController) {}

  ngOnInit() {
    void this.openUPIModal();
  }

  goToHome() {
    this.router.navigate(['']);
  }

  async openUPIModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: UpiComponent });
    void modal.present();
  }

  async openCardModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CardComponent });
    void modal.present();
  }
}
