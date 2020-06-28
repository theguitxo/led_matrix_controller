# Mobile app for control a led matrix controller

This is a mobile app programmed with Ionic to control a led matrix connected to an Arduino board, through the Bluetooth connection.

## Connections schema

![Connections schema](https://raw.githubusercontent.com/theguitxo/led_matrix_controller/master/esquema.png)

[Fritzing file](https://github.com/theguitxo/led_matrix_controller/blob/master/esquema.fzz?raw=true)

## Arduino sketch

This is the sketch to upload to the Arduino board.

[Arduino Sketch](https://raw.githubusercontent.com/theguitxo/led_matrix_controller/master/arduino.sketch.ino)

## Run the app

After cloning the project you must install the depedencies with the npm command:

`npm i`

Connect an Android device to the computer with the developer and debug options activated and run this command:

`npm run debug-android`

The app will be launch in the phone

## iOS

The project has the Android platform, for build to  iOS must add their platform, build it and install into an iOS device.