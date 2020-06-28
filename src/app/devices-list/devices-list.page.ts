import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BtDevice } from '../interfaces/bt-device';
import { LoadingService } from '../services/loading.service';
import { Subscription } from 'rxjs';
import { BtService } from '../services/bt.service';
import { LogService } from '../services/log.service';

@Component({
  selector: "app-devices-list",
  templateUrl: "./devices-list.page.html",
})
export class DevicesListPage implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private bt: BtService,
    private zone: NgZone,
    private loading: LoadingService,
    private logger: LogService,
  ) {}

  unpairedList: Array<BtDevice>;

  stateSubscription: Subscription;
  unpairedSubscription: Subscription;
  connectedSubscription: Subscription;

  get haveUnpairedDevices(): boolean {
    return this.unpairedList && this.unpairedList.length > 0;
  }
  
  /**
   * ngOnInit
   * 
   * starts three subscriptions: 
   *  control the unpaired devices discovered by the phone
   *  check the state of the bluetooth
   *  check if the device is connected or not
   */
  ngOnInit(): void {
    this.unpairedSubscription = this.bt.unpaired$.subscribe(
      (res) => {
        this.zone.run(() => this.unpairedList = res);
      },
      (error) => {
        this.logger.messageConsole(`Error: ${error}`, this.constructor.name);
      },
    );
    this.stateSubscription = this.bt.state$.subscribe((res) => {
      this.logger.messageConsole(`stateBT: ${res}`, this.constructor.name);
      if (!res) {
        this.returnHome();
      }
    });    
    this.connectedSubscription = this.bt.connected$.subscribe(      
      (res) => {
        this.logger.messageConsole(`connectedBT: ${res}`, this.constructor.name);
        if (res) {
          this.returnHome();
        }
      },
    );
  }

  /**
   * ngOnDestroy
   *
   * when the component is destroyed, the subscriptions will be removed
   */
  ngOnDestroy(): void {
    this.unpairedSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
    this.connectedSubscription.unsubscribe();
  }

  /**
   * ionViewWillEnter
   * 
   * when the app starts to enter in the page, inits the list of unpaired devices
   * andd checks the state of the bluetooth
   */
  ionViewWillEnter(): void {
    this.bt.stateBT();
    this.unpairedList = [];    
  }

  /**
   * ionViewDidEnter
   * 
   * when the app has been finish to enter in the page, calls the method to discover unpaired devices
   */
  ionViewDidEnter(): void {
    this.discoverUnpaired();
  }
  
  /**
   * ionViewWillLeave
   * 
   * when the app starts to leave the page, removes any possible
   * loading spinner that works for not show in the next page
   */
  ionViewWillLeave(): void {
    this.loading.hideLoading();
  }

  /**
   * discoveredUnpaired
   * 
   * starts the list of unpaired devices and calls the method to discover them
   */
  discoverUnpaired(): void {
    this.unpairedList = [];
    this.bt.discoverUnpaired();
  }

  /**
   * return Home
   * 
   * navigates to the home page
   */
  returnHome(): void {
    this.zone.run(() => this.router.navigate(["/home"]));
  }

  /**
   * connectDevices
   * 
   * tries to connect with a device of the list of discovered devices
   * @param {string} address address of the device to connect
   */
  connectDevice(address): void {
    this.bt.connectDevice(address);
  }
}
