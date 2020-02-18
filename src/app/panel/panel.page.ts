import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { File } from '@ionic-native/file/ngx';

export interface Panel {
  code: string;
  name: string;
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
})
export class PanelPage implements OnInit {

  panelButtons: Array<Panel>;

  panels: any;

  constructor(
    private btSerial: BluetoothSerial,
    private file: File,
  ) {
    this.panelButtons = [
      { code: "skater", name: "Skater" },
      { code: "dog", name: "Dog" },
      { code: "bird", name: "Bird" },
      { code: "cat", name: "Cat" },
      { code: "smiley", name: "Smiley" },
      { code: "house", name: "House" },
      { code: "alien1", name: "Alien 1" },
      { code: "alien2", name: "Alien 2" },
      { code: "alien3", name: "Alien 3" },
      { code: "ghost", name: "Ghost" },
      { code: "mug", name: "Mug" }
    ];
  }

  ngOnInit() {

    console.log(this.file);
    console.log(this.file.applicationDirectory);
    this.file.readAsDataURL(`${this.file.applicationDirectory}`, `www/assets/panels-data.json`)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
      })
      .finally(() => {
        console.log('finally');
      });

  }

  showPanel(code: string): void {
    this.btSerial
      .write(`${code}\n`)
      .then(() => {
        console.log(`${code} image sended`);
      })
      .catch(() => {
        console.log(`error sending ${code} image`);
      })
      .finally(() => {
        console.log(`${code} process finished`);
      });
  }
}
