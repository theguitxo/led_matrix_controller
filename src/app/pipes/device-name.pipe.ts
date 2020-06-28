import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceName'
})
export class DeviceNamePipe implements PipeTransform {

  /**
   * transform
   * 
   * receives a string and returns another according the received
   * @param {string} value string to check, mustn't be undefined either have an empty value
   * @returns 'No name' if isn't defined or is empty, otherwise, the received value
   */
  transform(value: any): string {
    return (value === undefined || value === '') ? 'No name' : value;
  }

}
