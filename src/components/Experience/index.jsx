/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React from 'react';
import styles from './style.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import Experience from './Card';
import gsap from 'gsap';
import Image from 'next/image';
import { slideLR, slideRL } from '../../common/Animation/animation';

const experiences = [
  {
    title: "Vapture",
    description: "Full-Stack - Own Business",
    src: "icons/vapture_cad2.png",
    color: "#444444",
    date: "2020 - now",
    expanded: "As web developer driven by curiosity, I operate a business, conduct client communication and manage complex website projects (i.a. Robinson Travel, Tysiola) using hand-coded solutions (using React) along with Node.js and the .NET ecosystem, mainly ASP.NET (MVC), likewise CRMs (WordPress). As a freelancer, I translated multiple medical device manuals (TransPerfect)."
  },
  {
    title: "WSEI",
    description: "Front-End Developer",
    src: "icons/wsei_cad2.png",
    color: "#666666",
    date: "2016 - 2020",
    expanded: "As developer and graphic designer at WSEI, I co-organized 3 successful hackathons attracting 100+ participants using Microsoft tools within Azure. Streamlined team communication with hand-coded email newsletters. I created engaging graphics (infographics, social media posts) contributing to bragnd awareness. I led WSEIcraft 4.0 team as Student Government VP."
  },
  {
    title: "Archman",
    description: "Black-box Pentester",
    src: "icons/archman_cad2.png",
    color: "#888888",
    date: "2018 - 2019",
    expanded: "I uncovered high-risk vulnerabilities in proprietary ECM platform through black box penetration testing (Wireshark, AppSpider and Chrome Dev Tools), then documented findings in the accessible document with mitigation strategies and delivered them to development team. Presented findings reduced attack risk and clearly strengthened platform security."
  },
  {
    title: "Wieliczka Salt Mine",
    description: "Infrastructure Engineer",
    src: "icons/kopalnia_cad2.png",
    color: "#AAAAAA",
    date: "2015 - 2016",
    expanded: "I migrated data seamlessly between numerous Oracle Database sites,ensuring smooth transitions and data integrity, created a comprehensive local network map using Microsoft Visio, aiding in efficient network troubleshooting and maintenance. I demonstrated initiative by taking on physical maintenance of equipment, ensuring continued uptime and operation, also proactively shared knowledge, fostering team efficiency."
  }
];

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }
};

export default function Home() {
  const [modal, setModal] = useState({ active: false, index: 0 });
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const experienceContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  let xMoveContainer = useRef(null);
  let yMoveContainer = useRef(null);
  let xMoveCursor = useRef(null);
  let yMoveCursor = useRef(null);
  let xMoveCursorLabel = useRef(null);
  let yMoveCursorLabel = useRef(null);

  useEffect(() => {
    gsap.to(experienceContainer.current, {
      filter: () => `blur(${scrollY > 100 ? 10 : 0}px)`,
      ease: "power1.out",
      scrollTrigger: {
        trigger: experienceContainer.current,
        start: "bottom top+=15%",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  useEffect(() => {
    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });
  }, []);

  const moveItems = (x, y) => {
    xMoveContainer.current(x);
    yMoveContainer.current(y);
    xMoveCursor.current(x);
    yMoveCursor.current(y);
    xMoveCursorLabel.current(x);
    yMoveCursorLabel.current(y);
  };

  const manageModal = (active, index, x, y) => {
    moveItems(x, y);
    setModal({ active, index });
  };

  const applyMagneticEffect = (ref) => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = ref.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 20;
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
    const boxes = document.querySelectorAll(`.${styles.grid}`);
    const cleanups = [];
    boxes.forEach((box) => {
      const cleanup = applyMagneticEffect({ current: box });
      cleanups.push(cleanup);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section id="experience" onMouseMove={(e) => { moveItems(e.clientX, e.clientY); }} className={styles.experiences}>
      <div ref={experienceContainer} className={styles.wrapper}>
        <div className={styles.container}>
          {
            experiences.map((experience, index) => {
              const boxRef = useRef(null);
              const isInView = useInView(boxRef, {
                rootMargin: '-50% 0px', // Adjust this value as needed
                triggerOnce: true
              });

              const animationVariant = index % 2 === 0 ? slideLR : slideRL;
              return (
                <motion.div
                  key={index}
                  ref={boxRef}
                  variants={animationVariant}
                  animate={isInView ? 'open' : 'closed'}
                  className={styles.grid}
                >
                  <Experience
                    index={index}
                    title={experience.title}
                    description={experience.description}
                    manageModal={manageModal}
                  />
                  <Image
                    src={`/images/${experience.src}`}
                    width={1280}
                    height={960}
                    alt={experience.title}
                    className={styles.experienceImage}
                    priority={true}
                  />
                </motion.div>
              );
            })
          }
        </div>
      </div>
      <>
        <motion.div ref={modalContainer} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"} className={styles.modalContainer}>
          <div style={{ top: index * -100 + "%" }} className={styles.modalSlider}>
            {
              experiences.map((experience, index) => {
                const { expanded } = experience;
                return (
                  <div className={styles.modal} key={`modal_${index}`}>
                    {expanded}
                  </div>
                );
              })
            }
          </div>
        </motion.div>
        <motion.div ref={cursor} className={styles.cursor} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}></motion.div>
        <motion.div ref={cursorLabel} className={styles.cursorLabel} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}>{active ? experiences[index].date : ''}</motion.div>
      </>
    </section>
  );
}
