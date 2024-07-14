import Gio from "gi://Gio"
import GObject from "gi://GObject"
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js'
import { QuickMenuToggle, SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js'
import { spawnCommandLine } from "resource:///org/gnome/shell/misc/util.js"
import * as Main from 'resource:///org/gnome/shell/ui/main.js'



const statusPattern =
	/(\(running\))/

const SyncthingStatus = Object.freeze({
	Running: "(running)",
	Error: "Error",
})


const ServiceToggle = GObject.registerClass(
	class ServiceToggle extends QuickMenuToggle {
		constructor(extensionObject) {
			super({
				title: _('Syncthing'),
				iconName: 'syncthing-symbolic',
				toggleMode: true,
				subtitle: 'Loading'
			})
			// Add a header with an icon, title and optional subtitle. This is
			// recommended for consistency with other quick settings menus.
			this.menu.setHeader('syncthing-symbolic', _('Syncthing'))

			this._settings = extensionObject.getSettings()


			// TODO: Add devices?
			// this._devicesSection = new PopupMenu.PopupMenuSection()
			// let devices = [
			// 	{ name: "Samsung Galaxy", completion: 100, id: "aa" },
			// 	{ name: "Microsoft Surface", completion: 90, id: "bb" }
			// ]
			// for (const device of devices) {
			// 	let title = new PopupMenu.PopupSeparatorMenuItem(device.name)
			// 	title.label.clutter_text.ellipsize = 0
			// 	title.label.style_class = 'device-name-label'

			// 	let percentageLabel = new St.Label({
			// 		text: device.completion + '%',
			// 		style_class: 'percentage-label'
			// 	})

			// 	let percentageBin = new St.Bin({
			// 		child: percentageLabel
			// 	})

			// 	title.actor.add_child(percentageBin)
			// 	this._devicesSection.actor.add_child(title)
			// }

			// Add a section of items to the menu
			this._itemsSection = new PopupMenu.PopupMenuSection()
			this._itemsSection.addAction(_('Open Web GUI'),
				() => {
					// Open the URL in the default browser
					const webGuiUrl = 'http://localhost:' + this._settings.get_int('port')
					try {
						Gio.app_info_launch_default_for_uri(webGuiUrl, null)
					} catch (e) {
						logError(e, 'Failed to open URL')
					}
				})

			// this.menu.addMenuItem(this._devicesSection)
			this.menu.addMenuItem(this._itemsSection)

			// Add an entry-point for more settings
			this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem())
			const settingsItem = this.menu.addAction('Extension Settings',
				() => extensionObject.openPreferences())

			// Ensure the settings are unavailable when the screen is locked
			settingsItem.visible = Main.sessionMode.allowSettings
			this.menu._settingsActions[extensionObject.uuid] = settingsItem
		}
	})

export var ServiceIndicator = GObject.registerClass(
	class ServiceIndicator extends SystemIndicator {
		constructor(extensionObject) {
			super()

			this._indicator = this._addIndicator()
			this._indicator.iconName = 'syncthing-symbolic'
			this._settings = extensionObject.getSettings()
			this._toggle = new ServiceToggle(extensionObject)
			this.quickSettingsItems.push(this._toggle)

			this._toggle.connect("clicked", async () => {
				let cmdline = `systemctl --user  ${!this._toggle.checked ? "stop" : "start"} syncthing.service`
				spawnCommandLine(cmdline)
				await this.checkStatus()

				// if the appropriate setting is enabled (default, also enable or disable the service)
				// not using enable --now because it's way slower and bugs the status.
				if (!this._settings.get_boolean('start-stop-only')) {
					cmdline = `systemctl --user  ${!this._toggle.checked ? "disable" : "enable"} syncthing.service`
					spawnCommandLine(cmdline)
				}
			})
		}

		async checkStatus() {
			try {
				const proc = Gio.Subprocess.new(
					["systemctl", "--user", "status", "syncthing.service"],
					Gio.SubprocessFlags.STDOUT_PIPE
				)

				const stdout = await new Promise((resolve, reject) => {
					proc.communicate_utf8_async(null, null, (proc, res) => {
						let [, stdout, stderr] = proc.communicate_utf8_finish(res)
						resolve(stdout)
					})
				})

				const status = statusPattern.exec(stdout)?.[1]
				this.updateStatus(status == "(running)")
				return SyncthingStatus[status]
			} catch (err) {
				this.updateStatus(false, SyncthingStatus.Error)
				logError("Err checking status:", err)
				return SyncthingStatus.Error
			}
		}

		updateStatus(isActive) {
			this._indicator.visible = isActive
			let optionalStatus = isActive ? "Running" : "Stopped"
			this._toggle.set({ checked: isActive, subtitle: optionalStatus })
		}

	})