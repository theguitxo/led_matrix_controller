import { Injectable } from '@angular/core';

export interface dateValues {
  seconds: string;
  minutes: string;
  hours: string;
  day: string;
  month: string;
  year: string;
};

@Injectable({
  providedIn: "root",
})
export class LogService {
  private dateObj: any;

  constructor() {
    this.dateObj = new Date();
  }

  /**
   * getDateValues
   *
   * gets some values about date and time
   * @returns a dateValues object
   */
  private getDateValues(): dateValues {
    const values: dateValues = {
      seconds: this.addZero(this.dateObj.getSeconds().toString()),
      minutes: this.addZero(this.dateObj.getMinutes().toString()),
      hours: this.addZero(this.dateObj.getHours().toString()),
      day: this.addZero(this.dateObj.getDate().toString()),
      month: this.addZero((this.dateObj.getMonth() + 1).toString()),
      year: this.dateObj.getFullYear(),
    };
    return values;
  }

  /**
   * addZero
   *
   * add a 0 at the beginning of a string
   * @param {string} value string to add the zero
   * @returns a string with the zero added, if it's necessary
   */
  private addZero(value: string): string {
    return `0${value}`.slice(-2);
  }

  /**
   * messageConsole
   *
   * puts a message in the browser console
   * @param {string} message mesagen to show in the console
   * @param {string} component name of the component from where the method is called (optional)
   */
  messageConsole(message: string, component?: string): void {
    const values: dateValues = this.getDateValues();

    const timeString: string = `${values.hours}:${values.minutes}:${values.seconds}`;
    const dateString: string = `${values.day}-${values.month}-${values.year}`;

    const stringParts: string[] = [];

    stringParts.push(`[${dateString} ${timeString}]`);
    if (component !== undefined) {
      stringParts.push(component);
    }
    stringParts.push(message);

    console.log(stringParts.join(" - "));
  }
}
