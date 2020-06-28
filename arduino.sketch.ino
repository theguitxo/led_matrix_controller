#include <SoftwareSerial.h>
#include <LedControl.h>

LedControl lc = LedControl(12, 11, 10, 1); // DIN, CLK, CS, Device
SoftwareSerial BT(3, 2); // 3 RX, 2 TX
String pictureData = "";

void setup() {  
  BT.begin(9600);  
  lc.setIntensity(0, 2);
  lc.clearDisplay(0);
  lc.shutdown(0, true);
}

void loop() {
  if (BT.available()) {
    char character = BT.read();    
    if (character != '\n') {
      pictureData.concat(character);
    } else {
      action();
    }    
  }
}

void action() {
  if (pictureData == "clean") {
    clean();
  } else {
    draw();
  }
}

void draw() {
  lc.shutdown(0, false);
  lc.clearDisplay(0);
  
  int total = pictureData.length();
  int byLine = (int)sqrt(total);
  for(int i = 0; i < total; i++) {
    boolean data = pictureData.charAt(i) == '1' ? true : false;
    int row = i / byLine;
    int col = i % byLine;
    lc.setLed(0, row, col, data);
  }
  pictureData = "";
}

void clean() {
  lc.clearDisplay(0);
  lc.shutdown(0, true);
  pictureData = "";
}
