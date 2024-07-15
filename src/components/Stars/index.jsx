// components/Starfield.js

import { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createStars = (numStars) => {
      const stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2,
          alpha: Math.random(),
          alphaChange: (Math.random() * 0.02) - 0.01, // Change rate between -0.01 and 0.01
        });
      }
      return stars;
    };

    const drawStars = (stars) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 2 * Math.PI, false);
        context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        context.fill();

        // Update the alpha for the twinkling effect
        star.alpha += star.alphaChange;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.alphaChange = -star.alphaChange; // Reverse the change direction at boundaries
        }
      });
    };

    const stars = createStars(200);

    const animate = () => {
      drawStars(stars);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ height: '100vh', display: 'block', zIndex: '1', pointerEvents: 'none' }} />;
};

export default Starfield;
