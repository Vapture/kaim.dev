'use client';

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion';

import CookieConsentModal from '@/components/Cookies';
import Preloader from '../components/Preloader';

import Landing from '../components/Landing';
import Box from '../components/Bento';
import AnimatedBackground from '../components/Mask';
import Contact from '../components/Contact';
import Experience from '../components/Experience';

import { Fluid } from '@whatisjery/react-fluid-distortion';
import { EffectComposer } from '@react-three/postprocessing';
import { Canvas } from '@react-three/fiber';


export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

  const messageLoggedRef = useRef(false);
  useEffect(() => {
    if (!messageLoggedRef.current) {
      console.log(
        '%c kaim.dev ',
        `font-weight: bold; 
          font-size: 50px;
          color: #f4f4f4; 
          text-shadow: 
             -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, /* Black outline */
              3px 3px 0 #6b62f3,
              6px 6px 0 #544ec2, 
              9px 9px 0 #3d39b0,
              12px 12px 0 #26249f,
              15px 15px 0 #0f0e8d;
          padding: 10px 20px;   
          background-color: #f4f4f4;
          border-radius: 30px;`
      );
      messageLoggedRef.current = true;
    }
  }, []); 

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      const locomotiveScroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
      });
  
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = 'default';
        window.scrollTo(0, 0);
      }, 2000);
    })();
  }, []);

  return (
    <main data-scroll-container>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <CookieConsentModal/>
        <Landing />
        <Box />
        <AnimatedBackground />
        <Experience />
        <Contact />
    </main>
  );
}
