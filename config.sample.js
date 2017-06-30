module.exports = {
	unifi_controller: {
		username: 'USERNAME', // Username of controller user
		password: 'PASSWORD', // Password of controller user
		url: "CONTROLLER_IP", // IP address of your controller
		port: 8443, // Port of UniFi Controller
		site: 'UNIFI_SITE_ID' // Your UniFi Site ID
	},
	port: 8004, //WebUI Port Number
	known_devices: [ // Mac Addressses
		'11:22:33:44:55:66',
		'aa:bb:cc:dd:ee:ff'
	],
	on_connect_url: '', // URL to hit when device connects to network
	on_disconnect_url: '' // URL to hit when device disconnects from network
};
