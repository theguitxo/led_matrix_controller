import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PanelPage } from './panel.page';
import { GridPanelComponent } from '../components/grid-panel/grid-panel.component';

const routes: Routes = [
  {
    path: '',
    component: PanelPage
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
    PanelPage,
    GridPanelComponent
  ]
})
export class PanelPageModule {}
