import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../animation';
import Link from './Link';
import Footer from './Footer';

const navItems = [
  {
    title: "Introduction",
    href: "#introduction",
  },
  {
    title: "Insight",
    href: "#insight",
  },
  {
    title: "Interaction",
    href: "#interaction",
  },
]

export default function Index() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
      onAnimationStart={() => setIsMenuOpen(true)}
      onAnimationComplete={() => setIsMenuOpen(false)}
    >
      <div className={styles.body}>
        <div onMouseLeave={() => { setSelectedIndicator(pathname) }} className={styles.nav}>
          {
            navItems.map((data, index) => {
              return (
                <Link
                  key={index}
                  data={{ ...data, index }}
                  isActive={selectedIndicator == data.href}
                  setSelectedIndicator={setSelectedIndicator}
                />
              )
            })
          }
        </div>
        <Footer />
      </div>
    </motion.div>
  )
}
