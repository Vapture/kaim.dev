import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cards from './Capsules';
import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { slideLR, slideRL } from '../../common/Animation/animation';
import Description from '../Bento/Description';
import Image from 'next/image';
import Globe from './Globe';
import debounce from 'lodash/debounce';

gsap.registerPlugin(ScrollTrigger);

const generateDecorationText = () => {
  const phrases = [
    "Currículum", "vítae", "Currículo", "Životopis", "Résumé", 
    "Sammanfattning", "Resume", "Kronologisk", "Profil", "Özgeçmiş", 
    "Curriculum", "Vitae", "Hresume", "Ansresume", "Uzdevums",
    "Lebenslauf", "Resumé", "Biodata", "CV", "Autobiografía", 
    "Biografía", "Cursus vitae", "Historique", "Jobbansökan", 
    "Currículum vitae", "Podsumowanie", "Historial", "Uppgift", 
    "Περίληψη", "Resumo", "Özgeçmiş", "Životopis", "Resume",
    "Résumé", "Resumo", "Rövid életrajz", "Önéletrajz", "Sākotnējais apraksts",
    "Jätk", "Tiivistelmä", "Aineisto", "Skrócone CV", "Összefoglaló"
  ];
  return phrases.map((phrase, index) => (
    <span key={index}>
      {phrase} <span className={styles.highlight}> CV </span> 
    </span>
  ));
};

// eslint-disable-next-line react/display-name
const SuperpowersComponent = React.memo(() => {
  const box = useRef(null);
  const bento = useRef(null);

  const firstBoxRef = useRef(null);
  const secondBoxRef = useRef(null);
  const thirdBoxRef = useRef(null);
  const forthBoxRef = useRef(null);

  const isInView = useInView(box);
  const [scrollX, setScrollX] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    debounce(() => {
      const scrolled = window.scrollY * 0.01;
      setScrollX(scrolled);
    }, 10),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    gsap.to(bento.current, {
      filter: () => `blur(${window.scrollY > 100 ? 10 : 0}px)`,
      ease: "power1.out",
      scrollTrigger: {
        trigger: bento.current,
        start: "bottom-=20% top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  const applyMagneticEffect = (ref) => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = ref.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 20; // Adjust the multiplier to control the movement intensity
      const y = ((clientY - rect.top) / rect.height - 0.5) * 20; // Adjust the multiplier to control the movement intensity
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
      ref.current.style.transform = 'translate(0, 0)';
    };

    ref.current.addEventListener('mousemove', handleMouseMove);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      ref.current.removeEventListener('mousemove', handleMouseMove);
      ref.current.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  useEffect(() => {
    const cleanupFirstBox = applyMagneticEffect(firstBoxRef);
    const cleanupSecondBox = applyMagneticEffect(secondBoxRef);
    const cleanupThirdBox = applyMagneticEffect(thirdBoxRef);
    const cleanupForthBox = applyMagneticEffect(forthBoxRef);

    return () => {
      cleanupFirstBox();
      cleanupSecondBox();
      cleanupThirdBox();
      cleanupForthBox();
    };
  }, []);

  return (
    <section id="skills" ref={box} className={styles.wrapper}>
      <div ref={bento} className={styles.bento}>
        <motion.div ref={firstBoxRef} variants={slideRL} animate={isInView ? "open" : "closed"} className={`${styles.firstBox} ${styles.magneticBox}`}>
          <div className={styles.container}>
            <div className={styles.sticker}>Interactive</div>
            <div className={styles.header}>
              <h2 className={styles.title}>
                Set of technologies
              </h2>
              <p>Techs I am familiar with</p>
            </div>
            <div className={styles.shading}>
              <Cards />
            </div>
          </div>
        </motion.div>
        <motion.div ref={secondBoxRef} variants={slideLR} animate={isInView ? "open" : "closed"} className={`${styles.secondBox} ${styles.magneticBox}`}>
          <div className={styles.container}>
            <div className={styles.sticker}>Information</div>
            <div className={styles.line}>
              <Image
                src="/images/photo_bento.png"
                alt="Profile picture"
                width={70}
                height={70}
              />
              <div className={styles.header}>
                <h2 className={styles.title}>
                  Hello there!
                </h2>
                <p className={styles.subtitle}>I am Krzysztof Kaim</p>
              </div>
            </div>
            <Description />
          </div>
        </motion.div>
        <motion.div
          ref={thirdBoxRef}
          variants={slideLR}
          animate={isInView ? "open" : "closed"}
          className={`${styles.thirdBox} ${styles.magneticBox}`}>
          <div className={styles.container}>
            <div className={styles.shading}>
              <span className={styles.decoration}>
                {Array.from({ length: 5 }, generateDecorationText)}
                <a className={styles.accent} href='https://kaim.dev/cv/krzysztof_kaim_resume.pdf'>Curriculum Vitae </a>
                {Array.from({ length: 7 }, generateDecorationText)}
              </span>
            </div>
            <div className={styles.sticker}>Document</div>
            <div className={styles.header}>
              <h2 className={styles.title}>
                Résumé
              </h2>
            </div>
          </div>
        </motion.div>
        <motion.div ref={forthBoxRef} variants={slideLR} animate={isInView ? "open" : "closed"} className={`${styles.forthBox} ${styles.magneticBox}`}>
          <div className={styles.container}>
            <div className={styles.sticker}>Interactive</div>
            <div className={styles.header}>
              <h2 className={styles.title}>
                Location
              </h2>
              <div className={styles.caption}>
                <p>Kraków, Poland</p>
              </div>
            </div>
            <div className={styles.shading}>
              <Globe />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default SuperpowersComponent;
