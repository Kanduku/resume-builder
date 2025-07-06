'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Make body & html fill the screen with no scroll
// if (typeof window !== 'undefined') {
//   document.documentElement.style.margin = '0';
//   document.documentElement.style.padding = '0';
//   document.documentElement.style.height = '100%';
//   document.body.style.margin = '0';
//   document.body.style.padding = '0';
//   document.body.style.height = '100%';
//   document.body.style.overflow = 'hidden';
// }

function AnimatedModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/24_dizzying_space_travel_-_inktober2019.glb');
  const mixer = useRef();

  useEffect(() => {
    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixer.current.clipAction(clip, group.current).play();
      });
    }
  }, [animations, scene]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive ref={group} object={scene} scale={1.5} />;
}

useGLTF.preload('/24_dizzying_space_travel_-_inktober2019.glb');

export default function Home() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: 'black',
      }}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        style={{ width: '100%', height: '100%', background: 'black' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <AnimatedModel />
        </Suspense>
        {/* OrbitControls removed to prevent user interaction */}
      </Canvas>
    </div>
  );
}
