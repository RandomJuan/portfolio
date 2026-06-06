import { ResolvedThemeConfig } from '@/components/ThemeProvider/ThemeContext';
import styles from '../Fireflies.module.css';

interface DiagonalBeamsProps {
  theme: ResolvedThemeConfig;
}

export function DiagonalBeams({ theme }: DiagonalBeamsProps) {
  
  // Helper to generate the exact complex background gradient string
  const getBeamGradient = (rawColor: string) => {
    const bg = theme.background;
    if (theme.mode === 'light') {
      return `linear-gradient(to top right, ${bg} 0%, ${bg} 47.5%, ${rawColor} 49.85%, #ffffff 50%, ${rawColor} 50.15%, ${bg} 52.5%, ${bg} 100%)`;
    }
    const edgeColor = `color-mix(in srgb, ${rawColor} 12%, ${bg})`;
    return `linear-gradient(to top right, ${bg} 0%, ${bg} 42%, ${edgeColor} 48%, ${rawColor} 50%, ${edgeColor} 52%, ${bg} 58%, ${bg} 100%)`;
  };

  const primaryColor = `rgb(${theme.firefly.primary})`;
  const secondaryColor = `rgb(${theme.firefly.secondary})`;

  return (
    <>
      {/* BEAM 1: Dynamic Top-Left <-> Bottom-Right diagonal */}
      <div
        className={styles.bgGradient}
        style={{
          background: getBeamGradient(primaryColor),
          WebkitMaskImage: `linear-gradient(var(--beam1-dir, to bottom right), var(--beam1-mask-image))`,
          maskImage: `linear-gradient(var(--beam1-dir, to bottom right), var(--beam1-mask-image))`
        }}
      />

      {/* BEAM 2: Dynamic Top-Right <-> Bottom-Left diagonal */}
      <div
        className={styles.bgGradient}
        style={{
          background: getBeamGradient(secondaryColor),
          transform: 'scaleX(-1)', // Flips the gradient to originate from the opposite side
          WebkitMaskImage: `linear-gradient(var(--beam2-dir, to bottom right), var(--beam2-mask-image))`,
          maskImage: `linear-gradient(var(--beam2-dir, to bottom right), var(--beam2-mask-image))`
        }}
      />
    </>
  );
}
