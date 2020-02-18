import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BtDevice } from '../interfaces/bt-device';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.page.html',
  styleUrls: ['./devices-list.page.scss'],
})
export class DevicesListPage implements OnInit {

  // list of unpaired devices
  unpaired: Array<BtDevice>;

  // object that shows a spinner while loading data or execute actions
  loadingObject: any;

  // for control if list is loaded and if an error has been occurred
  listLoaded: boolean;
  errorListing: boolean;

  /**
   * constructor
   * @param router 
   * @param btSerial 
   * @param loadingCtrl 
   * @param zone 
   */
  constructor(
    private router: Router,
    private btSerial: BluetoothSerial,
    private loadingCtrl: LoadingController,
    private zone: NgZone
  ) { }

  /**
   * ngOnInit
   * (Angular lifecycle)
   * @description inits the properties used in the search of unpaired devices and
   *              it subscribes to the event when an unpaired device is found
   */
  ngOnInit(): void {
    this.initListProperties();

    this.btSerial.setDeviceDiscoveredListener().subscribe(
      (current: BtDevice) => {
        // checks if the device discovered is already included
        // in the list of discovered unpaired devices, if not, includes it
        const found = this.unpaired.find(element => element.id === current.id);
        if (found === undefined) {
          this.unpaired.push(current);
        }
      }
    );
  }

  /**
   * ionViewDidEnter
   * (Inoic lifecycle)
   * @description calls the function that search devices that aren't paired
   */
  ionViewDidEnter(): void {
    this.discoverUnpaired();
  }

  /**
   * ionViewWillLeave
   * (Ionic lifecycle)
   * @description kills any loader that still are been working
   */
  ionViewWillLeave(): void {
    this.loadingObject.dismiss();
  }

  /**
   * returnHome
   * @description used to return to home page when user clicks over 'Cancel' button
   */
  returnHome(): void {
    this.router.navigate(['/home']);
  }

  /**
   * initListProperties
   * @description initialize the propierties used in the search of unpaired devices
   */
  initListProperties(): void {
    this.unpaired = [];
    this.listLoaded = false;
    this.errorListing = false;
  }

  /**
   * showUnpairedList
   * @description checks if the page must shows or not the list of unpaired devices
   * @returns boolean
   */
  showUnpairedList(): boolean {
    return (this.listLoaded && !this.errorListing);
  }

  /**
   * discoverUnpaired
   * @description gets the list of unpaired devices
   */
  discoverUnpaired(): void {
    this.initListProperties();
    this.showLoading('Getting devices...');

    this.btSerial.discoverUnpaired()
      .then((device) => {
        console.log(this.unpaired);
      })
      .catch((error) => {
        alert(`Error searching devices: ${error}`);
        this.errorListing = true;
      })
      .finally(() => {
        this.hideLoading();
        this.listLoaded = true;
      });
  }

  /**
   * connectDevice
   * @description tries to connect a devices, if it's success, navigates to home, if not, shows an alert message
   * @param address address of the device to connect
   */
  connectDevice(address): void {
    this.showLoading('Connecting device...');

    this.btSerial.connect(address).subscribe(
      () => {
        this.zone.run(async () => await this.router.navigate(['/home']));
      },
      () => {
        alert(`Error connecting device`);
        this.hideLoading();
      }
    );
  }

  /**
   * showLoading
   * @param message 
   * @param translucent 
   */
  async showLoading(message: string, translucent: boolean = true): Promise<any> {
    this.loadingObject = await this.loadingCtrl.create({
      spinner: 'circular',
      message,
      translucent
    });
    await this.loadingObject.present();
  }

  /**
   * hideLoading
   */
  hideLoading(): void {
    this.loadingObject.dismiss();
  }
}
