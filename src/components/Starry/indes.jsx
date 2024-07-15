import { useEffect, useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';

const Starry = () => {
  const canvasRef = useRef(null);

  const scaleFactor = 1; // Reduce the resolution by half

  const createStars = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        radius: Math.random() * 1.2,
        alpha: Math.random(),
        alphaChange: (Math.random() * 0.02) - 0.01, // Change rate between -0.01 and 0.01
      });
    }
    return stars;
  };

  const stars = useMemo(() => createStars(200), []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offscreenCanvas.width = canvas.width * scaleFactor;
    offscreenCanvas.height = canvas.height * scaleFactor;
  }, [canvasRef, scaleFactor]);

  const debouncedResizeCanvas = debounce(resizeCanvas, 100);

  useEffect(() => {
    window.addEventListener('resize', debouncedResizeCanvas);
    return () => {
      window.removeEventListener('resize', debouncedResizeCanvas);
    };
  }, [debouncedResizeCanvas]);

  const drawStars = useCallback((stars) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    stars.forEach((star) => {
      offscreenContext.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      offscreenContext.fillRect(star.x, star.y, star.radius, star.radius);

      star.alpha += star.alphaChange;
      if (star.alpha <= 0 || star.alpha >= 1) {
        star.alphaChange = -star.alphaChange;
      }
    });

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  let lastFrameTime = 0;

  const animate = useCallback(() => {
    const now = performance.now();
    if (now - lastFrameTime > 16) { // 60 FPS
      drawStars(stars);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      lastFrameTime = now;
    }
    requestAnimationFrame(animate);
  }, [drawStars, stars]);

  useEffect(() => {
    animate();
  }, [animate]);

  return (
    <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', zIndex: '1', pointerEvents: 'none' }} />
  );
};

export default Starry;