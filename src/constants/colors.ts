// src/constants/colors.ts

export const PROPERTY_GROUP_COLORS: Record<string, string> = {
  brown: '#955436',
  lightBlue: '#aae0fa',
  pink: '#d93a96',
  orange: '#f7941d',
  red: '#f01b1b',
  yellow: '#ffed00',
  green: '#cde6d0',
  darkBlue: '#0072bb',
};

export const TILE_BG_COLORS: Record<string, string> = {
  ...PROPERTY_GROUP_COLORS,
  railroad: '#1f363d',
  utility: '#1f363d',
};
