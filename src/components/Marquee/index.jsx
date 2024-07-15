import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import debounce from 'lodash/debounce';

gsap.registerPlugin(ScrollTrigger);

const ScrollingText = () => {
  const railRef = useRef(null);
  const defaultSpeed = 1;
  let timeoutId = null;

  useEffect(() => {

    const scrollingText = gsap.utils.toArray(railRef.current.children);
    if (scrollingText.length === 0) return; // Ensure there are elements to animate

    const horizontalLoop = (items, config) => {
      items = gsap.utils.toArray(items);
      config = config || {};
      const tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: 'none', force3D: true },
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
      });
      const length = items.length;
      const startX = items[0].offsetLeft;
      const times = [];
      const widths = [];
      const xPercents = [];
      let curIndex = 0;
      const pixelsPerSecond = (config.speed || 1) * 100;
      const snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1);
      let totalWidth;

      gsap.set(items, {
        xPercent: (i, el) => {
          const w = widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px'));
          xPercents[i] = snap(parseFloat(gsap.getProperty(el, 'x', 'px')) / w * 100 + gsap.getProperty(el, 'xPercent'));
          return xPercents[i];
        },
      });
      gsap.set(items, { x: 0, willChange: 'transform' });
      totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], 'scaleX') + (parseFloat(config.paddingRight) || 0);

      items.forEach((item, i) => {
        const curX = xPercents[i] / 100 * widths[i];
        const distanceToStart = item.offsetLeft + curX - startX;
        const distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
        tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
          .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
          .add('label' + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      });

      function toIndex(index, vars) {
        vars = vars || {};
        if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length; // always go in the shortest direction
        const newIndex = gsap.utils.wrap(0, length, index);
        let time = times[newIndex];
        if ((time > tl.time()) !== (index > curIndex)) {
          vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
      }

      tl.next = (vars) => toIndex(curIndex + 1, vars);
      tl.previous = (vars) => toIndex(curIndex - 1, vars);
      tl.current = () => curIndex;
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      return tl;
    };

    const loop = horizontalLoop(scrollingText, { repeat: -1, speed: defaultSpeed });

    const updateSpeed = debounce(() => {
      loop.timeScale(3.5);
      clearTimeout(timeoutId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutId = setTimeout(() => {
        gsap.to(loop, {
          timeScale: defaultSpeed,
          duration: 0.3,
          ease: 'power2.out',
        });
      }, 100);
    }, 10);

    window.addEventListener('scroll', updateSpeed);

    return () => {
      window.removeEventListener('scroll', updateSpeed);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.shader}>
          <div className={styles.scrollingText}>
            <div className={styles.rail} ref={railRef}>
              <h4> Fullstack Developer - Frontend Developer - Graphic Designer -</h4>
              <h4> Fullstack Developer - Frontend Developer - Graphic Designer -</h4>
              <h4> Fullstack Developer - Frontend Developer - Graphic Designer -</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingText;
