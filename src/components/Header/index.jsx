'use client'
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from './Button';
import Magnetic from '@/common/Magnetic';
import Wave from './Sine';
import Link from 'next/link';
import { useEffectContext } from '@/common/Effect';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const sections = [
    {
      title: 'Definitions',
      content: (
        <>
          <p><strong>GDPR:</strong> General Data Protection Regulation (EU) 2016/679. <strong>Administrator:</strong> Krzysztof Kaim, contactable at ul. Poniatowskiego 2, 32-020 Wieliczka. <strong>Personal Data:</strong> Information about an identified or identifiable natural person. <strong>User:</strong> Anyone visiting or using the Administrator’s online services.</p>
        </>
      ),
    },
    {
      title: 'General Information',
      content: (
        <>
          <p>The Administrator of the website and related services is Krzysztof Kaim. You can contact the Administrator via email: <a href="mailto:privacy@kaim.dev">privacy@kaim.dev</a>This Privacy Policy informs users about the personal data collected and how it is used. The purpose of this policy is to inform users about the extent and purpose of personal data processing, to specify how and for what purposes personal data is collected and used, to inform users about their rights under applicable data protection laws, and to ensure data security.</p>
        </>
      ),
    },
    {
      title: 'Data Processing Principles',
      content: (
        <>
          <p><strong>Lawfulness:</strong> Personal data is processed legally, respecting GDPR requirements. <strong>Fairness and Transparency:</strong> Data is processed fairly and transparently. <strong>Purpose Limitation:</strong> Data is collected for specific, legitimate purposes. <strong>Data Minimization:</strong> Only necessary data is processed. <strong>Accuracy:</strong> Data is kept accurate and up-to-date. <strong>Storage Limitation:</strong> Data is stored only as long as necessary. <strong>Integrity and Confidentiality:</strong> Data is processed securely to prevent unauthorized access, loss, or damage.</p>
        </>
      ),
    },
    {
      title: 'User Rights',
      content: (
        <>
          <p>Users have the right to access, rectify, delete, or restrict the processing of their personal data. They can also object to data processing and have the right to data portability.</p>
        </>
      ),
    },
    {
      title: 'Security Measures',
      content: (
        <>
          <p>The Administrator implements technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. Personal data provided by users is encrypted and protected using SSL certificates.</p>
        </>
      ),
    },
    {
      title: 'Changes to the Policy',
      content: (
        <>
          <p>The Administrator reserves the right to update this Privacy Policy as needed to reflect changes in legal requirements or service offerings. Users will be notified of any significant changes.</p>
        </>
      ),
    },
    {
      title: 'Contact Information',
      content: (
        <>
          <p>For any inquiries regarding the privacy policy or data protection, please contact Krzysztof Kaim at: <a href="mailto:privacy@kaim.dev">privacy@kaim.dev</a></p>
        </>
      ),
    },
    {
      title: 'Final Provisions',
      content: (
        <>
          <p>In matters not regulated by this Privacy Policy, the applicable provisions of Polish law shall apply.</p>
        </>
      ),
    },
  ];

  return (
    <div className={styles.privacyPolicy}>
      {sections.map((section, index) => (
        <div key={index}>
          <Magnetic>
          <h4 onClick={() => toggleSection(index)}>{section.title}</h4>
          </Magnetic>
          <AnimatePresence initial={false}>
            {activeSection === index && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 }
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                {section.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default function Index() {
  const header = useRef(null);
  const logo = useRef(null); // Ref for the logo
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);
  const locomotiveScrollRef = useRef(null);
  const [isFlat, setIsFlat] = useState(true);
  const audioRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false); // Add this state
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false); // State for privacy policy

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const setupScroll = async () => {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        locomotiveScrollRef.current = new LocomotiveScroll({
          el: document.querySelector('[data-scroll-container]'),
          smooth: true,
          multiplier: 1,
        });
      };

      setupScroll();

      return () => {
        if (locomotiveScrollRef.current) locomotiveScrollRef.current.destroy();
      };
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        event.target === header.current ||
        (!button.current.contains(event.target) && !header.current.contains(event.target))
      ) {
        setIsActive(false);
        setShowPrivacyPolicy(false); // Reset privacy policy state when clicking outside
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [button, header]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25); // Update state based on scroll position
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (locomotiveScrollRef.current) {
      let offset = 10; // default offset
      if (href === '#introduction') {
        offset = 150; // custom offset for #intro
      }
      if (href === '#experience') {
        offset = -80; // custom offset for #intro
      }
      if (href === '#contact') {
        offset = -400; // custom offset for #contact
      }
      const targetElement = document.querySelector(href);
      const targetTop = targetElement.offsetTop - offset;
      locomotiveScrollRef.current.scrollTo(targetTop);
    }
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setShowPrivacyPolicy(true);
    setIsActive(true);
  };

  const links = [
    { title: 'Intro', href: '#introduction' },
    { title: 'Skills', href: '#skills' },
    { title: 'Experience', href: '#experience' },
    { title: 'Contact', href: '#contact' },
  ];

  const footerLinks = [
    { title: 'Privacy Policy', href: '/privacy' },
  ];

  const slideIn = {
    initial: { opacity: 0, y: 20 },
    enter: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.215, 0.61, 0.355, 1] },
    }),
    exit: { opacity: 0, transition: { duration: 0.3, type: 'tween', ease: 'easeInOut' } },
  };

  const menu = {
    open: {
      width: showPrivacyPolicy ? 'calc(90vw > 1400px ? 1400px : 90vw)' : '300px', // Full screen width if showing privacy policy
      height: showPrivacyPolicy ? '90vh' : '500px', // Full screen height if showing privacy policy
      top: '20px',
      right: '-2%',
      transition: { duration: 0.3, type: 'tween', ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      width: '100px',
      height: '40px',
      top: '35px',
      right: '0%',
      transition: { duration: 0.25, delay: 0.2, type: 'tween', ease: [0.76, 0, 0.24, 1] },
    },
  };

  const handleMusicToggle = () => {
    setIsFlat(!isFlat);
    if (!isFlat) {
      // Fade out the music
      let volume = audioRef.current.volume;
      const fadeOutInterval = setInterval(() => {
        volume -= 0.1;
        if (volume < 0) {
          volume = 0;
        }
        audioRef.current.volume = volume;
        if (volume <= 0) {
          audioRef.current.pause();
          clearInterval(fadeOutInterval);
        }
      }, 50);
    } else {
      // Fade in the music
      let volume = 0;
      audioRef.current.volume = volume;
      audioRef.current.play();
      const fadeInInterval = setInterval(() => {
        volume += 0.1;
        if (volume > 1) {
          volume = 1;
        }
        audioRef.current.volume = volume;
        if (volume >= 1) {
          clearInterval(fadeInInterval);
        }
      }, 50);
    }
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
    if (isActive) {
      setShowPrivacyPolicy(false); // Reset privacy policy state when closing the menu
      document.body.classList.remove('menu-open'); // Remove the class when the menu is closed
    } else {
      document.body.classList.add('menu-open'); // Add the class when the menu is open
    }
  };

  return (
    <>
      <header className={styles.wrapper}>
        <div ref={header} className={styles.header}>
          <div ref={logo} className={`${styles.logo} ${isScrolled ? styles.hidden : ''}`}>
            <div className={styles.name}>
              <p className={`${styles.codeBy}`}>Krzysztof Kaim</p>
            </div>
          </div>
          <div className={styles.ButtonsContainer}>
            <div className={styles.headerButtonContainer}>
              <Magnetic>
                <div className={styles.buttonMusic} onClick={handleMusicToggle}>
                  <Wave isFlat={isFlat} />
                </div>
              </Magnetic>
            </div>
            <div className={styles.headerButtonContainer}>
              <Magnetic>
                <div className={styles.button}>
                  <a href="mailto:hello@kaim.dev">Let&#39;s talk</a>
                </div>
              </Magnetic>
            </div>
            <div ref={button} className={styles.headerButtonContainer}>
              <motion.div className={styles.menu} variants={menu} animate={isActive ? 'open' : 'closed'} initial="closed">
                <AnimatePresence>
                  {isActive && (
                    <div className={styles.collapsibleNav}>
                      <div className={styles.body}>
                        {!showPrivacyPolicy ? (
                          links.map((link, i) => (
                            <div key={`b_${i}`} className={styles.linkContainer}>
                              <motion.div custom={i} variants={slideIn} initial="initial" animate="enter" exit="exit">
                                <Magnetic><a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                                  {link.title}
                                </a></Magnetic>
                              </motion.div>
                            </div>
                          ))
                        ) : (
                          <PrivacyPolicy />
                        )}
                      </div>
                      <motion.div className={styles.footer}>
                        {footerLinks.map((link, i) => (
                          <motion.div
                            key={`f_${i}`}
                            custom={i}
                            variants={slideIn}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                          >
                            <Link href={link.href} legacyBehavior>
                              <Magnetic>
                              <a onClick={handlePrivacyClick}>{link.title}</a>
                              </Magnetic>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
              <Button isActive={isActive} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
      </header>
      <audio ref={audioRef} src="/music.mp3" loop={true} />
    </>
  );
}
