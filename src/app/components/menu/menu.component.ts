import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {

  openLanguages: boolean = false;

  constructor(
    private translate: TranslateService,
  ) { }

  /**
   * toggleLanguages
   * 
   * toggles about the state of the languages submenu
   */
  toggleLanguages(): void {
    this.openLanguages = !this.openLanguages;
  }

  /**
   * changeLanguage
   * 
   * changes de language of the app according the value
   * chosen by the user and closes the menu
   * @param {string} language code of the language to change
   */
  changeLanguage(language: string): void {
    this.translate.use(language);
    this.openLanguages = false;
  }

}
