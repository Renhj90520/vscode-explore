import { AppInfo } from '../../app/app-info';
import { isMacintosh } from '../../base/common/platform';
import { Menu, MenuItem } from 'electron';
import { getTitleBarStyle } from '../window/common/window';

export default class MenuBar {
  menubarMenus: any = {};
  keybindings: any = {};
  oldMenus = [];

  constructor() {
    this.install();
    this.registerListeners();
  }
  install() {
    const oldMenu = Menu.getApplicationMenu();

    if (oldMenu) {
      this.oldMenus.push(oldMenu);
    }

    // if (Object.keys(this.menubarMenus).length === 0) {
    //   Menu.setApplicationMenu(isMacintosh ? new Menu() : null);
    //   return;
    // }

    const menubar = new Menu();

    let macApplicationMenuItem: MenuItem;
    if (isMacintosh) {
      const applicationMenu = new Menu();

      macApplicationMenuItem = new MenuItem({
        label: AppInfo.nameShort,
        submenu: applicationMenu,
      });

      this.setMacApplicationMenu(applicationMenu);
      menubar.append(macApplicationMenuItem);
    }

    if (this.shouldDrawMenu('File')) {
    }
  }
  shouldDrawMenu(menuId) {
    if (isMacintosh && getTitleBarStyle() === 'custom') {
      return false;
    }

    switch (menuId) {
      case 'File':
      case 'Help':
        if (isMacintosh) {
          return !!this.menubarMenus && !!this.menubarMenus[menuId];
        }
        break;
      case 'Window':
        if (isMacintosh) {
          return !!this.menubarMenus;
        }
      default:
        return false;
    }
  }
  setMacApplicationMenu(applicationMenu: Menu) {
    // const about = this.createMenuItem(); todo
  }
  registerListeners() {}
}
