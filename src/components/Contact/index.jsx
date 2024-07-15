import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Magnetic from '../../common/Magnetic';
import styles from './style.module.scss';
import Terminal from '../Terminal';
import ContactForm from './Form';

export default function Index() {
    const [timeInPoland, setTimeInPoland] = useState('');
    const [weatherDescription, setWeatherDescription] = useState('');

    useEffect(() => {
        fetch("https://api.weatherapi.com/v1/current.json?key=7484c87899ec4d38aad03950242804&q=Krakow")
            .then((response) => response.json())
            .then((data) => {
                let weatherDescription = data.current.condition.text;
                let words = weatherDescription.split(' ');
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                for (let i = 1; i < words.length; i++) {
                    words[i] = words[i].toLowerCase();
                }
                weatherDescription = words.join(' ');
                let temperatureCelsius = data.current.temp_c;
                let descriptionWithTemperature = `${weatherDescription}, ${temperatureCelsius}°C`;
                setWeatherDescription(descriptionWithTemperature);
            })
            .catch((error) => console.error("Error fetching weather data:", error));
    }, []);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
                timeZone: 'Europe/Warsaw'
            });
            const timeString = formatter.format(now);
            setTimeInPoland(timeString);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section id={"contact"} className={styles.contact}>               
            <div className={styles.body}>
                <div className={styles.title}>
                    <Terminal />
                    <ContactForm />
                </div>
                <div className={styles.info}>
                    <div>
                        <span>
                            <h3>Clock (Poland)</h3>
                            <p>{timeInPoland} (GMT +2)</p>
                        </span>
                        <span>
                            <h3>Conditions</h3>
                            <p>{weatherDescription}</p>
                        </span>
                    </div>
                    <div>
                        <span>
                            <h3>Clicks</h3>
                            <Magnetic>
                                <p><a href='https://www.facebook.com/kaim.chris/'>Facebook</a></p>
                            </Magnetic>
                        </span>
                        <Magnetic>
                            <p><a href='https://www.linkedin.com/in/krzysztof-kaim/'>Linkedin</a></p>
                        </Magnetic>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
