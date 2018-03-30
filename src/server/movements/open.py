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

def open():
	print "Finding endstop : )"
	global found
	found = 0

	def closed(channel):
		global found
		found += 1

	GPIO.output(DIR_PIN, 0)
	GPIO.add_event_detect(ENDSTOP, GPIO.FALLING, callback=closed)

	while True:
		if found > 0:
			GPIO.remove_event_detect(ENDSTOP)
			backOff()
			break

		step(.00150)

	GPIO.remove_event_detect(ENDSTOP)

def backOff():
	print "Backing off : )"
	global found
	found = 0

	def closed(channel):
		global found
		found += 1
		print "back off closed %s" % (found)

	GPIO.add_event_detect(ENDSTOP, GPIO.FALLING, callback=closed)

	GPIO.output(DIR_PIN, 1)

	for i in range(0, 600):
		step(.00150)

	GPIO.output(DIR_PIN, 0)
	print "Finding endstop again..."
	found = 0
	while 1:

		if found > 0:
			print "Really found na0 : )"
			break

		step(.00150)

def step(pause):
	GPIO.output(DRIVE_PIN, 1)
	sleep(pause)
	GPIO.output(DRIVE_PIN, 0)

open()
