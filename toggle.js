import Gio from 'gi://Gio'
import GObject from 'gi://GObject'
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js'
import {
  QuickMenuToggle,
  SystemIndicator,
} from 'resource:///org/gnome/shell/ui/quickSettings.js'
import { spawnCommandLine } from 'resource:///org/gnome/shell/misc/util.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'

const statusPattern = /(\(running\))/

const ServiceToggle = GObject.registerClass(
  class ServiceToggle extends QuickMenuToggle {
    constructor(extensionObject, syncthingIcon) {
      super({
        title: _('Syncthing'),
        gicon: syncthingIcon,
        toggleMode: true,
        subtitle: 'Loading',
      })
      // Add a header with an icon, title and optional subtitle. This is
      // recommended for consistency with other quick settings menus.
      this.menu.setHeader(syncthingIcon, _('Syncthing'))

      this._settings = extensionObject.getSettings()

      // Add a section of items to the menu
      this._itemsSection = new PopupMenu.PopupMenuSection()
      this._itemsSection.addAction(_('Open Web GUI'), () => {
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
      const settingsItem = this.menu.addAction('Extension Settings', () =>
        extensionObject.openPreferences()
      )

      // Ensure the settings are unavailable when the screen is locked
      settingsItem.visible = Main.sessionMode.allowSettings
      this.menu._settingsActions[extensionObject.uuid] = settingsItem
    }
  }
)

export var ServiceIndicator = GObject.registerClass(
  class ServiceIndicator extends SystemIndicator {
    constructor(extensionObject) {
      super()

      const syncthingIcon = Gio.icon_new_for_string(
        extensionObject.path + '/icons/syncthing-symbolic.svg'
      )

      this._indicator = this._addIndicator()
      this._indicator.gicon = syncthingIcon
      this._settings = extensionObject.getSettings()
      this._toggle = new ServiceToggle(extensionObject, syncthingIcon)
      this.quickSettingsItems.push(this._toggle)

      this._toggle.connect('clicked', async () => {
        let cmdline = `systemctl --user  ${
          !this._toggle.checked ? 'stop' : 'start'
        } ${this._settings.get_string('service-name')}`
        spawnCommandLine(cmdline)
        await this.checkStatus()

        // if the appropriate setting is enabled (default, also enable or disable the service)
        // not using enable --now because it's way slower and bugs the status.
        if (!this._settings.get_boolean('start-stop-only')) {
          cmdline = `systemctl --user  ${
            !this._toggle.checked ? 'disable' : 'enable'
          } ${this._settings.get_string('service-name')}`
          spawnCommandLine(cmdline)
        }
      })
    }

    async checkStatus() {
      try {
        const proc = Gio.Subprocess.new(
          [
            'systemctl',
            '--user',
            'status',
            this._settings.get_string('service-name'),
          ],
          Gio.SubprocessFlags.STDOUT_PIPE
        )

        const stdout = await new Promise((resolve, _reject) => {
          proc.communicate_utf8_async(null, null, (proc, res) => {
            let [, stdout] = proc.communicate_utf8_finish(res)
            resolve(stdout)
          })
        })

        const status = statusPattern.exec(stdout)?.[1]
        this.updateStatus(status == '(running)')
      } catch (err) {
        this.updateStatus(false)
        logError('Err checking status:', err)
      }
    }

    updateStatus(isActive) {
      this._indicator.visible = isActive
      let status = isActive ? 'Running' : 'Stopped'
      this._toggle.set({ checked: isActive, subtitle: status })
    }
  }
)
