const spacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  margin: 16,
  gutter: 16,
};

const radiusScale = {
  sm: 4,
  md: 8,
  lg: 8,
  xl: 12,
  iconTile: 28,
  full: 9999,
};

const fontScale = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

const typographyScale = {
  displayHero: { fontSize: 36, lineHeight: 44, fontWeight: '700' },
  displayHeroMobile: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  headlineLg: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  headlineLgMobile: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  headlineMd: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  headlineMdMobile: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  headlineSm: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMd: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  labelLg: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
  labelMd: { fontSize: 14, lineHeight: 18, fontWeight: '500' },
  labelSm: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  // Convenience accessor: tokens.Typography.fontSize.lg etc.
  fontSize: {
    display: 36,
    lg: 28,
    md: 22,
    base: 16,
    sm: 14,
    xs: 12,
  },
};

export const Spacing = spacingScale;
export const Radius = radiusScale;
export const Typography = typographyScale;
export const Fonts = fontScale;
export const Shadows = {};

export const tokens = {
  fonts: fontScale,
  Fonts: fontScale,
  typography: typographyScale,
  Typography: typographyScale,
  spacing: spacingScale,
  Spacing: spacingScale,
  radius: radiusScale,
  Radius: radiusScale,
  radii: radiusScale,
  borderRadius: radiusScale,
};

export default tokens;
