import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { LedPosition } from '../interfaces/led';
import { LoadingService } from '../services/loading.service';
import { BtService } from '../services/bt.service';
import { UtilsPanel } from '../models/panel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogService } from '../services/log.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-custom-panel",
  templateUrl: "./custom-panel.page.html",
})
export class CustomPanelPage implements OnInit, OnDestroy {
  panel: Array<Array<number>> = Array(8);

  stateSubscription: Subscription;
  connectedSubscription: Subscription;

  constructor(
    private loading: LoadingService,
    private bt: BtService,
    private router: Router,
    private zone: NgZone,
    private logger: LogService,
    private translate: TranslateService,
  ) {
    this.panel = this.initPanel();
  }

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
   * updatePanel
   * 
   * updates the information of the array with the information received
   * @param {LedPosition} data an object with the row, column and state of the led
   */
  updatePanel(data: LedPosition): void {
    this.panel[data.row][data.col] = data.value;
  }

  /**
   * initPanel
   *
   * inits the array used to manage the information to send to the led matrix
   */
  initPanel(): Array<Array<number>> {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  /**
   * sendPanel
   *
   * sends the information of the panel to draw it
   */
  async sendPanel(): Promise<any> {
    await this.loading.showLoading(this.translate.instant('common.sendingImage'));
    await this.bt.sendData(`${UtilsPanel.getDataPanel(this.panel)}\n`);
    await this.loading.hideLoading();
  }

  /**
   * cleanPanel
   *
   * sends an order to clean the panel
   */
  async cleanPanel(): Promise<any> {
    this.panel = this.initPanel();
    await this.loading.showLoading(this.translate.instant('customPanel.cleaningMatrix'));
    await this.bt.sendData(`clean\n`);
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
}
