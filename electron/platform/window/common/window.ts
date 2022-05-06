import { isLinux, isMacintosh, isWeb } from '../../../base/common/platform';

export enum TitleBarStyle {
  native = 'native',
  custom = 'custom',
}
const nativeTabs: boolean = false;
const nativeFullScreen: boolean = true;
const titleBarStyle = isLinux ? TitleBarStyle.native : TitleBarStyle.custom;

export function getTitleBarStyle() {
  if (isWeb) {
    return 'custom';
  }

  const useNativeTabs = isMacintosh && nativeTabs === true;
  if (useNativeTabs) {
    return TitleBarStyle.native;
  }

  const useSimpleFullScreen = isMacintosh && nativeFullScreen === false;
  if (useSimpleFullScreen) {
    return TitleBarStyle.native;
  }

  return titleBarStyle;
}
