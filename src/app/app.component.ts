import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BtService } from './services/bt.service';
import { LogService } from './services/log.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',  
})
export class AppComponent {

  private availableLanguages: string[] = ['en', 'es'];
  private defaultLanguage: string = 'es';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private bt: BtService,
    private logger: LogService,
    private translate: TranslateService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.logger.messageConsole(`Application ready`, this.constructor.name);
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.availableLanguages.includes(this.translate.getBrowserLang())) {
        this.translate.setDefaultLang(this.translate.getBrowserLang());
      } else {
        this.translate.setDefaultLang(this.defaultLanguage);
      }
      
      this.platform.resume.subscribe(() => {
        // the user returns to the application,
        // must be checked the status of the bluetooth device
        this.logger.messageConsole(`Application resumed`, this.constructor.name);
        this.bt.stateBT();
        this.bt.connectedBT();
      });
    });
  }
}
