import { AboutData } from "@/types/about";
import styles from "./AboutSection.module.css";

type Props = {
  aboutData: AboutData;
};

export default function AboutSection({ aboutData }: Props) {
  return (
    <div className={styles.container}>

      <div className={styles.imageColumn}>
        <div className={`${styles.imageFrame} avoid-zone`}>
          <img className={styles.image} src={aboutData.srcPhoto} alt="About photo" />
        </div>
      </div>

      <div className={`${styles.contentColumn} avoid-zone`}>
        <h2 className={styles.sectionLabel}>
          {aboutData.sectionTitle}
        </h2>
        <h3 className={styles.mainTitle}>
          {aboutData.mainTitle}
        </h3>
        <p className={styles.description}>
          {aboutData.description}
        </p>
        <div className={styles.highlightsContainer}>
          {aboutData.highlights.map((highlight, index) => (
            <div key={index} className={styles.highlightBadge}>
              {highlight}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
