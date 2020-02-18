import { DeviceNamePipe } from './device-name.pipe';

describe('DeviceNamePipe', () => {
  it('create an instance', () => {
    const pipe = new DeviceNamePipe();
    expect(pipe).toBeTruthy();
  });
});
