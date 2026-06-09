/**
 * Contact Section
 * ---------------
 * The footer section prompting user engagement and providing contact methods.
 * 
 * Responsibilities:
 * - Displays a primary call-to-action button that triggers a mailto link.
 * - Serves as the page footer, displaying copyright information and social media links.
 * - Includes a subtle background glow effect for aesthetic depth.
 */

import { ContactData } from "@/types/contact";
import styles from "./ContactSection.module.css";

type Props = {
  contactData: ContactData;
};

export default function ContactSection({ contactData }: Props) {
  return (
    <div className={styles.container}>
      
      {/* Decorative center glowing blob */}
      <div className={styles.blob} aria-hidden="true" />

      <div className={`${styles.contentWrapper} avoid-zone`}>
        <div>
          <h2 className={styles.title}>
            {contactData.title}
          </h2>
          <p className={styles.description}>
            {contactData.description}
          </p>
        </div>

        <a 
          href={`mailto:${contactData.buttonEmail}`}
          className={styles.actionButton}
        >
          {contactData.buttonText}
        </a>
      </div>

      {/* Footer Content: Positioned exactly at the absolute bottom of the container, padded to sit beautifully above the floating navbar */}
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          {contactData.copyright}
        </p>

        <div className={styles.socialsContainer}>
          {contactData.socials.map((social, index) => (
           <a key={index} href={social.url} className={styles.socialLink}>
             {social.name}
           </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
