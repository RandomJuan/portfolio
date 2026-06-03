export type ThemeId =
  | 'deep-blue'
  | 'deep-green'
  | 'cyber-cyan'
  | 'clean-white'
  | 'bright-orange'
  | 'amber-white';

export interface FireflyColor {
  /** Two RGB strings used to randomly pick a glow color per firefly */
  primary: string;
  secondary: string;
}

export interface ThemeConfig {
  id: ThemeId;
  /** Evocative display name for the UI (e.g., Abyss, Noir) */
  displayName: string;
  /** Whether the background is dark or light — used by UI chrome */
  mode: 'dark' | 'light';
  /** CSS value for the body / canvas background (gradient or solid) */
  background: string;
  /** Radial gradient overlay inside the Fireflies canvas background layer */
  bgGradient: string;
  /** Diagonal linear gradient used exclusively for the Beam effect mode */
  beamGradient: string;
  /** Firefly glow colors */
  firefly: FireflyColor;
  /** Tailwind ring-color token for the switcher button, e.g. "ring-cyan-400" */
  accentRing: string;
  /** Hex accent for navbar text / hover tint */
  accentHex: string;
  /** Tailwind text color class based on theme mode */
  textColor: string;
}
