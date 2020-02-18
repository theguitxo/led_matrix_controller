import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { BtDevice } from '../interfaces/bt-device';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  btIsEnabled: boolean;
  btIsConnected: boolean;

  showingMessage: boolean;

  connected: Array<BtDevice>;

  loading: any;

  constructor(
    private btSerial: BluetoothSerial,
    private toast: ToastController,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.showingMessage = false;
    this.connected = [];
  }

  /**
   * ionViewDidEnter
   */
  ionViewDidEnter() {
    this.btSerial.isConnected().then(
      () => {
        console.log('Bluetooth is connected');
        this.listConnected();
        this.btIsConnected = true;
      },
      () => {
        console.log('Bluetooth isn\'t connected');
        this.btIsConnected = false;
      }
    );
  }

  /**
   * ionViewWillLeave
   */
  ionViewWillLeave() {
    this.removeLoadingSpinner();
  }

  /**
   * toListDevices
   */
  toListDevices(): void {
    this.btSerial.isEnabled().then(
      () => {
        this.router.navigate(['/devices-list']);
      },
      () => {
        this.showToast(`Bluetooth isn't enabled, please enable it`, 2000);
      }
    );
  }

  /**
   * showToast
   * @param message 
   * @param duration 
   */
  async showToast(message: string, duration: number) {
    if(!this.showingMessage) {
      this.showingMessage = true;
      const toast = await this.toast.create({
        message,
        duration,
        showCloseButton: true
      });
      toast.onDidDismiss().then(
        () => {
          this.showingMessage = false;
        }
      );
      toast.present();
    }
  }
  /**
   * listConnected
   */
  async listConnected(): Promise<any> {
    await this.showLoadingSpinner('Loading connected devices');
    this.btSerial.list()
      .then(
        (data) => {
          console.log(data);
          this.connected = data;
          this.removeLoadingSpinner();
        },
        () => {
          this.showToast(`An error has been occurred when listing devices`, 2000);
          this.removeLoadingSpinner();
        }
      );
  }

  /**
   * disconnectDevice
   */
  async disconnectDevice() {
    const alert = await this.alertCtrl.create({
      header: 'Disconnect',
      subHeader: 'Confirm',
      message: 'Are you sure to disconnect the device?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: () => {
            this.handlerDisconnectDevice();
          }
        }
      ]
    });
    await alert.present();

  }

  /**
   * handlerDisconnectDevice
   */
  async handlerDisconnectDevice() {
    await this.showLoadingSpinner('Disconnect device');
    this.btSerial.disconnect().then(
      () => {
        this.btIsConnected = false;
        this.connected = [];
        this.removeLoadingSpinner();
      },
      async () => {
        this.removeLoadingSpinner();
        const errorAlert = await this.alertCtrl.create({
          header: 'Disconnect',
          subHeader: 'Error',
          message: 'An error has been occurred on disconnect the device',
          buttons: ['OK']
        });
        await errorAlert.present();
      }
    );
  }

  /**
   * removeLoadingSpinner
   */
  async removeLoadingSpinner(): Promise<any> {
    if (typeof this.loading === 'object') {
      await this.loading.dismiss();
    }
  }

  /**
   * showLoadingSpinner
   */
  async showLoadingSpinner(message: string): Promise<any> {
    this.loading = await this.loadingCtrl.create({
      spinner: 'circular',
      message,
      translucent: true
    });
    await this.loading.present();
  }
}
