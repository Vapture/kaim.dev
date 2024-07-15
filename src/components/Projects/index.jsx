import React, { useRef } from 'react';
import Cards from './Capsules';
import styles from './style.module.scss';

const Works = () => {
  const skills = {
    programming: ['JavaScript', 'React', 'Next.js', 'Node.js', 'MySQL', 'WordPress', 'WooComerce', 'ASP.NET'],
    design: ['Adobe CC', 'DaVinci Resolve', 'Visual identity'],
    softSkills: ['Team conducting', 'Management', 'Product Vision']
  };

  const ref = useRef(null);

  return (
    <div id="projects" className={styles.box}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={`${styles.title} ${styles.open}`}>
            My <span>latest projects</span>
          </h2>
        </div>
        <div className={styles.skillsContainer} ref={ref}>
          {Object.entries(skills).map(([category, skillList]) => (
            <div className={styles.skillSection} key={category}>
              <div className={styles.skillHeader}>
                <span></span>
                <span>{category === 'programming' ? 'Programming' : category === 'design' ? 'Design & Branding' : 'Soft Skills'}</span>
              </div>
              <div className={styles.skillList}>
                {skillList.map((skill, index) => (
                  <div
                    className={`${styles.skill} ${styles.open}`}
                    key={index}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Cards />
      </div>
    </div>
  );
};

export default Works;
