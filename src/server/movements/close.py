from   time     import sleep
import string
import RPi.GPIO as     GPIO

STEPS_PER_REV = 200
DIR_PIN       = 17
DRIVE_PIN     = 18
ENABLE_PIN    = 27
ENDSTOP       = 23

GPIO.setmode(GPIO.BCM)
GPIO.setup(DIR_PIN,    GPIO.OUT)
GPIO.setup(DRIVE_PIN,  GPIO.OUT)
GPIO.setup(ENABLE_PIN, GPIO.OUT)

GPIO.setup(ENDSTOP, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.output(DIR_PIN,    0)
GPIO.output(ENABLE_PIN, 0)

steps = 200 * ( 95 / 2 )

def close():
	print "Closing : )"

	GPIO.output(DIR_PIN, 1)

	for i in range(0, steps):

		step(.00150)

def step(pause):
	GPIO.output(DRIVE_PIN, 1)
	sleep(pause)
	GPIO.output(DRIVE_PIN, 0)

close()
