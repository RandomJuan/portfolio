export type ThemeId =
  | 'deep-blue'
  | 'deep-green'
  | 'cyber-cyan'
  | 'clean-white'
  | 'bright-orange'
  | 'amber-white';

export enum EffectStyle {
  BEAM = 'beam',
  FIREFLIES = 'fireflies'
}

export interface FireflyColor {
  /** Two RGB strings used to randomly pick a glow color per firefly */
  primary: string;
  secondary: string;
}

export interface ThemeModeConfig {
  /** CSS value for the body / canvas background (gradient or solid) */
  background: string;
  /** Radial gradient overlay inside the Fireflies canvas background layer */
  bgGradient: string;
  /** Diagonal linear gradient used exclusively for the Beam effect mode */
  beamGradient: string;
  /** Tailwind ring-color token for the switcher button, e.g. "ring-cyan-400" */
  accentRing: string;
  /** Tailwind text color class based on theme mode */
  textColor: string;
  /** Firefly glow colors */
  firefly: FireflyColor;
  /** Hex accent for navbar text / hover tint */
  accentHex: string;
  /** Optional custom contrast text color for elements that use accentHex as background */
  accentContrast?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  /** Evocative display name for the UI (e.g., Abyss, Noir) */
  displayName: string;
  /** Light mode configuration */
  light: ThemeModeConfig;
  /** Dark mode configuration */
  dark: ThemeModeConfig;
}
