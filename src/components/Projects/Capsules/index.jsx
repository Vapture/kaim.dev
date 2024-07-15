import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import styles from './style.module.scss';

const Cards = () => {
  const containerRef = useRef(null);
  const interactionTimeoutRef = useRef(null);
  const [statusText, setStatusText] = useState('Grab me!');

  useEffect(() => {
    /* Card */
    class Card {
      constructor(text) {
        this.element = document.createElement('section');
        this.element.classList.add(styles.card);
        this.element.innerHTML = text;

        // Set the background color based on the text content
        const specialTexts = ['Javascript', 'React', 'Adobe Photoshop'];
        const color = specialTexts.includes(text) ? '#6D62FC' : colors[Math.floor(Math.random() * colors.length)];
        this.element.style.backgroundColor = color;

        containerRef.current.appendChild(this.element);

        this.element.addEventListener('mousedown', handleUserInteraction);
        this.element.addEventListener('mouseup', handleUserInteraction);

        const { width, height } = this.element.getBoundingClientRect();
        this.width = width;
        this.height = height;

        const left = (Math.random() * (containerRef.current.clientWidth - width));
        const top = (Math.random() * (containerRef.current.clientHeight / 6)) + height;
        this.body = Matter.Bodies.rectangle(left, top, width, height, { restitution: 0.8 });
      }

      render() {
        const { x, y } = this.body.position;
        this.element.style.top = `${y - (this.height / 2)}px`;
        this.element.style.left = `${x - (this.width / 2)}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
      }

      setOpacity(opacity) {
        this.element.style.opacity = opacity;
      }
    }

    /* Engine setup */
    const Engine = Matter.Engine,
          Bodies = Matter.Bodies,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Composite = Matter.Composite;

    const engine = Engine.create();

    /* Text list */
    const textList = ['Javascript', 'Typescript', 'CSS', 'SASS', 'HTML', 'PHP', 'React', 'Next.js', 'Node.js', 'MySQL', 'C#', 'ASP.NET', 'Adobe Photoshop', 'jQuery', 'Bootstrap', 'WordPress', 'WooComerce', 'VSCode', 'Adobe Illustrator', 'Hackathons', 'npm', 'git', 'React Three Fiber', 'Framer Motion', 'Domaining', 'Pentesting'];

    const colors = ['#717273', '#666666', '#9d9fa0', '#888888']; // Color options
    let allCards = [], 
        ground, 
        wallLeft, 
        wallRight, 
        ceiling;

    const createEnvironment = () => {
      if (allCards.length > 0) {
        emptyEnvironment();
      }

      const sizes = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      };

      // Create cards with assigned colors
      allCards = textList.map(txt => new Card(txt));

      ground = Bodies.rectangle(
        sizes.width / 2, 
        sizes.height + 100, 
        sizes.width, 
        200, 
        { isStatic: true, restitution: 2 }
      );
      wallLeft = Bodies.rectangle(
        -100, 
        sizes.height / 2, 
        200, 
        sizes.height, 
        { isStatic: true }
      );
      wallRight = Bodies.rectangle(
        sizes.width + 100, 
        sizes.height / 2, 
        200, 
        sizes.height, 
        { isStatic: true }
      );
      ceiling = Bodies.rectangle(
        sizes.width / 2, 
        -100, 
        sizes.width, 
        200, 
        { isStatic: true }
      );

      Composite.add(engine.world, [ceiling, wallLeft, wallRight, ground, ...allCards.map(each => each.body)]);
    };

    const emptyEnvironment = () => {
      Composite.remove(engine.world, [ceiling, wallLeft, wallRight, ground, ...allCards.map(each => each.body)]);
      containerRef.current.innerHTML = '';
      allCards = [];
    };

    const handleUserInteraction = () => {
      resetInteractionTimer();
      allCards.forEach(card => card.setOpacity(1));
    };

    const resetInteractionTimer = () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      interactionTimeoutRef.current = setTimeout(() => {
        allCards.forEach(card => card.setOpacity(0.5));
      }, 4000);
    };

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    Matter.Events.on(engine, 'beforeUpdate', () => {
      const maxSpeed = 70;
      const containerBounds = containerRef.current.getBoundingClientRect();

      allCards.forEach(card => {
        const { body } = card;
        
        if (body.position.x < 0 || body.position.x > containerBounds.width ||
            body.position.y < 0 || body.position.y > containerBounds.height) {
          // Set status text to "Out of bounds"
          setStatusText('Out of bounds!');
          setTimeout(() => setStatusText('Grab me!'), 2000);

          // Remove the card from the world and container
          Composite.remove(engine.world, body);
          card.element.remove();
          // Create a new card and add it to the world
          const newCard = new Card(card.element.innerHTML);
          allCards.push(newCard);
          Composite.add(engine.world, newCard.body);
        }

        if (body.velocity.x > maxSpeed) {
          Matter.Body.setVelocity(body, { x: maxSpeed, y: body.velocity.y });
        }

        if (body.velocity.x < -maxSpeed) {
          Matter.Body.setVelocity(body, { x: -maxSpeed, y: body.velocity.y });
        }

        if (body.velocity.y > maxSpeed) {
          Matter.Body.setVelocity(body, { x: body.velocity.x, y: maxSpeed });
        }

        if (body.velocity.y < -maxSpeed) {
          Matter.Body.setVelocity(body, { x: body.velocity.x, y: -maxSpeed });
        }
      });

      // Filter out the removed cards from the allCards array
      allCards = allCards.filter(card => containerRef.current.contains(card.element));
    });

    const run = () => {    
      allCards.forEach(card => card.render());
      Matter.Engine.update(engine);
      requestAnimationFrame(run);
    };

    createEnvironment();
    run();

    // Set up event listeners to detect user interaction
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);

    resetInteractionTimer();

    return () => {
      Matter.Engine.clear(engine);
      emptyEnvironment();
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {statusText}
      <div className={styles.container} ref={containerRef}></div>
    </div>
  );
};

export default Cards;
