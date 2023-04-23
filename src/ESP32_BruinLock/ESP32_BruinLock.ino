#if defined(ESP32)
#include <WiFi.h>
#include <FirebaseESP32.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#endif

//Provide the token generation process info.
#include <addons/TokenHelper.h>

//Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

#include <ESP32Servo.h> 
Servo servo1;
Servo servo2;
// Published values for SG90 servos; adjust if needed
int minUs = 1000;
int maxUs = 2000;


#define GREEN_PIN2 26
#define RED_PIN2 33
#define GREEN_PIN 27
#define RED_PIN 25
int servo1Pin = 32;
int servo2Pin = 14;

int pos = 0;      // position in degrees
int pos2 = 0;      // position in degrees
ESP32PWM pwm;

/* 1. Define the WiFi credentials */
#define WIFI_SSID "UCLA_WEB"
#define WIFI_PASSWORD ""

//For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

/* 2. Define the API Key */
#define API_KEY "AIzaSyB2ZuJc9EMZJw7tZsAl83pLeOifhd9WDKI"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://bruinlocks-default-rtdb.firebaseio.com/"  //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

String main = "";

int status, status2;

void setup() {
	// Allow allocation of all timers
	ESP32PWM::allocateTimer(0);
	ESP32PWM::allocateTimer(1);
	ESP32PWM::allocateTimer(2);
	ESP32PWM::allocateTimer(3);
	servo1.setPeriodHertz(50);      // Standard 50hz servo
	servo2.setPeriodHertz(50);      // Standard 50hz servo

  pinMode(GREEN_PIN, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN2, OUTPUT);
  pinMode(RED_PIN2, OUTPUT);
  Serial.begin(115200);
  delay(2000);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  config.database_url = DATABASE_URL;

  //////////////////////////////////////////////////////////////////////////////////////////////
  //Please make sure the device free Heap is not lower than 80 k for ESP32 and 10 k for ESP8266,
  //otherwise the SSL connection will fail.
  //////////////////////////////////////////////////////////////////////////////////////////////

  Firebase.begin(DATABASE_URL, API_KEY);

  //Comment or pass false value when WiFi reconnection will control by your code or third party library
  // Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);
}

void loop() {

  if (Firebase.ready()) {

    servo1.attach(servo1Pin, minUs, maxUs);
	  servo2.attach(servo2Pin, minUs, maxUs);

    Serial.printf("Get int status--  %s\n", Firebase.getInt(fbdo, "/status") ? String(fbdo.to<int>()).c_str() : fbdo.errorReason().c_str());
    status = fbdo.to<int>();
    Serial.printf("Get int status2--  %s\n", Firebase.getInt(fbdo, "/status2") ? String(fbdo.to<int>()).c_str() : fbdo.errorReason().c_str());
    status2 = fbdo.to<int>();

    if (status == 1) {
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(RED_PIN, LOW);
      // servo1.write(0);              // tell servo to go to position in variable 'pos'
      for (; pos <= 180; pos += 1) { // sweep from 0 degrees to 180 degrees
        // in steps of 1 degree
        servo1.write(pos);
        delay(5);             // waits 20ms for the servo to reach the position
      }
    }
    else {
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(RED_PIN, HIGH);
      // servo1.write(180);              // tell servo to go to position in variable 'pos'
      for (; pos >= 0; pos -= 1) { // sweep from 180 degrees to 0 degrees
        servo1.write(pos);
        delay(5);
      }
    }

    if (status2 == 1) {
      digitalWrite(GREEN_PIN2, HIGH);
      digitalWrite(RED_PIN2, LOW);
      // servo2.write(0);             // tell servo to go to position in variable 'pos'
      for (; pos2 <= 180; pos2 += 1) { // sweep from 0 degrees to 180 degrees
        // in steps of 1 degree
        servo2.write(pos2);
        delay(5);             // waits 20ms for the servo to reach the position
      }

    }
    else {
      digitalWrite(GREEN_PIN2, LOW);
      digitalWrite(RED_PIN2, HIGH);
      // servo2.write(180);              // tell servo to go to position in variable 'pos'
      for (; pos2 >= 0; pos2 -= 1) { // sweep from 180 degrees to 0 degrees
        servo2.write(pos2);
        delay(5);
      }
    }
    

    Serial.println();
    Serial.print("status:");
    Serial.print(status);
    Serial.print("  status2: ");
    Serial.print(status2);

    Serial.println();
    Serial.println("------------------");
    Serial.println();

    servo1.detach();
    servo2.detach();

    delay(2500);
  }
}