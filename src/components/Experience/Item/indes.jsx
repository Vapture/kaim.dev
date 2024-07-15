import { useRef, useInView } from 'react';
import { motion } from 'framer-motion';
import { slideLR, slideRL } from '../../common/Animation/animation';
import Experience from '../../Experience/Card';
import Image from 'next/image';

const ExperienceItem = ({ experience, index, manageModal }) => {
  const boxRef = useRef(null);
  const isInView = useInView(boxRef, {
    rootMargin: '-50% 0px', // Adjust this value as needed
    triggerOnce: true
  });

  const animationVariant = index % 2 === 0 ? slideLR : slideRL;

  return (
    <motion.div
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
};

export default ExperienceItem;