import { ResolvedThemeConfig } from '@/components/ThemeProvider/ThemeContext';
import styles from '../Fireflies.module.css';

interface GroundImpactsProps {
  theme: ResolvedThemeConfig;
}

export function GroundImpacts({ theme }: GroundImpactsProps) {
  return (
    <>
      <div
        className={styles.groundImpact1}
        style={{
          background: `radial-gradient(circle at center, rgba(${theme.firefly.primary}, 0.5) 0%, rgba(${theme.firefly.primary}, 0.2) 30%, transparent 60%)`
        }}
      />
      <div
        className={styles.groundImpact2}
        style={{
          background: `radial-gradient(circle at center, rgba(${theme.firefly.secondary}, 0.5) 0%, rgba(${theme.firefly.secondary}, 0.2) 30%, transparent 60%)`
        }}
      />
      <div
        className={styles.groundImpact3}
        style={{
          background: `radial-gradient(circle at center, rgba(${theme.firefly.primary}, 0.5) 0%, rgba(${theme.firefly.primary}, 0.2) 30%, transparent 60%)`
        }}
      />
      <div
        className={styles.groundImpact4}
        style={{
          background: `radial-gradient(circle at center, rgba(${theme.firefly.secondary}, 0.5) 0%, rgba(${theme.firefly.secondary}, 0.2) 30%, transparent 60%)`
        }}
      />
    </>
  );
}
