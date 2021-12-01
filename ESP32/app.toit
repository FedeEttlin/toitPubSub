import gpio
import pubsub

INCOMING_TOPIC ::= "cloud:mensajes"

main:
    led := gpio.Pin 23 --output
  
    pubsub.subscribe INCOMING_TOPIC --auto_acknowledge: | msg/pubsub.Message |
        texto := msg.payload.to_string
        print texto

        if texto == "on":
            led.set 1
        else:
            led.set 0