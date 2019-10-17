/*
* IoT Hub Philips Hue NodeJS - Microsoft Sample Code - Copyright (c) 2018 - Licensed MIT
*/
'use strict';

const fs = require('fs');
const path = require('path');

const HueHttpAPI = require('./HueHttpAPI.js');

const Client = require('azure-iot-device').Client;
const ConnectionString = require('azure-iot-device').ConnectionString;
const Message = require('azure-iot-device').Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;

// DPS and connection stuff

const iotHubTransport = require('azure-iot-device-mqtt').Mqtt;

var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

var provisioningHost = 'global.azure-devices-provisioning.net';

const MINIMUM_LIGHT = 1;
const MAXIMUM_LIGHT = 50;

const MINIMUM_GROUP = 0;
const MAXIMUM_GROUP = 50;

var hue;

var client;
var config;

var sendingMessage = true;

function onGetLights(request, response) {
	sendingMessage = true;

	if (config.infoMethods)
		console.info("GetLights...");

	hue.GetLights(function (error, data) {
		if (error) {
			response.send(400, 'Unable to GetLights : ' + error, function (err) {
				if (err) {
					console.error('Unable to respond to GetLights method request');
				}
			});
		}
		else {
			response.send(200, JSON.stringify(data), function (err) {
				if (err) {
					console.error('Unable to respond to GetLights method request');
				}
			});
		}
	});

}

function onGetGroups(request, response) {
	sendingMessage = true;

	if (config.infoMethods)
		console.info("GetGroups...");

	hue.GetGroups(function (error, data) {
		if (error) {
			response.send(400, 'Unable to GetGroups : ' + error, function (err) {
				if (err) {
					console.error('Unable to respond to GetGroups method request');
				}
			});
		}
		else {
			response.send(200, JSON.stringify(data), function (err) {
				if (err) {
					console.error('Unable to respond to GetGroups method request');
				}
			});
		}
	});

}

function convertPayload(request) {
	if(typeof(request.payload) == "string") {
		try {
			request.payload = JSON.parse(request.payload);
		}
		catch(e) {

		}
	}
}

function onTurnOn(request, response) {
	sendingMessage = true;

	convertPayload(request);

	var light = request.payload.light;

	if (config.infoMethods)
		console.info("TurnOn : light = " + light);

	if (light !== undefined && light >= MINIMUM_LIGHT && light <= MAXIMUM_LIGHT) {
		hue.TurnOn(light, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set light : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to TurnOn method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Turned On Light ' + light, function (err) {
					if (err) {
						console.error('Unable to respond to TurnOn method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid light', function (err) {
			if (err) {
				console.error('Unable to respond to TurnOn method request');
			}
		});
	}
}

function onTurnOff(request, response) {
	sendingMessage = true;

	convertPayload(request);

	var light = request.payload.light;

	if (config.infoMethods)
		console.info("TurnOff : light = " + light);

	if (light !== undefined && light >= MINIMUM_LIGHT && light <= MAXIMUM_LIGHT) {
		hue.TurnOff(light, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set light : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to TurnOff method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Turned Off Light ' + light, function (err) {
					if (err) {
						console.error('Unable to respond to TurnOff method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid light', function (err) {
			if (err) {
				console.error('Unable to respond to TurnOff method request');
			}
		});
	}
}

function onSetBrightness(request, response) {
	sendingMessage = true;

	convertPayload(request);

	var light = request.payload.light;
	var brightness = request.payload.brightness;

	if (config.infoMethods)
		console.info("Brightness : light = " + light + " brightness " + brightness);

	if (light !== undefined && light >= MINIMUM_LIGHT && light <= MAXIMUM_LIGHT) {
		hue.SetBrightness(light, brightness, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set light : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to SetBrightness method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Set Brightness On Light ' + light, function (err) {
					if (err) {
						console.error('Unable to respond to SetBrightness method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid light', function (err) {
			if (err) {
				console.error('Unable to respond to SetBrightness method request');
			}
		});
	}
}

function onSetHSV(request, response) {
	sendingMessage = true;

	convertPayload(request);

	var light = request.payload.light;
	var h = request.payload.h;
	var s = request.payload.s;
	var v = request.payload.v;

	if (config.infoMethods)
		console.info("HSV : light = " + light);

	if (light !== undefined && light >= MINIMUM_LIGHT && light <= MAXIMUM_LIGHT) {
		hue.SetHSV(light, h, s, v, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set light : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to SetHSV method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Set HSV On Light ' + light, function (err) {
					if (err) {
						console.error('Unable to respond to SetHSV method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid light', function (err) {
			if (err) {
				console.error('Unable to respond to SetHSV method request');
			}
		});
	}
}

function onSetRGB(request, response) {
	sendingMessage = true;

	convertPayload(request);
	
	var light = request.payload.light;
	var r = request.payload.r;
	var g = request.payload.g;
	var b = request.payload.b;

	if (config.infoMethods)
		console.info("RGB : light = " + light);

	if (light !== undefined && light >= MINIMUM_LIGHT && light <= MAXIMUM_LIGHT) {
		hue.SetRGB(light, r, g, b, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set light : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to SetRGB method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Set RGB On Light ' + light, function (err) {
					if (err) {
						console.error('Unable to respond to SetRGB method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid light', function (err) {
			if (err) {
				console.error('Unable to respond to SetRGB method request');
			}
		});
	}
}

function onTurnGroupOn(request, response) {
	sendingMessage = true;

	convertPayload(request);
	
	var group = request.payload.group;

	if (config.infoMethods)
		console.info("TurnGroupOn : group = " + group);

	if (group !== undefined && group >= MINIMUM_GROUP && group <= MAXIMUM_GROUP) {
		hue.TurnGroupOn(group, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set group : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to TurnOn method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Turned On Group ' + group, function (err) {
					if (err) {
						console.error('Unable to respond to TurnGroupOn method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid group', function (err) {
			if (err) {
				console.error('Unable to respond to TurnGroupOn method request');
			}
		});
	}
}

function onTurnGroupOff(request, response) {
	sendingMessage = true;

	convertPayload(request);
	
	var group = request.payload.group;

	if (config.infoMethods)
		console.info("TurnGroupOff : group = " + group);

	if (group !== undefined && group >= MINIMUM_GROUP && group <= MAXIMUM_GROUP) {
		hue.TurnGroupOff(group, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set group : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to TurnGroupOff method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Turned Off Group ' + group, function (err) {
					if (err) {
						console.error('Unable to respond to TurnGroupOff method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid group', function (err) {
			if (err) {
				console.error('Unable to respond to TurnGroupOff method request');
			}
		});
	}
}

function onSetGroupBrightness(request, response) {
	sendingMessage = true;

	convertPayload(request);
	
	var group = request.payload.group;
	var brightness = request.payload.brightness;

	if (config.infoMethods)
		console.info("Brightness : group = " + group + " brightness " + brightness);

	if (group !== undefined && group >= MINIMUM_GROUP && group <= MAXIMUM_GROUP) {
		hue.SetGroupBrightness(group, brightness, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set group : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to SetGroupBrightness method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Set Brightness On Group ' + group, function (err) {
					if (err) {
						console.error('Unable to respond to SetGroupBrightness method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid group', function (err) {
			if (err) {
				console.error('Unable to respond to SetGroupBrightness method request');
			}
		});
	}
}

function onSetGroupHSV(request, response) {
	sendingMessage = true;

	convertPayload(request);
	
	var group = request.payload.group;
	var h = request.payload.h;
	var s = request.payload.s;
	var v = request.payload.v;

	if (config.infoMethods)
		console.info("HSV : group = " + group);

	if (group !== undefined && group >= MINIMUM_GROUP && group <= MAXIMUM_GROUP) {
		hue.SetGroupHSV(group, h, s, v, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set group : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to SetGroupHSV method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Set HSV On Group ' + group, function (err) {
					if (err) {
						console.error('Unable to respond to SetGroupHSV method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid group', function (err) {
			if (err) {
				console.error('Unable to respond to SetGroupHSV method request');
			}
		});
	}
}

function onSetGroupRGB(request, response) {
	sendingMessage = true;

	convertPayload(request);
	
	var group = request.payload.group;
	var r = request.payload.r;
	var g = request.payload.g;
	var b = request.payload.b;

	if (config.infoMethods)
		console.info("RGB : group = " + group);

	if (group !== undefined && group >= MINIMUM_GROUP && group <= MAXIMUM_GROUP) {
		hue.SetGroupRGB(group, r, g, b, function (error, data) {
			if (error) {
				response.send(400, 'Unable to set group : ' + error, function (err) {
					if (err) {
						console.error('Unable to respond to SetGroupRGB method request');
					}
				});
			}
			else {
				response.send(200, 'Successfully Set RGB On Group ' + group, function (err) {
					if (err) {
						console.error('Unable to respond to SetGroupRGB method request');
					}
				});
			}
		});

	}
	else {
		response.send(400, 'Invalid group', function (err) {
			if (err) {
				console.error('Unable to respond to SetGroupRGB method request');
			}
		});
	}
}

function onStart(request, response) {
	if (config.infoMethods)
		console.info('Try to invoke method start(' + request.payload || '' + ')');

	sendingMessage = true;

	convertPayload(request);
	
	response.send(200, 'Successully start sending message to cloud', function (err) {
		if (err) {
			console.error('[IoT hub Client] Failed sending a method response:\n' + err.message);
		}
	});
}

function onStop(request, response) {
	if (config.infoMethods)
		console.info('Try to invoke method stop(' + request.payload || '' + ')')

	sendingMessage = false;

	convertPayload(request);
	
	response.send(200, 'Successfully stop sending message to cloud', function (err) {
		if (err) {
			console.error('[IoT hub Client] Failed sending a method response:\n' + err.message);
		}
	});
}

function onReceiveMessage(msg) {
	var message = msg.getData().toString('utf-8');

	client.complete(msg, () => {
		if (config.infoInboundMessages)
			console.info('Incoming Message Received');

		if (config.debugInboundMessages)
			console.debug(message);
	});
}

function initializeBindings() {
	// Set C2D and device method callback handlers
	
	client.onDeviceMethod('start', onStart);
	client.onDeviceMethod('stop', onStop);

	client.onDeviceMethod('GetLights', onGetLights);
	client.onDeviceMethod('GetGroups', onGetGroups);

	client.onDeviceMethod('TurnOn', onTurnOn);
	client.onDeviceMethod('TurnOff', onTurnOff);
	client.onDeviceMethod('SetBrightness', onSetBrightness);
	client.onDeviceMethod('SetHSV', onSetHSV);
	client.onDeviceMethod('SetRGB', onSetRGB);

	client.onDeviceMethod('TurnGroupOn', onTurnGroupOn);
	client.onDeviceMethod('TurnGroupOff', onTurnGroupOff);
	client.onDeviceMethod('SetGroupBrightness', onSetGroupBrightness);
	client.onDeviceMethod('SetGroupHSV', onSetGroupHSV);
	client.onDeviceMethod('SetGroupRGB', onSetGroupRGB);

	client.on('message', onReceiveMessage);
}

function updateLightConfiguration() {
						
	if (config.infoConfigurationSync)
		console.info("Syncing Device Twin...");

	client.getTwin((err, twin) => {

		if (err) {
			console.error("Get twin message error : " + err);
			return;
		}

		if (config.debugConfigurationSync) {
			console.debug("Desired:");
			console.debug(JSON.stringify(twin.properties.desired));
			console.debug("Reported:");
			console.debug(JSON.stringify(twin.properties.reported));
		}

		hue.GetLights(function (error, lights) {
			if (error) {
				console.error('Unable to get list of lights');
			}
			else {
				if (config.debugConfigurationSync)
					console.debug("Read Lights: " + JSON.stringify(lights));

				hue.GetGroups(function (error, groups) {
					if (error) {
						console.error('Unable to get list of groups');
					}
					else {
						if (config.debugConfigurationSync)
							console.debug("Read Groups: " + JSON.stringify(groups));

						var hadLightChange = false;
						var hadGroupChange = false;

						var twinUpdate = {};
						var twinLightUpdate = { "lights": {} };
						var twinGroupUpdate = { "groups": {} };

						var light;

						for (var light in lights) {
							var newLight = lights[light];
							var oldLight = (twin.properties.reported.lights == undefined) ? undefined : twin.properties.reported.lights[light];

							if (oldLight == undefined) {
								if (config.infoConfigurationSync)
									console.info("New light [" + light + "] discovered...");

								hadLightChange = true;
								twinLightUpdate.lights[light] = { "name": newLight.name, "type": newLight.type };
							}
							else {
								if (newLight.name != oldLight.name || newLight.type != oldLight.type) {
									if (config.infoConfigurationSync)
										console.info("Light [" + light + "] configuration changed...");

									hadLightChange = true;
									twinLightUpdate.lights[light] = { "name": newLight.name, "type": newLight.type };
								}
							}
						}

						var group;

						for (var group in groups) {
							var newGroup = groups[group];
							var oldGroup = (twin.properties.reported.groups == undefined) ? undefined : twin.properties.reported.groups[group];

							if (oldGroup == undefined) {
								if (config.infoConfigurationSync)
									console.info("New group [" + group + "] discovered...");

								hadGroupChange = true;
								twinGroupUpdate.groups[group] = { "name": newGroup.name, "type": newGroup.type };
							}
							else {
								if (newGroup.name != oldGroup.name || newGroup.type != oldGroup.type) {
									if (config.infoConfigurationSync)
										console.info("Group [" + group + "] configuration changed...");

									hadGroupChange = true;
									twinGroupUpdate.groups[group] = { "name": newGroup.name, "type": newGroup.type };
								}
							}
						}

						if (hadLightChange || hadGroupChange) {
							if (hadLightChange) {
								twinUpdate["lights"] = twinLightUpdate["lights"];
							}

							if (hadGroupChange) {
								twinUpdate["groups"] = twinGroupUpdate["groups"];
							}

							if (config.infoConfigurationSync)
								console.info("Updating device twin...");

							// Update the device twin

							twin.properties.reported.update(twinUpdate, function (err) {
								if (err) {
									console.error("Unable To Update Device Twin : " + err)
								}

								if (config.infoConfigurationSync)
									console.info("Device Twin Updated");
							});
						}
					}
				});
			}
		});
	});
}

function initClient(connectionStringParam, credentialPath) {
	// Start the device (connect it to Azure IoT Central).
	try {

		var provisioningSecurityClient = new SymmetricKeySecurityClient(config.deviceId, config.symmetricKey);
		var provisioningClient = ProvisioningDeviceClient.create(provisioningHost, config.idScope, new ProvisioningTransport(), provisioningSecurityClient);

		provisioningClient.register((err, result) => {
			if (err) {
				console.log('error registering device: ' + err);
			} else {
				console.log('registration succeeded');
				console.log('assigned hub=' + result.assignedHub);
				console.log('deviceId=' + result.deviceId);

				var connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + config.symmetricKey;
				client = Client.fromConnectionString(connectionString, iotHubTransport);
			
				client.open((err) => {
					if (err) {
						console.error('[IoT hub Client] Connect error: ' + err.message);
						return;
					}
					else {
						console.log('[IoT hub Client] Connected Successfully');
					}

					initializeBindings();

					setInterval(() => {
						updateLightConfiguration();
					}, config.interval);
				
				});
			}
		});
	}
	catch(err) {
		console.log(err);
	}
}

// Read in configuration from config.json

try {
	config = require('./config.json');
} catch (err) {
	console.error('Failed to load config.json: ' + err.message);
	return;
}

// Initialize Hue API handler

hue = new HueHttpAPI();

hue.setUseHTTPS(false);

hue.setUser(config.userName);
hue.setHost(config.hubAddress);

// Initialize Azure IoT Client

initClient();
