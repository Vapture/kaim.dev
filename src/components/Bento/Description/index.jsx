/* eslint-disable react-hooks/rules-of-hooks */
import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import { slideUpBento } from './animation';
export default function index() {

    const phrase = "I am software developer blending design and functionality, focusing on crafting beautiful, user-friendly interfaces. With recent Next.js mastering, I'm taking it to the next level. Let's build something amazing together!";
    const description = useRef(null);
    const isInView = useInView(description)
    return (
        <div className={styles.descriptionWrapper}>
        <div ref={description} className={styles.description}>
            <div className={styles.body}>
                <p>
                {
                    phrase.split(" ").map( (word, index) => {
                        return <span key={index} className={styles.mask}><motion.span variants={slideUpBento} custom={index} animate={isInView ? "open" : "closed"} key={index}>{word}</motion.span></span>
                    })
                }
                </p>
                <div data-scroll data-scroll-speed={0.1}>
            </div>
            </div>
        </div>
        </div>
    )
}
