import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import styles from './style.module.scss';

const Cards = () => {
  const containerRef = useRef(null);
  const interactionTimeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const [engine] = useState(Matter.Engine.create());

  useEffect(() => {
    const Engine = Matter.Engine,
          Bodies = Matter.Bodies,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Composite = Matter.Composite;

    const colors = ['#717273', '#666666', '#9d9fa0', '#888888']; 
    const specialTexts = ['JavaScript', 'React', 'Next.js', 'SASS', 'CSS', 'HTML'];
    const textList = ['JavaScript', 'TypeScript', 'CSS', 'SASS', 'HTML', 'PHP', 'React', 'Next.js', 'Node.js', 'MySQL', 'C#', 'ASP.NET', 'Adobe Photoshop', 'jQuery', 'Bootstrap', 'WordPress', 'WooComerce', 'VSCode', 'Adobe Illustrator', 'Hackathons', 'npm', 'git', 'React Three Fiber', 'Framer Motion', 'Domaining', 'Pentesting', "DaVinci Resolve"];

    let allCards = [], ground, wallLeft, wallRight, ceiling;

    class Card {
      constructor(text) {
        this.text = text;
        this.element = document.createElement('div');
        this.element.classList.add(styles.card);
        this.element.innerHTML = text;
        const color = specialTexts.includes(text) ? '#625BE6' : colors[Math.floor(Math.random() * colors.length)];
        this.element.style.backgroundColor = color;
        containerRef.current.appendChild(this.element);
        const { width, height } = this.element.getBoundingClientRect();
        this.width = width;
        this.height = height;
        const left = Math.random() * (containerRef.current.clientWidth - width);
        const top = Math.random() * (containerRef.current.clientHeight / 6) + height;
        this.body = Bodies.rectangle(left, top, width, height, { restitution: 0.8 });
        Composite.add(engine.world, this.body);
      }

      render() {
        const { x, y } = this.body.position;
        this.element.style.top = `${y - this.height / 2}px`;
        this.element.style.left = `${x - this.width / 2}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
      }

      setOpacity(opacity) {
        this.element.style.opacity = opacity;
      }

      remove() {
        Composite.remove(engine.world, this.body);
        this.element.remove();
      }
    }

    const createEnvironment = () => {
      if (allCards.length > 0) {
        emptyEnvironment();
      }

      const sizes = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      };

      allCards = textList.map(txt => new Card(txt));

      ground = Bodies.rectangle(sizes.width / 2, sizes.height + 100, sizes.width, 200, { isStatic: true, restitution: 2 });
      wallLeft = Bodies.rectangle(-100, sizes.height / 2, 200, sizes.height, { isStatic: true });
      wallRight = Bodies.rectangle(sizes.width + 100, sizes.height / 2, 200, sizes.height, { isStatic: true });
      ceiling = Bodies.rectangle(sizes.width / 2, -100, sizes.width, 200, { isStatic: true });

      Composite.add(engine.world, [ceiling, wallLeft, wallRight, ground]);
    };

    const emptyEnvironment = () => {
      allCards.forEach(card => card.remove());
      allCards = [];
      Composite.clear(engine.world, false);
    };

    const handleUserInteraction = () => {
      resetInteractionTimer();
      allCards.forEach(card => card.setOpacity(0.9));
    };

    const resetInteractionTimer = () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      interactionTimeoutRef.current = setTimeout(() => {
        allCards.forEach(card => card.setOpacity(0.5));
      }, 3000);
    };

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    Matter.Events.on(engine, 'beforeUpdate', () => {
      const maxSpeed = 70;
      const containerBounds = containerRef.current.getBoundingClientRect();

      allCards.forEach((card, index) => {
        const { body } = card;

        if (body.position.x < 0 || body.position.x > containerBounds.width ||
            body.position.y < 0 || body.position.y > containerBounds.height) {
          card.remove();
          allCards.splice(index, 1);
          const newCard = new Card(card.text);
          allCards.push(newCard);
        }

        if (Math.abs(body.velocity.x) > maxSpeed) {
          Matter.Body.setVelocity(body, { x: Math.sign(body.velocity.x) * maxSpeed, y: body.velocity.y });
        }
        if (Math.abs(body.velocity.y) > maxSpeed) {
          Matter.Body.setVelocity(body, { x: body.velocity.x, y: Math.sign(body.velocity.y) * maxSpeed });
        }
      });
    });

    const run = () => {
      allCards.forEach(card => card.render());
      Matter.Engine.update(engine);
      requestAnimationFrame(run);
    };

    createEnvironment();
    run();

    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);

    resetInteractionTimer();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        createEnvironment();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Matter.Engine.clear(engine);
      emptyEnvironment();
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [engine]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}></div>
    </div>
  );
};

export default Cards;
