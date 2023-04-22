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
Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 0;    // variable to store the servo position

#define LED1 27
#define RED_PIN 26
#define GREEN_PIN 25
#define BLUE_PIN 33
#define servoPin 32

/* 1. Define the WiFi credentials */
#define WIFI_SSID "IEEE"
#define WIFI_PASSWORD "Ilovesolder"

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

int a, b, x, y, status;


void setup() {
  myservo.attach(32);  // attaches the servo on pin 9 to the servo object
	// Allow allocation of all timers
	ESP32PWM::allocateTimer(0);
	ESP32PWM::allocateTimer(1);
	ESP32PWM::allocateTimer(2);
	ESP32PWM::allocateTimer(3);
	myservo.setPeriodHertz(50);    // standard 50 hz servo
	myservo.attach(servoPin, 1000, 2000); // attaches the servo on pin 18 to the servo object
	// using default min/max of 1000us and 2000us
	// different servos may require different min/max settings
	// for an accurate 0 to 180 sweep

  pinMode(LED1, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  Serial.begin(115200);
  delay(2000);
  digitalWrite(LED1, HIGH);
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

  x = random(0, 9);
  y = random(10, 19);

  if (Firebase.ready()) {

    //Firebase.setInt(fbdo, main, 5);
    Firebase.setInt(fbdo, "/test/a", x);
    Firebase.setInt(fbdo, "/test/b", y);
    delay(200);

    Serial.printf("Get int status--  %s\n", Firebase.getInt(fbdo, "/status") ? String(fbdo.to<int>()).c_str() : fbdo.errorReason().c_str());
    status = fbdo.to<int>();
    Serial.printf("Get int a--  %s\n", Firebase.getInt(fbdo, "/test/a") ? String(fbdo.to<int>()).c_str() : fbdo.errorReason().c_str());
    a = fbdo.to<int>();
    Serial.printf("Get int b--  %s\n", Firebase.getInt(fbdo, "/test/b") ? String(fbdo.to<int>()).c_str() : fbdo.errorReason().c_str());
    b = fbdo.to<int>();

    if (status == 1) {
      digitalWrite(LED1, HIGH);
      digitalWrite(RED_PIN, HIGH);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, LOW);
      pos = 0;
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
    }
    else {
      digitalWrite(LED1, LOW);
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, HIGH);
      pos = 180;
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
    }

    Serial.println();
    Serial.print("a:");
    Serial.print(a);
    Serial.print("  b: ");
    Serial.print(b);
    Serial.print("  status: ");
    Serial.print(status);

    Serial.println();
    Serial.println("------------------");
    Serial.println();


    delay(2500);
  }
}