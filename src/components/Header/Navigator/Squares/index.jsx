import React, { useRef, useMemo, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import { useGLTF } from '@react-three/drei';
import { easing } from 'maath';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const accents = ['#6D62FC', '#20ffa0', '#ff4060', '#ffcc00'];

const shuffle = (accent = 0) => {
  const colors = Array.from({ length: 12 }, (_, i) => ({
    color: i % 2 === 0 ? '#444' : 'white',
    roughness: i % 4 < 2 ? 0.1 : 0.75,
  }));

  const accentColors = Array.from({ length: 6 }, () => ({
    color: accents[accent],
    roughness: Math.random() > 0.5 ? 0.1 : 0.75,
    accent: true,
  }));

  return [...colors, ...accentColors];
};

export default function Squares() {

  return (
    <main id="introduction" className={styles.canvasContainer}>
      <div className={styles.shader}>
        <Scene className={styles.Canvas} />
      </div>
    </main>
  );
}

function Scene(props) {
  const [accent, setAccent] = useState(0);
  const Letters = useMemo(() => shuffle(accent), [accent]);

  const handleCanvasClick = () => setAccent((prev) => (prev + 1) % accents.length);

  return (
    <Canvas
      onClick={handleCanvasClick}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      {...props}
    >
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {Letters.map((props, i) => (
          <Letter key={i} {...props} />
        ))}
      </Physics>
      <EffectComposer disableNormalPass multisampling={2}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={6} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </Canvas>
  );
}

function Letter({ position, colliderPosition, rotation, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }) {
  const api = useRef();
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r]);
  const colliderPos = useMemo(() => colliderPosition || [1, 1, 0], [colliderPosition]);

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2));
  });

  return (
    <RigidBody linearDamping={2} angularDamping={2} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.78, 0.95, 0.57]} position={colliderPos} />
      {children || <Model {...props} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef();
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0));
  });

  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

function Model({ children, color = 'white', roughness = 0, ...props }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF('/k_squared.glb');

  useFrame((state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.3, delta);
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow scale={3.45} geometry={nodes.krzysztof.geometry}>
      <meshStandardMaterial metalness={0.3} roughness={roughness} map={materials.material.map} />
      {children}
    </mesh>
  );
}

export { Squares };
