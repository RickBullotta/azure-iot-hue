---
services: iot-hub, iot-central
platforms: Nodejs
author: rickb
---

# Azure IoT Hub/IoT Central Philips Hue Interface

This utilizes the Azure IoT Node.js SDK to connect to the Philips Hue lighting system

# How To Run This Device Connector 

Launch index.js with a single parameter, which is the connection string generated from IoT Hub or IoT Central.  Note that when using IoT Central, you'll need to utilize the dps_cstr utility to generate this connection string.

# How To Configure This Device Connector

In the config.json file, you'll need to provide the IP address of your Philips Hue Hub, along with a userName that was generated on that hub.  Refer to the Hue Developer documentation at https://developers.meethue.com/ for instructions on how to find the IP of your hub and generate a user name/token.

  "hubAddress" : "192.168.1.178"
  "userName" : "aMLiCr4yyDQjFV6bSN5BGoxuuCDuEmVxmePX00AO"

You can also specify how frequently you would like the lighting configuration from the Hue Hub and the Device Twin to be synchronized via the "interval" property in this configuration file.  The interval is expressed in milliseconds.

  "interval": 300000

# Features

This connector allows you to turn on/off individual lights, groups of lights, and set their color and brightness (individually or in groups).  These capabilities are exposed as device methods/commands.  Also, this connector will periodically synchronize its device twin with configuration information describing the specific lights and groups defined on your Hue hub.



