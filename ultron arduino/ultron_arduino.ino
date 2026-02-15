/*
  Ultron Security System - Arduino Controller
  Hardware:
  - Servo (Lock mechanism) -> Pin 9
  - 4x4 Keypad -> Pins 2-9 (mapped below)
  
  Protocol:
  - Receive "UNLOCK": Rotate servo to 90
  - Receive "LOCK": Rotate servo to 0
  - Send "KEY:x": When key 'x' is pressed
*/

#include <Servo.h>
#include <Keypad.h>

const byte ROWS = 4; 
const byte COLS = 4; 

char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

// Connect keypad ROW0, ROW1, ROW2, ROW3 to these Arduino pins.
byte rowPins[ROWS] = {2, 3, 4, 5}; 

// Connect keypad COL0, COL1, COL2, COL3 to these Arduino pins.
byte colPins[COLS] = {6, 7, 8, 9}; 

// NOTE: Servo uses Pin 10 to avoid conflict with Keypad on Pin 9
Servo myServo;
const int SERVO_PIN = 10;

Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS); 

String inputString = "";         // a String to hold incoming data
bool stringComplete = false;  // whether the string is complete

void setup() {
  Serial.begin(9600);
  inputString.reserve(200);
  
  myServo.attach(SERVO_PIN);
  myServo.write(0); // Locked position
}

void loop() {
  // 1. Read Keypad
  char customKey = customKeypad.getKey();
  
  if (customKey){
    Serial.print("KEY:");
    Serial.println(customKey);
  }
  
  // 2. Process Serial Commands
  if (stringComplete) {
    inputString.trim();
    if (inputString == "UNLOCK") {
      myServo.write(90);
    } 
    else if (inputString == "LOCK") {
      myServo.write(0);
    }
    
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
}

/*
  SerialEvent occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something with it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}
