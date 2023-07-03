const MOBILE_SIZE = 560;

export function isDesktopView() {
  return window.innerWidth > MOBILE_SIZE;
}

export function isMobileView() {
  return window.innerWidth <= MOBILE_SIZE;
}
