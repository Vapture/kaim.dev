import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Magnetic from '@/common/Magnetic';

const CookieConsentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setIsConsentGiven(true);
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsConsentGiven(true);
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsConsentGiven(true);
    setIsOpen(false);
  };

  if (!isOpen || isConsentGiven) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <p>
          The website uses cookies. Both the essential ones - enabling the use of the website and additional ones to support analytics and marketing. Click to accept the cookies of your choice.
          </p>
          
          <p>
          This website does not have any ads, yet some part of applications that integrate heavily into the structure, e.g. Brave Shield, may result in e.g. incorrectly encoded fonts. In case of any problems consider turning them off.
        </p>
        <div className={styles.buttons}>
        <Magnetic>
          <button className={styles.accept} onClick={handleAccept}>
            Accept
          </button>
          </Magnetic>
          <Magnetic>
          <button className={styles.decline} onClick={handleDecline}>
            Decline
          </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal;
