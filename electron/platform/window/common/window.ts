import {
  isLinux,
  isMacintosh,
  isNative,
  isWeb,
} from '../../../base/common/platform';

export const WindowMinimumSize = {
  WIDTH: 400,
  WIDTH_WITH_VERTICAL_PANEL: 600,
  HEIGHT: 270,
};

export enum TitleBarStyle {
  native = 'native',
  custom = 'custom',
}

export const WindowSettings: any = {
  nativeTabs: false,
  nativeFullScreen: true,
  clickThroughInactive: true,
  titleBarStyle: isLinux ? TitleBarStyle.native : TitleBarStyle.custom,
  menuBarVisibility: isWeb ? 'compact' : 'classic',
};

export function getTitleBarStyle() {
  if (isWeb) {
    return 'custom';
  }

  const useNativeTabs = isMacintosh && WindowSettings.nativeTabs === true;
  if (useNativeTabs) {
    return TitleBarStyle.native;
  }

  const useSimpleFullScreen =
    isMacintosh && WindowSettings.nativeFullScreen === false;
  if (useSimpleFullScreen) {
    return TitleBarStyle.native;
  }

  return WindowSettings.titleBarStyle;
}

export type MenuBarVisibility =
  | 'classic'
  | 'visible'
  | 'toggle'
  | 'hidden'
  | 'compact';

export function getMenuBarVisibility(): MenuBarVisibility {
  const titleBarStyle = getTitleBarStyle();

  const menuBarVisibility = WindowSettings.menuBarVisibility;
  if (
    menuBarVisibility === 'default' ||
    (titleBarStyle === 'native' && menuBarVisibility === 'compace') ||
    (isMacintosh && isNative)
  ) {
    return 'classic';
  } else {
    if (['visible', 'toggle', 'hidden'].indexOf(menuBarVisibility) < 0) {
      return 'classic';
    }
    return menuBarVisibility;
  }
}

export function useNativeFullScreen() {
  if (WindowSettings.nativeTabs) {
    return true;
  }

  return WindowSettings.nativeFullScreen;
}
