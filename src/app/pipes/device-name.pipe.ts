import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceName'
})
export class DeviceNamePipe implements PipeTransform {

  transform(value: any): string {
    return (value === undefined || value === '') ? 'No name' : value;
  }

}
