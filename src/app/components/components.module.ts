import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridPanelComponent } from './grid-panel/grid-panel.component';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GridPanelComponent, 
    HeaderComponent, 
    MenuComponent,
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    TranslateModule.forChild(),
  ],
  exports: [
    GridPanelComponent,
    HeaderComponent,
    MenuComponent,
  ],
})
export class ComponentsModule {}
