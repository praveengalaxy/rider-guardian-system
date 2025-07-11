#include <Wire.h>
#include <SoftwareSerial.h>
#include <MPU6050.h>
#include <TinyGPSPlus.h>

// === Pin Definitions ===
const int alcoholPin = A0;
const int heartPin = A1;
const int trigPin = 8;
const int echoPin = 9;
const int GPS_RX = 4;
const int GPS_TX = 3;
const int switchPin = 2;          // Rocker switch input
const int relayPin = 5;           // Relay control for motor
const int buzzerPin = 6;          // Buzzer control

// === Sensor Objects ===
MPU6050 mpu;
TinyGPSPlus gps;
SoftwareSerial gpsSerial(GPS_RX, GPS_TX);

// === Variables ===
long duration;
float distance;
bool deviceActive = false;           // True when switch ON
bool backendMotorAllowed = true;     // True when backend allows motor ON
String incomingCommand = "";

void setup() {
  Serial.begin(9600);
  gpsSerial.begin(9600);
  Wire.begin();
  mpu.initialize();

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(switchPin, INPUT_PULLUP);
  pinMode(relayPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  digitalWrite(relayPin, LOW);
  digitalWrite(buzzerPin, LOW);

  delay(1000);
}

void loop() {
  // === 0. Read switch state ===
  bool switchState = digitalRead(switchPin) == LOW;

  if (switchState && !deviceActive) {
    deviceActive = true;
    Serial.println("ACTIVATE");

    // Start motor only if backend allows
    if (backendMotorAllowed) {
      digitalWrite(relayPin, HIGH);
    }
  } 
  else if (!switchState && deviceActive) {
    deviceActive = false;
    Serial.println("DEACTIVATE");

    // Motor & buzzer off on switch OFF
    digitalWrite(relayPin, LOW);
    digitalWrite(buzzerPin, LOW);
  }

  // === 1. Handle backend commands via Serial ===
  if (Serial.available()) {
    incomingCommand = Serial.readStringUntil('\n');
    handleCommand(incomingCommand);
  }

  // === 2. Send sensor data only if active ===
  if (deviceActive) {
    int alcoholVal = analogRead(alcoholPin);
    int heartVal = analogRead(heartPin);

    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    int helmetWorn = (distance > 2 && distance < 10) ? 1 : 0;

    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

    while (gpsSerial.available()) {
      gps.encode(gpsSerial.read());
    }
    double latitude = gps.location.isValid() ? gps.location.lat() : 0.0;
    double longitude = gps.location.isValid() ? gps.location.lng() : 0.0;

    Serial.print("STATUS:ON,ALC:");
    Serial.print(alcoholVal);
    Serial.print(",HEART:");
    Serial.print(heartVal);
    Serial.print(",HELMET:");
    Serial.print(helmetWorn);
    Serial.print(",AX:");
    Serial.print(ax);
    Serial.print(",AY:");
    Serial.print(ay);
    Serial.print(",AZ:");
    Serial.print(az);
    Serial.print(",LAT:");
    Serial.print(latitude, 6);
    Serial.print(",LON:");
    Serial.println(longitude, 6);
  } 
  else {
    Serial.println("STATUS:OFF");
  }

  delay(1000);
}

void handleCommand(String cmd) {
  cmd.trim();

  if (cmd == "MOTOR:STOP") {
    backendMotorAllowed = false;
    digitalWrite(relayPin, LOW);
  } 
  else if (cmd == "MOTOR:START") {
    backendMotorAllowed = true;
    if (deviceActive) {
      digitalWrite(relayPin, HIGH);
    }
  } 
  else if (cmd == "BUZZER:ON") {
    digitalWrite(buzzerPin, HIGH);
  } 
  else if (cmd == "BUZZER:OFF") {
    digitalWrite(buzzerPin, LOW);
  }

  Serial.println("ACK:" + cmd);
}
