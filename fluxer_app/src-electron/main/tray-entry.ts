/*
 * Copyright (C) 2026 Fluxer Contributors
 *
 * This file is part of Fluxer.
 *
 * Fluxer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fluxer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Fluxer. If not, see <https://www.gnu.org/licenses/>.
 */

import path from 'node:path';
import {app, Menu, Tray, nativeImage} from 'electron';
import {createWindow, getMainWindow, hideWindow, showWindow} from './window.js';

// Global reference to tray entry
let tray = null;

export function createTrayEntry(): void {
  // Construct tray entry
  // NOTE: icon from electron builder configured 'extraResources', may not show in dev
  const trayIconName = '32x32.png';
  const trayIconPath = path.join(process.resourcesPath, trayIconName);
  const trayIcon = nativeImage.createFromPath(trayIconPath)
  tray = new Tray(trayIcon);

  // Tray entry hover text
  tray.setToolTip('Fluxer')

  // Registering context menu
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Exit', 
      type: 'normal', 
      click() {
        app.quit();
      }
    }
  ])
  tray.setContextMenu(contextMenu)

  // Handle when tray clicked
  tray.on("click", () => {
    const mainWindow = getMainWindow();
    if (mainWindow === null || mainWindow.isDestroyed()) {
      createWindow()
      return;
    }
    
    mainWindow.isVisible() ? hideWindow() : showWindow()
  });
}