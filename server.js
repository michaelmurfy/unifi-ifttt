var unifi = require('node-unifi');
var config = require('./config');

var initial_load_complete = false;
var connected_devices = {};

var request = require('request');
var controller = new unifi.Controller(config.unifi_controller.url, config.unifi_controller.port);
controller.login(config.unifi_controller.username, config.unifi_controller.password, function (err) {
	if (err) {
		console.log('ERROR: ' + err);
		return;
	}

	getClientDevices();
	setInterval(getClientDevices, 5000);
});

function shutDown() {
	controller.logout(function () {
		console.log("\nLogged out of controller.");
		process.exit();
	});
}

function getClientDevices() {
	controller.getClientDevices(config.unifi_controller.site, function(err, client_data) {
		var unfoundDevices = JSON.parse(JSON.stringify(config.known_devices));
		for (var i = 0; i < client_data[0].length; i++) {
			var device = client_data[0][i];
			var index = unfoundDevices.indexOf(device.mac);
			if (index > -1) {
				unfoundDevices.splice(index, 1);
				addDevice(device);
			}
			// else {
			// 	// console.log("Ignoring device: " + device.mac + ' >> ' + device.hostname);
			// }
		}
		for (var i = 0; i < unfoundDevices.length; i++) {
			if (connected_devices.hasOwnProperty(unfoundDevices[i])) {
				var disconnectedDevice = connected_devices[unfoundDevices[i]];
				onDeviceDisconnect(disconnectedDevice);
				delete connected_devices[unfoundDevices[i]];
			}
		}
		// if (unfoundDevices.length == 0) {
		// 	console.log("All known devices are connected...");
		// }
	});
}

function addDevice(device) {
	if (!device || !device.mac || !device.hostname) {
		return;
	}
	// console.log("Found device: " + device.mac + ' >> ' + device.hostname);
	if (!connected_devices.hasOwnProperty(device.mac)) {
		connected_devices[device.mac] = {
			name: device.hasOwnProperty('name') ? device.name : '',
			mac: device.mac,
			hostname: device.hostname,
			first_seen: device.first_seen,
			last_seen: device.last_seen,
			latest_assoc_time: device.latest_assoc_time
		}
		onDeviceConnect(device);
	}
}

function onDeviceConnect(device) {
	if (device) {
		console.log("A known device connected to the WiFi: " + device.mac + ' >> ' + device.hostname);
	}
	request(config.on_connect_url, function (error, response, body) {
		console.log(response.statusCode == 200 ? 'Successful response from on_connect_url.' : 'Failed to hit on_connect_url');
	});
}

function onDeviceDisconnect(device) {
	if (device) {
		console.log("Device disconnected from WiFi: " + device.mac + ' >> ' + device.hostname);
	}
	request(config.on_disconnect_url, function (error, response, body) {
		console.log(response.statusCode == 200 ? 'Successful response from on_disconnect_url.' : 'Failed to hit on_disconnect_url');
	});
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', shutDown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', shutDown);

var server = require('express')();
server.all('/', function (req, res) {
	res.type('text/plain');
	var o = 'Connected devices:\n';
	for (var x in connected_devices) {
		var device = connected_devices[x];
		o += device.mac + ' >> ' + device.name + '\n';
	}
	res.send(o);
});

var alternate_test = false;
server.all('/test', function (req, res) {
	res.type('text/plain');
	alternate_test = !alternate_test;
	(alternate_test ? onDeviceConnect : onDeviceDisconnect)();
	res.send('Hitting test url: ' + (alternate_test ? 'ON' : 'OFF'));
});

server.listen(config.port, function () {
	console.log("Server listening on " + config.port + ".");
});