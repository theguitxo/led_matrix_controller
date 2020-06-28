import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  // object that shows a spinner while loading data or execute actions
  loadingObject: any;

  constructor(
    private loadingCtrl: LoadingController
  ) { }

  /**
   * showLoading
   * 
   * show a loading spinner with a message
   * @param {string} message string to show with the spinner
   */
  async showLoading(message: string): Promise<any> {
    this.loadingObject = await this.loadingCtrl.create({
      spinner: 'circular',
      message,
    });
    await this.loadingObject.present();
  }

  /**
   * hideLoading
   * 
   * hides the loading spinner
   */
  async hideLoading(): Promise<any> {
    if (typeof this.loadingObject === 'object') {
      await this.loadingObject.dismiss();
    }
  }
}
