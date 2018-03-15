import RPi.GPIO as GPIO

ENABLE_PIN = 27

GPIO.setmode(GPIO.BCM)
GPIO.setup(  ENABLE_PIN, GPIO.OUT)

print "Releasing"
GPIO.output(ENABLE_PIN, 1)
#  GPIO.cleanup()
