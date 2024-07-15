import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { Squares } from '../Header/Navigator/Squares';
import { slideUp } from './animation';
import ScrollingText from '../Marquee';

export default function Home() {
  return (
    <motion.section id="introduction" variants={slideUp} initial="initial" animate="enter" className={styles.landing}>
      <div className={styles.shader}>
      <Squares />
      <ScrollingText />
      </div>
    </motion.section>
  );
}