import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DevicesListPage } from './devices-list.page';
import { DeviceNamePipe } from '../pipes/device-name.pipe';

const routes: Routes = [
  {
    path: '',
    component: DevicesListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DevicesListPage,
    DeviceNamePipe
  ]
})
export class DevicesListPageModule {}
