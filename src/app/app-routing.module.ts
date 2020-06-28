import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'devices-list',
    loadChildren: () => import('./devices-list/devices-list.module').then(m => m.DevicesListPageModule),
  },
  {
    path: 'panels',
    loadChildren: () => import('./panel/panel.module').then(m => m.PanelPageModule),
  },
  {
    path: 'custom-panel',
    loadChildren: () => import('./custom-panel/custom-panel.module').then(m => m.CustomPanelPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
