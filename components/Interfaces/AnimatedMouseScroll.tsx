import { FC, memo } from "react";
import styles from "../../styles/AnimatedMouseScroll.module.css";

const AnimatedMouseScroll: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      {/* Mouse body with scrolling dot */}
      <div className={styles.mouse}>
        <div className={styles.scrollDot} />
      </div>

      {/* Bouncing chevron arrows */}
      <div className={styles.chevrons}>
        <span className={styles.chevron} />
        <span className={styles.chevron} />
      </div>
    </div>
  );
};

export default memo(AnimatedMouseScroll);
