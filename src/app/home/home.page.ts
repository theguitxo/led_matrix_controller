import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BtService } from '../services/bt.service';
import { LogService } from '../services/log.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
})
export class HomePage implements OnInit, OnDestroy {
  state: boolean;
  connected: boolean;

  stateSubscription: Subscription;
  connectedSubscription: Subscription;

  constructor(
    private bt: BtService,
    private zone: NgZone,
    private router: Router,
    private alertCtrl: AlertController,
    private logger: LogService,
    private translate: TranslateService,
  ) {
    this.state = false;
    this.connected = false;
  }
  
  /**
   * ngOnInit
   * 
   * when the component starts, fires some subscriptions for get the state and connection of bluetooth device are set up
   */
  ngOnInit(): void {
    this.stateSubscription = this.bt.state$.subscribe((res) => {
      this.logger.messageConsole(`stateBT: ${res}`, this.constructor.name);
      this.zone.run(() => {
        this.state = res;
      });      
    });
    this.connectedSubscription = this.bt.connected$.subscribe((res) => {
      this.logger.messageConsole(`connectedBT: ${res}`, this.constructor.name);      
      this.zone.run(() => {
        this.connected = res;
      });
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
   * ionViewDidEnter
   * 
   * when the page finish entering, must check the state and connection of the bluetooth device
   */
  ionViewDidEnter(): void {
    this.bt.stateBT();
    this.bt.connectedBT();
  }

  /**
   * enableBT
   * 
   * calls the method to check if the bluetoot device is enabled or not
   */
  enableBT(): void {
    this.bt.enableBT();
  }

  /**
   * goTo
   * 
   * navigates to a page of the app
   * @param {string} destination identification in the routing table of the destination
   */
  goTo(destination: string): void {
    this.zone.run(() => this.router.navigate([destination]));
  }

  /**
   * disconnectDevice
   * 
   * opens a dialog box about disconnect the bluetooth device and manages the answer
   */
  async disconnectDevice(): Promise<any> {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('common.disconnect'),
      subHeader: this.translate.instant('common.confirm'),
      message: this.translate.instant('home.disconnect'),
      buttons: [
        {
          text: this.translate.instant('common.cancel'),
          role: "cancel",
        },
        {
          text: this.translate.instant('common.ok'),
          handler: () => {
            this.bt.disconnectDevice();              
          },
        },
      ],
    });
    await alert.present();
  }
}