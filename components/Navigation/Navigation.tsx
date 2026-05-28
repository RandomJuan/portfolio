import { NavBarData } from "@/types/navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import styles from "./Navigation.module.css";

type Props = {
  navBarData: NavBarData;
  activeIndex: number;
  onNavigate: (index: number) => void;
};

export default function Navigation({ navBarData, activeIndex, onNavigate }: Props) {
  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navContainer}>
        {navBarData.items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(index)}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className={styles.label}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        <div className={styles.divider} />
        
        <ThemeSwitcher />
      </nav>
    </div>
  );
}
