'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimatedModel from './gi/page'; // This must render only the <Canvas />
import styles from './page.module.css'; // Assume you're using CSS Modules

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={styles.mobileBlock}>
        <div>
          <h2>🚫 This website cannot be accessed on mobile devices.</h2>
          <p>Please open this site on a desktop or tablet for full functionality.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D animation in background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <AnimatedModel />
      </div>

      {/* UI overlay */}
      <div
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h1 style={{color: 'white',  fontWeight: 'bold'}}>Welcome to the AI Resume Builder</h1>
        <div>
          <Link href="/ai">
            <button style={buttonStyle}>🤖 Build with AI</button>
          </Link>
          <Link href="/builder">
            <button style={buttonStyle}>✍️ Build Manually</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: '0 1rem',
  padding: '1rem 2rem',
  fontSize: '1.2rem',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  background: '#ffffffcc',
  color: '#000',
  fontWeight: 'bold',
};
