/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of  MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Main from 'resource:///org/gnome/shell/ui/main.js'

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js'
import { ServiceIndicator } from './toggle.js'


export default class SyncthingToggleExtension extends Extension {
	enable() {
		this._indicator = new ServiceIndicator(this)
		this._indicator.checkStatus()
		Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator)
	}

	disable() {
		this._indicator.quickSettingsItems.forEach(item => item.destroy())
		this._indicator.destroy()
		this._indicator = null
	}
}
