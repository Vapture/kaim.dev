import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './style.module.scss';

const Globe = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(800, 800);
    container.appendChild(renderer.domElement);
    const lights = [
      new THREE.PointLight(0x5a54ff, 0.75, 0, -150, 150, -50),
      new THREE.PointLight(0x4158f6, 0.75, 0, -400, 200, 150),
      new THREE.PointLight(0x803bff, 0.7, 0, 100, 250, -100),
    ];
    scene.add(...lights);
    const createSphere = (geometry, material) => {
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      return sphere;
    };

    const atmosphereShader = {
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.99 - dot(vNormal, vec3(0, 0, 1.0)), 6.0);
          gl_FragColor = vec4(0.349, 0.329, 0.82, 1.0) * intensity;
        }
      `,
    };

    const atmosphereGeometry = new THREE.SphereGeometry(2, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(atmosphereShader.uniforms),
      vertexShader: atmosphereShader.vertexShader,
      fragmentShader: atmosphereShader.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const atmosphere = createSphere(atmosphereGeometry, atmosphereMaterial);
    atmosphere.scale.set(1.05, 1.05, 1.05);
    atmosphere.position.set(-0.1, 0.1, 0);
    scene.add(atmosphere);

    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.MeshLambertMaterial({ color: 0x123456 });
    const globe = createSphere(globeGeometry, globeMaterial);

    const loader = new THREE.TextureLoader();
    const overlayMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('/globe.png'),
      transparent: true,
    });

    const overlaySphereGeometry = new THREE.SphereGeometry(2.003, 64, 64);
    const overlaySphere = createSphere(overlaySphereGeometry, overlayMaterial);
    globe.add(overlaySphere);
    scene.add(globe);

    const createDot = (latitude, longitude) => {
      const dotGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xf4f4f4 });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);

      const latRad = THREE.MathUtils.degToRad(latitude);
      const lonRad = THREE.MathUtils.degToRad(longitude);

      const radius = 2.1;
      dot.position.set(
        radius * Math.cos(latRad) * Math.sin(lonRad),
        radius * Math.sin(latRad),
        radius * Math.cos(latRad) * Math.cos(lonRad)
      );

      return dot;
    };

    const dot = createDot(51.5, 95.1);
    globe.add(dot);
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    const defaultRotationSpeed = 0.0015;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      rotationVelocity = { x: 0, y: 0 }; // Reset velocity when starting drag
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y,
        };

        globe.rotation.y += deltaMove.x * 0.01;
        globe.rotation.x += deltaMove.y * 0.01;
        rotationVelocity = { x: deltaMove.y * 0.01, y: deltaMove.x * 0.01 }; // Update rotation velocity

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUpOrOut = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUpOrOut);
    container.addEventListener('mouseout', onMouseUpOrOut);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 6;

    // Set initial rotation to expose Europe
    globe.rotation.y = -Math.PI / 4; // Rotate around y-axis
    globe.rotation.x = Math.PI / 6;  // Tilt around x-axis

    const animate = () => {
      if (!isDragging) {
        globe.rotation.y += defaultRotationSpeed;

        if (Math.abs(rotationVelocity.x) > 0.001 || Math.abs(rotationVelocity.y) > 0.001) {
          globe.rotation.y += rotationVelocity.y;
          globe.rotation.x += rotationVelocity.x;
          rotationVelocity.x *= 0.95; // Apply friction
          rotationVelocity.y *= 0.95; // Apply friction
        } else {
          rotationVelocity = { x: 0, y: 0 };
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      container.removeChild(renderer.domElement);
      container.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUpOrOut);
      container.removeEventListener('mouseout', onMouseUpOrOut);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}></div>
    </div>
  );
};

export default Globe;
