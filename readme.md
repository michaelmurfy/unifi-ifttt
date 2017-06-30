Node.JS UniFi IFTTT
===================
The purpose of this is to simply call a URL (Hint: `IFTTT Webhooks`) when a client either connects or disconnects from your wireless network - handy for *lets say* turning on your outdoor Philips Hue bulbs when you arrive home automatically assuming your phone is charged or stalking your flatmate.

> **Note:**

> - This is a rough hack at best.
> - UniFi's can sometimes take up-to 1min to talk to the controller.
> - Please don't expose the web interface to the internet... There is **no security!**
> - Please don't *actually* use this to stalk your flatmate.

----------
**Usage:**
> - Clone this repo.
> - `cp config.sample.js config.js` then edit `config.js` to your liking.
> - You may also want to add some known device mac addresses in there too.
> - Change `on_connect_url` and `on_disconnect_url` to the URL's you want this to hit when your device connects or disconnects.
> - Save, exit etc. Run `npm install`.
> - Run the bastard with `node server.js` - you can also hit the server on port 8004 to get the current list of connected devices.

