// components/ContactForm.js
import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './style.module.scss';
import Magnetic from '@/common/Magnetic';
import Rounded from '../../../common/Magnetic';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '' 
  });

  const [status, setStatus] = useState('');
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recaptchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      if (response.ok) {
        setStatus('Email sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        setStatus(`Failed to send email: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.contact}>
        <form onSubmit={handleSubmit} className={styles.body}>
          <div className={styles.inputs}>
        <div className={styles.row}>
          <input className={styles.input} type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Name"  required />
        </div>
        <div className={styles.row}>
          <input className={styles.input} type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required />
        </div>
        <div className={styles.row}>
          <input className={styles.input} type="phone" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        </div>
        </div>
        <div className={styles.row}>
          <textarea className={styles.text} id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Message" required />
        </div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
          ref={recaptchaRef}
        />
        <div className={styles.below}>
        <p>reCAPTCHA is verifying if you&#39;re not a bot. This check happens in the background and uses minimal amount of data.</p>
        <Rounded>
        <button type="submit" className={styles.send}>Send</button>
        </Rounded>
        </div>
      </form>
      {status && <p>{status}</p>}
    </div>
    </div>
  );
};

export default ContactForm;
