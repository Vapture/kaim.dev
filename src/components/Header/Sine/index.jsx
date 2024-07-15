import React from 'react';
import styles from './style.module.scss';

const Wave = ({ isFlat }) => {
  return (
    <div className={styles.waveContainer}>
      <svg
        className={`${styles.wave} ${isFlat ? styles.flat : ''}`}
        viewBox="0 0 85 50"
        preserveAspectRatio="none"
      >
        <path
          d={isFlat ? "M0 25 L100 25" : "M0 25 Q 12.5 10, 25 25 T 50 25 T 75 25 T 100 25"}
          fill="none"
          stroke="white"
          strokeWidth="8"
        />
      </svg>
    </div>
  );
};

export default Wave;
