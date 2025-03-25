# Syncthing Toggle

A GNOME extension to toggle the Syncthing service from the quick settings menu.

> Requires the `syncthing` systemd service to be installed.

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="80" align="middle">][ego]

![image](https://github.com/user-attachments/assets/0bf6d551-35ec-44ae-8f63-7d5675eb57f9)

## Features

- Start or stop Syncthing service from the quick settings menu.
- Option to open the web GUI in the default browser.
- Can customize the service name, the port, and choose whether
  or not to also enable / disable the service when toggling.

![Screenshot](https://github.com/user-attachments/assets/66067c8a-3dad-4c1e-a6e7-34fa5738d026)

## Installation

Get it from [GNOME Extensions](https://extensions.gnome.org/extension/7180/syncthing-toggle/) or download the [latest release](https://github.com/rehhouari/gnome-shell-extension-syncthing-toggle/releases)

## Contributing:

Feel free to open issues for bug fixes or feature requests, and pull requests to close them.

Pack extension:

```sh
gnome-extensions pack -f --extra-source=icons/ --extra-source=toggle.js .
gnome-extensions install syncthing-toggle@rehhouari.github.com.shell-extension.zip
```

## Credits

This extension uses code from [Cloudflare WARP Toggle Extension](https://github.com/khaled-0/gnome-cloudflare-warp-toggle) by [@khaled-0](https://github.com/khaled-0)

## License

Copyright (c) 2024 Rafik El Hadi Houari [GPLv3](LICENSE).

The Syncthing logo is under the [MPLv2](https://www.mozilla.org/en-US/MPL/2.0/), copyright The Syncthing Authors.

[ego]: https://extensions.gnome.org/extension/7180/syncthing-toggle
