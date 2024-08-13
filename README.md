# Syncthing Toggle
A GNOME extension to toggle the Syncthing service from the quick settings menu.

> Requires the `syncthing` systemd service to be installed.

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="80" align="middle">][ego]

![image](https://github.com/user-attachments/assets/0bf6d551-35ec-44ae-8f63-7d5675eb57f9)


## Features

- Start or stop Syncthing service from the quick settings menu.
- Option to open the web GUI in the default browser.
- Can customize the port if you changed it in the configs, and choose whether
	or not to also enable / disable the service when toggling.

![image](https://github.com/user-attachments/assets/cef85bae-6347-42e3-9e7b-62564c2c094d)


## Installation

Get it from [GNOME Extensions](https://extensions.gnome.org/extension/7180/syncthing-toggle/) or download the [latest release](https://github.com/rehhouari/gnome-shell-extension-syncthing-toggle/releases)

## Contributing:

Feel free to open issues for bug fixes or feature requests, and pull requests to close them.

Pack extension:

```sh
gnome-extensions pack -f --extra-source=icons/ --extra-source=toggle.js syncthing-toggle@rehhouari.github.com
```


## Credits

This extension uses code from [Cloudflare WARP Toggle Extension](https://github.com/khaled-0/gnome-cloudflare-warp-toggle) by [@khaled-0](https://github.com/khaled-0)


## License

Copyright (c) 2024 Rafik El Hadi Houari.


[ego]: https://extensions.gnome.org/extension/7180/syncthing-toggle
