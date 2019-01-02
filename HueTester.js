var Logger = require('winston');

var HueHttpAPI = require('./HueHttpAPI.js');

var api = new HueHttpAPI();

api.setUseHTTPS(false);

api.setUser('aMLiCr4yyDQjFV6bSN5BGoxuuCDuEmVxmePX00AO');
api.setHost('192.168.1.178');

api.TurnGroupOn(
	2,
	function (err, data) {
		if (err) {
			Logger.error("Had error...");
			Logger.error(err);
		}

		api.SetGroupRGB(
			2,
			255,
			0,
			255,
			function (err, data) {
				if (err) {
					Logger.error("Had error...");
					Logger.error(err);
				}

				setTimeout(
					function () {
						api.TurnGroupOff(
							2,
							function (err, data) {
								if (err) {
									Logger.error("Had error...");
									Logger.error(err);
								}
							}
						);
					},
					3000);

			}
		);
	}
);

