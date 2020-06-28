import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BtDevice } from '../interfaces/bt-device';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs/operators';
import { LogService } from './log.service';
import { Toast } from '@ionic-native/toast/ngx';
import { TranslateService } from '@ngx-translate/core';

const OK_RESPONSE: string = 'OK';

@Injectable({
  providedIn: "root",
})
export class BtService {
  private _state: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private _connected: BehaviorSubject<boolean> = new BehaviorSubject(null);

  private deviceDiscoveredSubscription: Subscription;
  private _unpairedList: Array<BtDevice>;
  private _unpaired: BehaviorSubject<Array<BtDevice>> = new BehaviorSubject(null);

  constructor(
    private btSerial: BluetoothSerial,
    private loading: LoadingService,
    private logger: LogService,
    private toast: Toast,
    private translate: TranslateService,
  ) {}

  get state$(): Observable<boolean> {
    return this._state.asObservable();
  }

  get connected$(): Observable<boolean> {
    return this._connected.asObservable();
  }

  get unpaired$(): Observable<Array<BtDevice>> {
    return this._unpaired.asObservable();
  }

  /**
   * enableBT
   * 
   * tries to enable the bluetooth device
   */
  enableBT(): void {
    this.btSerial
      .enable()
      .then(() => {
        this._state.next(true);
      })
      .catch(() => {
        this._state.next(false);
      });
  }

  /**
   * stateBT
   * 
   * gets the state of the bluetooth device
   */
  stateBT(): void {
    this.logger.messageConsole("called stateBT", this.constructor.name);
    this.btSerial
      .isEnabled()
      .then(() => {
        this._state.next(true);
      })
      .catch(() => {
        this._state.next(false);        
      });
  }

  /**
   * connectedBT
   * 
   * gets if the bluetooth device is connected
   */
  connectedBT(): void {
    this.logger.messageConsole('called connectedBT', this.constructor.name);
    this.btSerial
      .isConnected()
      .then(() => {        
        this._connected.next(true);
      })
      .catch(() => {
        this._connected.next(false);
      });
  }

  /**
   * discoverUnpaired
   */
  async discoverUnpaired(): Promise<any> {
    this.deviceDiscoveredSubscription = this.btSerial
      .setDeviceDiscoveredListener()
      .subscribe((current: BtDevice) => {
        // checks if the device discovered is already included
        // in the list of discovered unpaired devices, if not, includes it
        const found = this._unpairedList.find(
          (element: BtDevice) => element.id === current.id
        );
        if (found === undefined) {
          this._unpairedList.push(current);
        }
      });

    this._unpairedList = [];

    await this.loading.showLoading(this.translate.instant('btService.searchingDevices'));

    this.btSerial
      .discoverUnpaired()
      .then(() => {
        this._unpaired.next(this._unpairedList);
      })
      .catch((error) => {
        this._unpaired.error(error);
      })
      .finally(async () => {
        await this.loading.hideLoading();
        this.deviceDiscoveredSubscription.unsubscribe();
      });
  }

  /**
   * connectDevice
   * 
   * connects a device to the bluetooth
   * @param {string} address address of the device that we want connect
   */
  async connectDevice(address: string): Promise<any> {
    this._connected.next(false);

    await this.loading.showLoading(this.translate.instant('btService.connectingDevice'));
    
    const conn: Subscription = this.btSerial
      .connect(address)
      .pipe(
        finalize(async () => {
          await this.loading.hideLoading();
          conn.unsubscribe();
        })
      )
      .subscribe(
        () => this._connected.next(true),
        (error) => {
          this._connected.next(false);
        }
      );
  }

  /**
   * disconnectDevice
   * 
   * it disconnects a device from the bluetooth
   */
  async disconnectDevice(): Promise<any> {
    await this.loading.showLoading(this.translate.instant('btService.disconnectDevice'));
    let message: string = '';

    try {
      const result = await this.btSerial.disconnect();
      if (result === OK_RESPONSE) {
        message = this.translate.instant('btService.deviceDisconnected');
      } else {
        message = this.translate.instant('btService.errorOnDisconnect');
      }
    } catch(e) {
      message = this.translate.instant('btService.appErrorOnDisconnect');
    } finally {
      this.logger.messageConsole(`disconnect device: ${message}`, this.constructor.name);
      await this.loading.hideLoading();
      this.toast.showShortBottom(message).subscribe(() => this.connectedBT());
    }
  }

  /**
   * sendData
   * 
   * sends a string to the connected device
   * @param {string} data the string to send to the device
   */
  async sendData(data: string): Promise<any> {
    await this.btSerial.write(data);
  }
}
