import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { isEmpty } from 'lodash';
import { ICalculatorPercentageSettings } from 'src/app/models/app.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}
  settingsForm: FormGroup;

  async ngOnInit(): Promise<void> {
    this.initSettingsForm();
    const calcSettings = await this.sharedService.getCalculatorSettings();
    this.patchSettingForm(calcSettings);
  }

  patchSettingForm(calcSettings: ICalculatorPercentageSettings): void {
    if (!isEmpty(calcSettings)) {
      Object.entries(calcSettings).forEach(([key, val]) =>
        this.settingsForm.get(key).patchValue(val || 0)
      );
    }
  }

  initSettingsForm(): void {
    this.settingsForm = this.fb.group({
      saving: [0, [Validators.required]],
      gst: [0, [Validators.required]],
    });
  }

  closeModal(): void {
    void this.modalCtrl.dismiss();
  }

  onSettingFormSubmit() {
    try {
      const isSettingFormValid = this.settingsForm.value;
      if (isSettingFormValid) {
        const settingFormValues = this.settingsForm
          .value as ICalculatorPercentageSettings;
        this.sharedService.setCalculatorSettings(settingFormValues);
        this.closeModal();
      } else {
      }
    } catch (error) {
      console.log('😍 ~ onSettingFormSubmit', error);
    }
  }
}
