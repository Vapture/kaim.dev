import React, { useRef, useEffect, useCallback, useState } from 'react';
import styles from './page.module.scss';
import { useInView, motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedBackground() {
  const containerRef = useRef(null);
  const stickyMaskRef = useRef(null);
  const maskRef = useRef(null);
  const initialMaskSize = 1;
  const targetMaskSize = 40;
  const easing = 0.15;
  let easedScrollProgress = 0;

  const box = useRef(null);
  const isInView = useInView(box);

  const [backgroundOpacity, setBackgroundOpacity] = useState(0.05);

  const getScrollProgress = useCallback(() => {
    if (!stickyMaskRef.current || !containerRef.current) {
      return 0;
    }
    const containerHeight = containerRef.current.getBoundingClientRect().height - window.innerHeight;
    if (containerHeight <= 0) return 0;
    const scrollProgress = stickyMaskRef.current.offsetTop / containerHeight;
    const delta = scrollProgress - easedScrollProgress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    easedScrollProgress += delta * easing;
    return easedScrollProgress;
  }, [easedScrollProgress, easing]);

  const animate = useCallback(() => {
    const scrollProgress = getScrollProgress();
    const maskSizeProgress = targetMaskSize * scrollProgress;
    stickyMaskRef.current.style.webkitMaskSize = (initialMaskSize + maskSizeProgress) * 80 + '%';
    setBackgroundOpacity(scrollProgress * 0.90);
    requestAnimationFrame(animate);
  }, [getScrollProgress]);

  useEffect(() => {
    requestAnimationFrame(animate);
  }, [animate]);

  return (
    <motion.section id="presentation" ref={maskRef} className={styles.main}>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.sticker}>Presentation</div>
        <div ref={stickyMaskRef} className={styles.stickyMask}>
          <video autoPlay controls={false} playsInline muted loop>
            <source src="/medias/Program.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </motion.section>
  );
}

export default AnimatedBackground;
