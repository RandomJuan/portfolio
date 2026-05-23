import styles from './TextLightning.module.css';

export default function TextLightning({ label }: { label: string }) {
  return (
    <div className={styles.container}>
      <svg className={styles.svg} width="100%" height="100%">
        <defs>
          <filter id="text-lightning" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="noise">
              <animate attributeName="baseFrequency" values="0.15;0.2;0.15" dur="0.1s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* The solid, readable text (stable core) */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={styles.solidText}
        >
          {label}
        </text>

        {/* The moving lightning stroke that traces the font paths */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={styles.strokeText}
          filter="url(#text-lightning)"
        >
          {label}
        </text>
        
        {/* Secondary moving stroke going in the opposite direction for wild electricity */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={styles.strokeTextSecondary}
          filter="url(#text-lightning)"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
