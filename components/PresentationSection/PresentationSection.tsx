import { presentationCard } from "@/types/presentation"
import styles from "./PresentationSection.module.css"

type Props = {
  presentationCard: presentationCard
}

const PresentationCard = ({ presentationCard }: Props) => {
  return (
    <div className={styles.container}>

      <div className={`${styles.contentWrapper} avoid-zone`}>

        <div className={styles.roleBadge}>
          {presentationCard.role}
        </div>

        <h1 className={styles.nameHeading}>
          {presentationCard.name}
        </h1>

        <p className={styles.description}>
          {presentationCard.description}
        </p>

      </div>
    </div>
  )
}

export default PresentationCard