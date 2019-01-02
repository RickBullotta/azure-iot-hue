// External packages required

var request = require('request');
var HueAPIConstants = require('./HueAPIConstants.js');

// Define the HueHttpAPI class

function HueHttpAPI() {
	this.useHTTPS = false;
	this.host = "";
	this.port = 80;
	this.user = "";
	this.trace = false;
}

//Misc functions

isUndefined = function (x) {
	if (x === null) {
		return true;
	}

	if (x === undefined) {
		return true;
	}

	return false;
};

isNonEmpty = function (value) {
	if (value !== undefined && value !== null) {
		return true;
	}
	else {
		return false;
	}
};

// Setters for HTTP connection parameters

HueHttpAPI.prototype.setUser = function (value) {
	this.user = value;
};

HueHttpAPI.prototype.setUseHTTPS = function (value) {
	this.useHTTPS = value;
};

HueHttpAPI.prototype.setHost = function (value) {
	this.host = value;
};

HueHttpAPI.prototype.setPort = function (value) {
	this.port = value;
};

// Hue Query Services

HueHttpAPI.prototype.GetLightInfo = function (light, callback) {
	if (light < 1)
		throw "Invalid Light Number";

	this.invokeLightQuery(callback, light);
}

HueHttpAPI.prototype.GetLights = function (callback) {
	this.invokeLightQuery(callback, null);
}

HueHttpAPI.prototype.GetGroupInfo = function (group, callback) {
	if (group < 1)
		throw "Invalid Group Number";

	this.invokeGroupQuery(callback, light);
}

HueHttpAPI.prototype.GetGroups = function (callback) {
	this.invokeGroupQuery(callback, null);
}

// Hue Light Control Services

HueHttpAPI.prototype.TurnOn = function (light, callback) {
	if (light == undefined || light == null || light < 1) {
		callback(new Error("Invalid Light Number"), null);
		return;
	}

	this.setLightState(callback, light, { "on": true });
}

HueHttpAPI.prototype.TurnOff = function (light, callback) {
	if (light == undefined || light == null || light < 1) {
		callback(new Error("Invalid Light Number"), null);
		return;
	}

	this.setLightState(callback, light, { "on": false });
}

HueHttpAPI.prototype.SetBrightness = function (light, brightness, callback) {
	if (light == undefined || light == null || light < 1) {
		callback(new Error("Invalid Light Number"), null);
		return;
	}

	if (brightness == undefined || brightness == null || brightness < 0 || brightness > 255) {
		callback(new Error("Invalid Brightness"), null);
		return;
	}

	this.setLightState(callback, light, { "bri": brightness });
}

HueHttpAPI.prototype.SetHSV = function (light, hue, saturation, value, callback) {
	if (light == undefined || light == null || light < 1) {
		callback(new Error("Invalid Light Number"), null);
		return;
	}

	if (hue == undefined || hue == null || hue < 0 || hue > 65535) {
		callback(new Error("Invalid Hue"), null);
		return;
	}

	if (saturation == undefined || saturation == null || saturation < 0 || saturation > 255) {
		callback(new Error("Invalid Saturation"), null);
		return;
	}

	if (value == undefined || value == null || value < 0 || value > 255) {
		callback(new Error("Invalid Value"), null);
		return;
	}

	this.setLightState(callback, light, { "hue": hue, "sat": saturation, "bri": value });
}

HueHttpAPI.prototype.SetRGB = function (light, red, green, blue, callback) {
	if (light == undefined || light == null || light < 1) {
		callback(new Error("Invalid Light Number"), null);
		return;
	}

	if (red == undefined || red == null || red < 0 || red > 255) {
		callback(new Error("Invalid Red"), null);
		return;
	}

	if (green == undefined || green == null || green < 0 || green > 255) {
		callback(new Error("Invalid Green"), null);
		return;
	}

	if (blue == undefined || blue == null || blue < 0 || blue > 255) {
		callback(new Error("Invalid Blue"), null);
		return;
	}

	var hsv = rgbToHsv(red, green, blue);

	this.setLightState(callback, light, { "hue": hsv.h, "sat": hsv.s, "bri": hsv.v });
}

// Hue Group Control Services

HueHttpAPI.prototype.TurnGroupOn = function (group, callback) {
	if (group == undefined || group == null || group < 0) {
		callback(new Error("Invalid Group Number"), null);
		return;
	}

	this.setGroupState(callback, group, { "on": true });
}

HueHttpAPI.prototype.TurnGroupOff = function (group, callback) {
	if (group == undefined || group == null || group < 0) {
		callback(new Error("Invalid Group Number"), null);
		return;
	}

	this.setGroupState(callback, group, { "on": false });
}

HueHttpAPI.prototype.SetGroupBrightness = function (group, brightness, callback) {
	if (group == undefined || group == null || group < 0) {
		callback(new Error("Invalid Group Number"), null);
		return;
	}

	if (brightness == undefined || brightness == null || brightness < 0 || brightness > 255) {
		callback(new Error("Invalid Brightness"), null);
		return;
	}

	this.setGroupState(callback, group, { "bri": brightness });
}

HueHttpAPI.prototype.SetGroupHSV = function (group, hue, saturation, value, callback) {
	if (group == undefined || group == null || group < 0) {
		callback(new Error("Invalid Group Number"), null);
		return;
	}

	if (hue == undefined || hue == null || hue < 0 || hue > 65535) {
		callback(new Error("Invalid Hue"), null);
		return;
	}

	if (saturation == undefined || saturation == null || saturation < 0 || saturation > 255) {
		callback(new Error("Invalid Saturation"), null);
		return;
	}

	if (value == undefined || value == null || value < 0 || value > 255) {
		callback(new Error("Invalid Value"), null);
		return;
	}

	this.setGroupState(callback, group, { "hue": hue, "sat": saturation, "bri": value });
}

HueHttpAPI.prototype.SetGroupRGB = function (group, red, green, blue, callback) {
	if (group == undefined || group == null || group < 0) {
		callback(new Error("Invalid Group Number"), null);
		return;
	}

	if (red == undefined || red == null || red < 0 || red > 255) {
		callback(new Error("Invalid Red"), null);
		return;
	}

	if (green == undefined || green == null || green < 0 || green > 255) {
		callback(new Error("Invalid Green"), null);
		return;
	}

	if (blue == undefined || blue == null || blue < 0 || blue > 255) {
		callback(new Error("Invalid Blue"), null);
		return;
	}

	var hsv = rgbToHsv(red, green, blue);

	this.setGroupState(callback, group, { "hue": hsv.h, "sat": hsv.s, "bri": hsv.v });
}


// Implementation of the HTTP API

HueHttpAPI.prototype.buildAPIURL = function (collection) {
	var apiURL;

	if (this.useHTTPS) {
		apiURL = "https://";
	}
	else {
		apiURL = "http://";
	}

	apiURL += this.host;
	apiURL += ":" + this.port;

	apiURL += HueAPIConstants.APIBase;

	apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + this.user);

	if (isNonEmpty(collection))
		apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + collection);

	return apiURL;
};

HueHttpAPI.prototype.invokeLightQuery = function (callback, light) {
	var apiURL = this.buildAPIURL(HueAPIConstants.Collections.LIGHTS);

	if (light !== undefined && light != null)
		apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + light);

	var parameters = {};

	this.rawInvokeService(apiURL, "GET", parameters, callback);
};

HueHttpAPI.prototype.invokeGroupQuery = function (callback, group) {
	var apiURL = this.buildAPIURL(HueAPIConstants.Collections.GROUPS);

	if (group !== undefined && group != null)
		apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + group);

	var parameters = {};

	this.rawInvokeService(apiURL, "GET", parameters, callback);
};

HueHttpAPI.prototype.setLightState = function (callback, light, state) {
	var apiURL = this.buildAPIURL(HueAPIConstants.Collections.LIGHTS);
	apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + light);
	apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + "state");

	this.rawInvokeService(apiURL, "PUT", state, callback);
};

HueHttpAPI.prototype.setGroupState = function (callback, group, state) {
	var apiURL = this.buildAPIURL(HueAPIConstants.Collections.GROUPS);
	apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + group);
	apiURL += (HueAPIConstants.RESTConstants.WEBAPP_PATH_DELIMITER + "action");

	this.rawInvokeService(apiURL, "PUT", state, callback);
};

HueHttpAPI.prototype.rawInvokeService = function (apiURL, method, jsonParameters, callback) {
	var jsonContent = JSON.stringify(jsonParameters);

	var self = this;

	var requestOptions = {
		url: apiURL,
		body: jsonContent,
		forever: true,
		headers: {
			'Content-Type': HueAPIConstants.MimeTypes.MIME_TYPE_JSON,
			'Accept': HueAPIConstants.MimeTypes.MIME_TYPE_JSON,
			'Cache-Control': 'no-cache'
		}
	};

	if (method === "POST") {
		request.post(
			requestOptions,
			function resultCallback(err, httpResponse, body) {
				if (callback) {
					if (err) {
						callback(err, null);
					}
					else {
						if (httpResponse.statusCode >= HueAPIConstants.StatusCodes.STATUS_BAD_REQUEST) {
							callback(new Error(httpResponse.statusMessage), null);
						}
						else {
							if (this.trace)
								console.debug(body);

							var result = JSON.parse(body);
							callback(null, result);
						}
					}
				}
			}
		);
	}
	else if (method === "GET") {
		request.get(
			requestOptions,
			function resultCallback(err, httpResponse, body) {
				if (callback) {
					if (err) {
						callback(err, null);
					}
					else {
						if (httpResponse.statusCode >= HueAPIConstants.StatusCodes.STATUS_BAD_REQUEST) {
							callback(new Error(httpResponse.statusMessage), null);
						}
						else {
							if (this.trace)
								console.debug(body);

							var result = JSON.parse(body);
							callback(null, result);
						}
					}
				}
			}
		);
	}
	else if (method === "DELETE") {
		request.delete(
			requestOptions,
			function resultCallback(err, httpResponse, body) {
				if (callback) {
					if (err) {
						callback(err, null);
					}
					else {
						if (httpResponse.statusCode >= HueAPIConstants.StatusCodes.STATUS_BAD_REQUEST) {
							callback(new Error(httpResponse.statusMessage), null);
						}
						else {
							if (this.trace)
								console.debug(body);

							var result = JSON.parse(body);
							callback(null, result);
						}
					}
				}
			}
		);
	}
	else if (method === "PUT") {
		request.put(
			requestOptions,
			function resultCallback(err, httpResponse, body) {
				if (callback) {
					if (err) {
						callback(err, null);
					}
					else {
						if (httpResponse.statusCode >= HueAPIConstants.StatusCodes.STATUS_BAD_REQUEST) {
							callback(new Error(httpResponse.statusMessage), null);
						}
						else {
							if (this.trace)
								console.debug(body);

							var result = JSON.parse(body);
							callback(null, result);
						}
					}
				}
			}
		);
	}
};

function rgbToHsv(r, g, b) {
	r /= 255, g /= 255, b /= 255;

	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, v = max;

	var d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return { "h": Math.floor(h * 65535), "s": Math.floor(s * 255), "v": Math.floor(v * 255) };
}

// Export the API object

module.exports = HueHttpAPI;


