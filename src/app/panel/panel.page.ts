import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { LoadingService } from '../services/loading.service';
import { Subscription } from 'rxjs';
import { BtService } from '../services/bt.service';
import { Router } from '@angular/router';
import { UtilsPanel } from '../models/panel';
import { LogService } from '../services/log.service';
import { Toast } from '@ionic-native/toast/ngx';
import { TranslateService } from '@ngx-translate/core';

export interface Panel {
  code: string;
  name: any;
  data: Array<Array<number>>;
}

@Component({
  selector: "app-panel",
  templateUrl: "./panel.page.html",
})
export class PanelPage implements OnInit, OnDestroy {
  panels: Array<Panel>;

  stateSubscription: Subscription;
  connectedSubscription: Subscription;

  constructor(
    private bt: BtService,
    private file: File,
    private loading: LoadingService,
    private router: Router,
    private logger: LogService,
    private toast: Toast,
    private zone: NgZone,
    private translate: TranslateService
  ) {}

  /**
   * ngOnInit
   *
   * when the component starts, fires some subscriptions for get the state and connection of bluetooth device are set up
   */
  ngOnInit(): void {
    this.stateSubscription = this.bt.state$.subscribe((res) => {
      this.logger.messageConsole(`stateBT: ${res}`, this.constructor.name);
      this.checkGoToHome(res);
    });
    this.connectedSubscription = this.bt.connected$.subscribe((res) => {
      this.logger.messageConsole(`connectedBT: ${res}`, this.constructor.name);
      this.checkGoToHome(res);
    });
  }

  /**
   * ngOnDestroy
   *
   * when the component is destroyed, the subscriptions will be removed
   */
  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.connectedSubscription.unsubscribe();
  }

  /**
  * ionViewWillEnter
  *
  * when the page starts to enter, must check the state and connection of the bluetooth device
  */
  ionViewWillEnter(): void {
    this.bt.stateBT();
    this.bt.connectedBT();
  }

  /**
   * ionViewDidEnter
   */
  async ionViewDidEnter(): Promise<any> {
    await this.loading.showLoading(
      this.translate.instant("panels.loadingPanels")
    );
    this.file
      .readAsText(
        `${this.file.applicationDirectory}www/assets/`,
        "panels-data.json"
      )
      .then((data: string) => {
        this.panels = JSON.parse(data);
      })
      .catch((error) => {
        this.logger.messageConsole(`Error: ${error}`, this.constructor.name);
        this.toast.showShortBottom(
          this.translate.instant("panels.errorLoadingPanels")
        );
      })
      .finally(() => {
        setTimeout(async () => {
          await this.loading.hideLoading();
        }, 1000);
      });
  }

  /**
   * showPanel
   *
   * sends a panel to show in the led matrix
   * @param {Panel} panel object with the information of a panel
   */
  async showPanel(panel: Panel): Promise<any> {
    await this.loading.showLoading(
      this.translate.instant("common.sendingImage")
    );
    await this.bt.sendData(`${UtilsPanel.getDataPanel(panel.data)}\n`);
    await this.loading.hideLoading();
  }

  /**
   * checkGoToHome
   *
   * checks if must redirect to home
   * @param {boolean} res result of the checking that indicates if must redirect or not
   */
  checkGoToHome(res: boolean): void {
    if (!res) {
      this.zone.run(() => this.router.navigate(["/home"]));
    }
  }

  /**
   * getPanelName
   *
   * returns the name of a panel according the language of the app
   * @param {Panel} panel object with the information of a panel
   * @returns a string with the name of the panel
   */
  getPanelName(panel: Panel): string {
    const language: string =
      this.translate.currentLang === undefined
        ? this.translate.defaultLang
        : this.translate.currentLang;
    return panel.name[language] !== undefined
      ? panel.name[language]
      : this.translate.instant("panels.nameNotDefined");
  }
}
