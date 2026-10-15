export const heroDesktopMedia = "(min-aspect-ratio: 9/10)";
// Native crop dimensions and conservative logo bounds, in pixels of each crop.
export const heroArt = {
  desktop: {
    width: 1169,
    height: 654,
    focal: [612, 307],
    logo: [350, 30, 875, 585],
  },
  mobile: {
    width: 419,
    height: 889,
    focal: [209, 411],
    logo: [30, 210, 388, 612],
  },
} as const;
