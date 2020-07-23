import { from } from 'rxjs';

export * from './auth.guard';
export * from './error.interceptor';
export * from './jwt.interceptor';
export * from './http.client';
export * from './nav-menus';
export * from './error-state-matcher';

export const isIOS = window.navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
export const isAndroid = window.navigator.userAgent.match(/Android/i);
export const isMobileDevice = isIOS || isAndroid || window.navigator.userAgent.match(/webOS|BlackBerry|IEMobile|Opera Mini/i);
export const isMac = navigator.appVersion.indexOf('Mac') > -1;
