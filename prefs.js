import Adw from 'gi://Adw'
import Gio from 'gi://Gio'
import Gtk from 'gi://Gtk'

import {
  ExtensionPreferences,
  gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'

export default class SyncthingToggleExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings(
      'org.gnome.shell.extensions.syncthing-toggle'
    )
    this._window = window

    const iconTheme = Gtk.IconTheme.get_for_display(window.get_display())
    const iconsDirectory = this.dir.get_child('icons').get_path()
    iconTheme.add_search_path(iconsDirectory)

    this._general()
  }
  _general() {
    const page = new Adw.PreferencesPage()
    this._window.add(page)

    const group = new Adw.PreferencesGroup({
      title: _('General Settings'),
      description: _('Configure Syncthing Toggle'),
    })
    page.add(group)

    //#region servicename

    const serviceNameRow = new Adw.EntryRow({
      title: _('Service name'),
    })

    group.add(serviceNameRow)
    this._window._settings.bind(
      'service-name',
      serviceNameRow,
      'text',
      Gio.SettingsBindFlags.DEFAULT
    )

    //#endregion

    //#region port

    const portRow = new Adw.ActionRow({
      title: 'Syncthing port',
      subtitle: 'Set the port Syncthing runs on.',
    })

    let port = this._window._settings.get_int('port')

    const portInput = new Gtk.SpinButton({
      valign: Gtk.Align.CENTER,
      orientation: Gtk.Orientation.HORIZONTAL,
      numeric: true,
      adjustment: new Gtk.Adjustment({
        lower: 0,
        upper: 65535,
        step_increment: 1,
        value: port,
      }),
    })

    portRow.add_suffix(portInput)
    portRow.activatable_widget = portInput
    group.add(portRow)

    this._window._settings.bind(
      'port',
      portInput,
      'value',
      Gio.SettingsBindFlags.DEFAULT
    )

    //#endregion

    //#region stoponly

    const startStopOnlySwitch = new Adw.SwitchRow({
      title: _('Start/Stop only'),
      subtitle: _(
        'Whether or not to only start/stop or also enable/disable the Syncthing service when toggling.'
      ),
    })

    group.add(startStopOnlySwitch)
    this._window._settings.bind(
      'start-stop-only',
      startStopOnlySwitch,
      'active',
      Gio.SettingsBindFlags.DEFAULT
    )

    //#endregion

    //#region about button

    // About button - Thanks to @maniacx this could be done perfectly!
    const about_button = new Gtk.Button({
      margin_top: 8,
      margin_bottom: 8,
      child: new Adw.ButtonContent({
        icon_name: 'dialog-information-symbolic',
        label: _('About'),
      }),
    })

    // About Button Styles
    about_button.set_css_classes(['accent'])

    group.set_header_suffix(about_button)

    about_button.connect('clicked', () => {
      this._about()
    })

    //#endregion
  }

  _about() {
    const about_window = new Adw.AboutWindow({
      transient_for: this._window,
      modal: true,
    })
    about_window.set_application_icon('syncthing-logo-only')
    about_window.set_application_name(_('Syncthing Toggle'))
    about_window.set_version(`${this.metadata.version}.0`)
    about_window.set_developer_name('rehhouari (rehhouari@gmail.com)')
    about_window.set_issue_url(this.metadata.url + '/issues')
    about_window.set_website(this.metadata.url)
    about_window.set_license_type(Gtk.License.GPL_3_0)
    about_window.set_copyright('© 2024 rehhouari')
    about_window.show()
  }
}
