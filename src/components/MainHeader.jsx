"use client";
import { useEffect, useState } from "react";
import styles from "./MainHeader.module.css";

export default function MainHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={styles.headerContainer}>
      <h2 className={styles.title}>Instant Resume Builder</h2>
      
    </div>
  );
}
