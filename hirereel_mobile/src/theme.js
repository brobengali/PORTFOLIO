export const THEME = {
  light: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#FAF5FF',
    surfaceTint: '#FDF2F8',
    ink: '#191A23',
    onInk: '#FFFFFF',
    onAccent: '#191A23',
    muted: '#5B5B66',
    border: '#191A23',
    borderWidth: 1.8,
    shadowColor: '#191A23',
    violet: '#8B5CF6',
    violetSoft: '#C4B5FD',
    mint: '#34D399',
    sun: '#FBBF24',
    yellow: '#FBBF24',
    pink: '#F9A8D4',
    danger: '#EF4444',
  },
  dark: {
    bg: '#0D0C14',
    surface: '#15141E',
    surfaceElevated: '#1B1830',
    surfaceTint: '#120F1C',
    ink: '#F3F1FF',
    onInk: '#0D0C14',
    onAccent: '#191A23',
    muted: '#A6A3BD',
    border: '#F3F1FF',
    borderWidth: 1.8,
    shadowColor: '#7C5CFF',
    violet: '#8B5CF6',
    violetSoft: '#C4B5FD',
    mint: '#34D399',
    sun: '#FBBF24',
    yellow: '#FBBF24',
    pink: '#F9A8D4',
    danger: '#F87171',
  },
};

export const lightTheme = THEME.light;
export const darkTheme = THEME.dark;

export function getShadow(color, offset = 4) {
  return {
    shadowColor: color,
    shadowOffset: { width: offset, height: offset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: offset,
  };
}
